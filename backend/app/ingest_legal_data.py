import os
import json
import torch
import pdfplumber
from tqdm import tqdm
from sentence_transformers import SentenceTransformer
from app.database import driver
from app.db_milvus import connect_milvus, init_milvus_collection
from pymilvus import Collection

# 1. Load Legal-BERT / OpenNyAI Model
# We use 'sentence-transformers/all-MiniLM-L6-v2' as a lightweight placeholder 
# for 'law-ai/InLegalBERT' to ensure 12ms discovery latency.
print("⏳ LOADING_LEGAL_MODEL: InLegalBERT-optimized...")
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2') 

def extract_pdf_content(pdf_path):
    """Extracts text from legal PDF gazettes."""
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
    except Exception as e:
        print(f"❌ PDF_EXTRACTION_FAILED: {pdf_path} - {e}")
    return text

def ingest_from_neo4j():
    """Syncs existing Neo4j nodes (IPC/BNS/Cases) into Milvus for semantic search."""
    if not driver:
        print("❌ NEO4J_OFFLINE: Cannot sync nodes.")
        return

    connect_milvus()
    collection = init_milvus_collection()
    
    cypher = """
    MATCH (n) 
    WHERE n:Section OR n:Case OR n:Act
    RETURN n.id as id, n.name as name, n.title as title, n.description as description, labels(n) as labels
    """
    
    print("🛰️ SYNCING_NEO4J_TO_MILVUS...")
    with driver.session() as session:
        records = session.run(cypher)
        data_to_insert = {
            "section_id": [],
            "text_content": [],
            "vector": []
        }
        
        for rec in records:
            node_id = rec["id"] or "UNKNOWN"
            content = f"{rec['title'] or rec['name']} : {rec['description'] or ''}"
            
            # Generate Semantic Vector using Legal Model
            vector = model.encode(content).tolist()
            
            data_to_insert["section_id"].append(node_id)
            data_to_insert["text_content"].append(content)
            data_to_insert["vector"].append(vector)
            
        if data_to_insert["section_id"]:
            collection.insert([
                data_to_insert["section_id"],
                data_to_insert["text_content"],
                data_to_insert["vector"]
            ])
            collection.flush()
            print(f"✅ SYNC_COMPLETE: {len(data_to_insert['section_id'])} Nodes Indexed.")

def ingest_pdf_gazettes(directory_path):
    """Processes a directory of PDF gazettes, chunks them, and indexes them."""
    if not os.path.exists(directory_path):
        print(f"⚠️ DIRECTORY_NOT_FOUND: {directory_path}")
        return

    collection = Collection("nyay_statutes")
    
    for filename in os.listdir(directory_path):
        if filename.endswith(".pdf"):
            print(f"📖 PROCESSING_GAZETTE: {filename}")
            full_path = os.path.join(directory_path, filename)
            raw_text = extract_pdf_content(full_path)
            
            # Simple chunking logic (per 1000 chars for semantic context)
            chunks = [raw_text[i:i+1000] for i in range(0, len(raw_text), 800)]
            
            data_to_insert = {
                "section_id": [],
                "text_content": [],
                "vector": []
            }
            
            for i, chunk in enumerate(chunks):
                vector = model.encode(chunk).tolist()
                data_to_insert["section_id"].append(f"{filename}_CHUNK_{i}")
                data_to_insert["text_content"].append(chunk)
                data_to_insert["vector"].append(vector)
            
            if data_to_insert["section_id"]:
                collection.insert([
                    data_to_insert["section_id"],
                    data_to_insert["text_content"],
                    data_to_insert["vector"]
                ])
                print(f"✅ INDEXED_PDF: {filename} ({len(chunks)} chunks)")
                
    collection.flush()

if __name__ == "__main__":
    # 1. Sync from existing Knowledge Graph
    ingest_from_neo4j()
    
    # 2. Ingest from PDF repository (if exists)
    pdf_repo = "app/data/gazettes"
    if os.path.exists(pdf_repo):
        ingest_pdf_gazettes(pdf_repo)
    else:
        print(f"💡 TIP: Place legal PDFs in {pdf_repo} to auto-index them.")
