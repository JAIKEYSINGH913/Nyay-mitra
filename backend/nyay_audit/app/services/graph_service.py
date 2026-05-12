from neo4j import GraphDatabase
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env'))

class GraphService:
    def __init__(self):
        uri = os.getenv("NEO4J_URI")
        user = os.getenv("NEO4J_USER", os.getenv("NEO4J_USERNAME"))
        password = os.getenv("NEO4J_PASSWORD")
        try:
            # Fix: neo4j+s:// fails cert verification on Python 3.14
            if "+s://" in uri and "+ssc://" not in uri:
                uri = uri.replace("neo4j+s://", "neo4j+ssc://").replace("bolt+s://", "bolt+ssc://")
            self.driver = GraphDatabase.driver(uri, auth=(user, password))
        except Exception as e:
            print(f"Neo4j connection failed: {e}")
            self.driver = None

    def verify_citation(self, citation: dict):
        with self.driver.session() as session:
            if citation["type"] == "STATUTE":
                return self._verify_statute(session, citation)
            else:
                return self._verify_case_law(session, citation)

    def _verify_statute(self, session, citation):
        # Optimized Cypher for Section validation
        query = """
        MATCH (s:Section) 
        WHERE s.id = $citation_id OR s.title = $citation_id
        RETURN s.title AS title, s.description AS text, labels(s) AS type
        """
        # Mapping 'section' to 'citation_id' for the query
        # Support both '302' and 'IPC_302'
        cid = citation["section"]
        act = citation.get("act", "IPC")
        if not cid.startswith("IPC_") and not cid.startswith("BNS_"):
            cid = f"{act}_{cid}"
            
        result = session.run(query, citation_id=cid).single()
        if result:
            return True, {
                "title": result["title"],
                "text": result["text"],
                "type": "STATUTE",
                "raw": citation["raw"],
                "is_overruled": False,
                "labels": result["type"]
            }
        return False, None

    def _verify_case_law(self, session, citation):
        # Optimized Stare Decisis check — use party_a for more reliable matching
        party_a = citation.get("party_a", citation.get("raw", ""))
        full_name = citation.get("raw", "")
        
        query = """
        MATCH (c:Case)
        WHERE c.name CONTAINS $party_a OR c.name CONTAINS $full_name
        OPTIONAL MATCH (newer:Case)-[:OVERRULES]->(c)
        RETURN c.name AS name, 
               c.year AS year,
               c.citation AS citation_ref,
               c.summary AS summary,
               c.is_overruled AS is_overruled, 
               newer.name AS overruled_by
        """
        result = session.run(query, party_a=party_a, full_name=full_name).single()
        if result:
            return True, {
                "name": result["name"],
                "year": result["year"],
                "citation_ref": result["citation_ref"],
                "summary": result["summary"][:200] if result["summary"] else "",
                "type": "CASE_LAW",
                "raw": citation["raw"],
                "is_overruled": result["is_overruled"] or False,
                "overruled_by": result["overruled_by"]
            }
        return False, None

    def close(self):
        self.driver.close()
