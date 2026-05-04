import os
import json
from sentence_transformers import SentenceTransformer
from app.database import driver
from app.db_milvus import connect_milvus, init_milvus_collection

# Load Model (Match Bridge Service)
print("LOADING_LEGAL_MODEL: InLegalBERT-optimized...")
model = SentenceTransformer('law-ai/InLegalBERT')

def populate_neo4j_and_milvus():
    milvus_enabled = False
    try:
        connect_milvus()
        collection = init_milvus_collection()
        milvus_enabled = True
    except Exception as e:
        print(f"WARNING: MILVUS_POPULATION_SKIPPED: {e}")
    
    # Load JSON data
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    with open(os.path.join(data_dir, "ipc_bns_mapping.json"), "r") as f:
        mapping_data = json.load(f)
    with open(os.path.join(data_dir, "landmark_cases.json"), "r") as f:
        case_data = json.load(f)

    print(f"INFO: Found {len(mapping_data)} mappings and {len(case_data)} cases.")

    with driver.session() as session:
        # 1. Clear existing data (Optional, for clean state)
        # session.run("MATCH (n) DETACH DELETE n")
        
        # 2. Ingest IPC/BNS Mappings
        print("INFO: Ingesting IPC-BNS Mappings...")
        for item in mapping_data:
            ipc_id = item['ipc_section']
            bns_id = item['bns_section']
            ipc_text = item['ipc_text']
            bns_text = item['bns_text']
            
            # Neo4j
            session.run("""
                MERGE (i:Section {id: $ipc_id, code: 'IPC'})
                SET i.title = $ipc_id, i.description = $ipc_text
                MERGE (b:Section {id: $bns_id, code: 'BNS'})
                SET b.title = $bns_id, b.description = $bns_text
                MERGE (i)-[:MAPPED_TO {similarity: $similarity}]->(b)
            """, {
                "ipc_id": f"IPC_{ipc_id}", 
                "ipc_text": ipc_text,
                "bns_id": f"BNS_{bns_id}",
                "bns_text": bns_text,
                "similarity": 0.95 # Placeholder or calculated
            })
            
            # Milvus
            if milvus_enabled:
                for code, text in [(f"IPC_{ipc_id}", ipc_text), (f"BNS_{bns_id}", bns_text)]:
                    vector = model.encode(text).tolist()
                    collection.insert([
                        [code],
                        [text],
                        [vector]
                    ])

        # 3. Ingest Landmark Cases
        print("INFO: Ingesting Landmark Cases...")
        for item in case_data:
            case_id = item['id']
            name = item['name']
            summary = item['summary']
            citations = item.get('citations', [])
            sections = item.get('sections_referenced', [])
            
            # Neo4j
            session.run("""
                MERGE (c:Case {id: $case_id})
                SET c.name = $name, c.summary = $summary
                WITH c
                UNWIND $sections as secId
                MATCH (s:Section {id: secId})
                MERGE (c)-[:REFERENCES]->(s)
            """, {
                "case_id": case_id,
                "name": name,
                "summary": summary,
                "sections": sections
            })
            
            # Milvus
            if milvus_enabled:
                vector = model.encode(summary).tolist()
                collection.insert([
                    [case_id],
                    [summary],
                    [vector]
                ])

    if milvus_enabled:
        collection.flush()
    print("✅ DATABASE_POPULATION_COMPLETE")

if __name__ == "__main__":
    populate_neo4j_and_milvus()
    driver.close()
