from neo4j import GraphDatabase
import os

class GraphService:
    def __init__(self):
        uri = os.getenv("NEO4J_URI")
        user = os.getenv("NEO4J_USERNAME")
        password = os.getenv("NEO4J_PASSWORD")
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

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
        WHERE s.code = $citation_id OR s.provision_number = $citation_id
        RETURN s.provision_title AS title, s.description AS text, labels(s) AS type
        """
        # Mapping 'section' to 'citation_id' for the query
        result = session.run(query, citation_id=citation["section"]).single()
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
        # Optimized Stare Decisis check
        query = """
        MATCH (c:Case {citation_str: $citation_str})
        OPTIONAL MATCH (c)-[r:OVERRULES|REVERSED_BY]->(higher_authority)
        RETURN c.case_name AS name, 
               c.judgment_date AS date, 
               count(r) > 0 AS is_overruled, 
               higher_authority.case_name AS overruled_by
        """
        result = session.run(query, citation_str=citation["raw"]).single()
        if result:
            return True, {
                "name": result["name"],
                "date": str(result["date"]),
                "type": "CASE_LAW",
                "raw": citation["raw"],
                "is_overruled": result["is_overruled"],
                "overruled_by": result["overruled_by"]
            }
        return False, None

    def close(self):
        self.driver.close()
