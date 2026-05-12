from sentence_transformers import SentenceTransformer, util
import numpy as np
import os
import logging
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env'))
logger = logging.getLogger(__name__)


class MappingService:
    def __init__(self):
        # Using InLegalBERT from OpenNyAI ecosystem via Hugging Face
        try:
            self.model = SentenceTransformer('law-ai/InLegalBERT')
        except Exception:
            # Fallback to a standard legal-bert if InLegalBERT fails to load
            self.model = SentenceTransformer('nlpaueb/legal-bert-base-uncased')

    def calculate_similarity(self, text1: str, text2: str):
        embeddings = self.model.encode([text1, text2], convert_to_tensor=True)
        
        # Cosine Similarity
        cosine_score = util.cos_sim(embeddings[0], embeddings[1])
        similarity = cosine_score.item()
        
        # Euclidean Distance for additional telemetry
        distance = np.linalg.norm(embeddings[0].cpu().numpy() - embeddings[1].cpu().numpy())
        
        return similarity, distance

    def lookup_section_texts(self, ipc_section: str):
        """Look up both IPC and corresponding BNS texts from Neo4j."""
        from neo4j import GraphDatabase
        
        uri = os.getenv("NEO4J_URI")
        user = os.getenv("NEO4J_USER")
        password = os.getenv("NEO4J_PASSWORD")
        
        ipc_id = ipc_section if ipc_section.startswith("IPC_") else f"IPC_{ipc_section}"
        
        try:
            # Fix: neo4j+s:// fails cert verification on Python 3.14
            if "+s://" in uri and "+ssc://" not in uri:
                uri = uri.replace("neo4j+s://", "neo4j+ssc://").replace("bolt+s://", "bolt+ssc://")
            with GraphDatabase.driver(uri, auth=(user, password)) as driver:
                with driver.session() as session:
                    # Lookup IPC section
                    ipc_result = session.run("""
                        MATCH (s:Section {id: $id})
                        RETURN s.description as description, s.title as title
                    """, id=ipc_id).single()
                    
                    # Lookup mapped BNS section
                    bns_result = session.run("""
                        MATCH (i:Section {id: $id})-[:MAPPED_TO]->(b:Section)
                        RETURN b.id as id, b.title as title, b.description as description
                    """, id=ipc_id).single()
                    
                    ipc_text = ipc_result["description"] if ipc_result else ""
                    ipc_title = ipc_result["title"] if ipc_result else ipc_section
                    
                    bns_id = bns_result["id"] if bns_result else "UNKNOWN"
                    bns_title = bns_result["title"] if bns_result else "UNKNOWN"
                    bns_text = bns_result["description"] if bns_result else ""
                    
                    return {
                        "ipc_id": ipc_id,
                        "ipc_title": ipc_title,
                        "ipc_text": ipc_text,
                        "bns_id": bns_id,
                        "bns_title": bns_title,
                        "bns_text": bns_text,
                        "found": bool(ipc_result)
                    }
        except Exception as e:
            logger.error(f"Neo4j lookup failed: {e}")
            return {"found": False, "ipc_text": "", "bns_text": "", "bns_id": "UNKNOWN", "bns_title": "UNKNOWN"}

    def save_mapping(self, ipc_id: str, bns_id: str, similarity: float):
        """Persists a high-confidence mapping to Neo4j."""
        from neo4j import GraphDatabase
        
        uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        user = os.getenv("NEO4J_USER", "neo4j")
        password = os.getenv("NEO4J_PASSWORD", "password")
        
        ipc_id_full = ipc_id if ipc_id.startswith("IPC_") else f"IPC_{ipc_id}"
        bns_id_full = bns_id if bns_id.startswith("BNS_") else f"BNS_{bns_id}"
        
        try:
            # Fix: neo4j+s:// fails cert verification on Python 3.14
            if "+s://" in uri and "+ssc://" not in uri:
                uri = uri.replace("neo4j+s://", "neo4j+ssc://").replace("bolt+s://", "bolt+ssc://")
            with GraphDatabase.driver(uri, auth=(user, password)) as driver:
                with driver.session() as session:
                    session.run("""
                        MERGE (i:Section {id: $ipc_id, code: 'IPC'})
                        MERGE (b:Section {id: $bns_id, code: 'BNS'})
                        MERGE (i)-[r:MAPPED_TO]->(b)
                        SET r.similarity = $similarity, r.verified = false, r.updated_at = timestamp()
                    """, {"ipc_id": ipc_id_full, "bns_id": bns_id_full, "similarity": similarity})
        except Exception as e:
            logger.error(f"FAILED_TO_SAVE_MAPPING: {e}")
