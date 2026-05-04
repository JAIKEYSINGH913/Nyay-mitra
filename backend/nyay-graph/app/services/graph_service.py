import os
import logging
from neo4j import GraphDatabase
from pymilvus import connections, utility
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env'))

logger = logging.getLogger(__name__)

class GraphService:
    def __init__(self):
        self.neo4j_uri = os.getenv("NEO4J_URI")
        self.neo4j_user = os.getenv("NEO4J_USER", os.getenv("NEO4J_USERNAME"))
        self.neo4j_password = os.getenv("NEO4J_PASSWORD")
        self.neo4j_database = os.getenv("NEO4J_DATABASE", "neo4j")
        self.milvus_uri = os.getenv("MILVUS_URI", "http://localhost:19530")
        
        try:
            neo4j_uri = self.neo4j_uri
            # Fix: neo4j+s:// fails cert verification on Python 3.14
            if "+s://" in neo4j_uri and "+ssc://" not in neo4j_uri:
                neo4j_uri = neo4j_uri.replace("neo4j+s://", "neo4j+ssc://").replace("bolt+s://", "bolt+ssc://")
            self.driver = GraphDatabase.driver(
                neo4j_uri, 
                auth=(self.neo4j_user, self.neo4j_password)
            )
        except Exception as e:
            logger.error(f"Failed to connect to Neo4j: {e}")
            self.driver = None
            
    def get_database_status(self) -> Dict[str, Any]:
        """Check connection and counts for Neo4j and Milvus"""
        status = {
            "neo4j": {"status": "OFFLINE", "nodes": 0, "relationships": 0},
            "milvus": {"status": "OFFLINE", "collections": []}
        }
        
        # Check Neo4j
        if self.driver:
            try:
                with self.driver.session() as session:
                    # Test connection by running a simple query
                    node_count = session.run("MATCH (n) RETURN count(n) as count").single()["count"]
                    rel_count = session.run("MATCH ()-[r]->() RETURN count(r) as count").single()["count"]
                    status["neo4j"] = {
                        "status": "ONLINE",
                        "nodes": node_count,
                        "relationships": rel_count
                    }
            except Exception as e:
                logger.error(f"Neo4j query failed: {e}")

        # Check Milvus
        try:
            milvus_token = os.getenv("MILVUS_TOKEN")
            
            try:
                connections.connect(
                    "default", 
                    uri=self.milvus_uri, 
                    token=milvus_token
                )
                collections = utility.list_collections()
                status["milvus"] = {
                    "status": "ONLINE",
                    "collections": collections
                }
                connections.disconnect("default")
            except Exception as milvus_err:
                logger.error(f"Milvus Auth/Connection Error: {milvus_err}")
                status["milvus"] = {"status": "OFFLINE", "reason": str(milvus_err)[:100]}
        except Exception as e:
            logger.error(f"Milvus connection failed: {e}")
            
        return status

    def get_graph_data(self) -> Dict[str, Any]:
        """Retrieve nodes and links for the UI"""
        graph_data = {"nodes": [], "links": []}
        
        if not self.driver:
            return self._get_mock_data()
            
        try:
            with self.driver.session() as session:
                # 1. Fetch Sections (IPC and BNS)
                sections = session.run("""
                    MATCH (s:Section)
                    RETURN s.id as id, s.title as name, s.code as type, s.description as details
                    LIMIT 200
                """)
                
                for record in sections:
                    graph_data["nodes"].append({
                        "id": record['id'],
                        "name": f"{record['type']} {record['name']}",
                        "type": record['type'],
                        "details": record['details'],
                        "val": 20
                    })

                # 2. Fetch Cases
                cases = session.run("""
                    MATCH (c:Case)
                    RETURN c.id as id, c.name as name, 'CASE' as type, c.summary as details
                    LIMIT 100
                """)
                
                for record in cases:
                    graph_data["nodes"].append({
                        "id": record['id'],
                        "name": record['name'],
                        "type": record['type'],
                        "details": record['details'],
                        "val": 25
                    })

                # 3. Fetch Links (MAPPED_TO and REFERENCES)
                links = session.run("""
                    MATCH (n)-[r:MAPPED_TO|REFERENCES]->(m)
                    RETURN n.id as source, m.id as target
                """)
                
                for record in links:
                    graph_data["links"].append({
                        "source": record['source'],
                        "target": record['target']
                    })
                
                if not graph_data["nodes"]:
                    return self._get_mock_data()
                    
                return graph_data
                
        except Exception as e:
            logger.error(f"Error fetching graph data: {e}")
            return self._get_mock_data()

    def _get_mock_data(self) -> Dict[str, Any]:
        """Fallback mock data if Neo4j is empty or disconnected"""
        return {
          "nodes": [
            { "id": "IPC_302", "name": "IPC 302", "type": "IPC", "details": "Section 302 of the Indian Penal Code provides for the punishment of murder. It prescribes death or imprisonment for life, along with a fine.", "citations": ["Bachan Singh v. State of Punjab (1980)", "Mithu v. State of Punjab (1983)"], "val": 25 },
            { "id": "BNS_101", "name": "BNS 101", "type": "BNS", "details": "Section 101 of the Bharatiya Nyaya Sanhita corresponds to the punishment for murder. It maintains the core principles of IPC 302 but integrates into the new procedural framework of 2023.", "citations": ["BNS Gazette 2023", "BNS Committee Report"], "val": 20 },
            { "id": "CASE_2023_1", "name": "Bachan Singh v. Punjab", "type": "CASE", "details": "The landmark 'Rarest of Rare' case that established the guidelines for the death penalty under Section 302 IPC.", "citations": ["AIR 1980 SC 898"], "val": 18 },
            { "id": "IPC_307", "name": "IPC 307", "type": "IPC", "details": "Attempt to murder. Prescribes imprisonment for up to 10 years and fine.", "citations": ["State of Maharashtra v. Balram Bama Patil"], "val": 18 },
            { "id": "BNS_107", "name": "BNS 107", "type": "BNS", "details": "Attempt to murder under BNS. Re-categorized under the 'Offences against the Human Body' chapter.", "citations": ["BNS 2023 Schedule"], "val": 16 },
            { "id": "IPC_420", "name": "IPC 420", "type": "IPC", "details": "Cheating and dishonestly inducing delivery of property. Maximum punishment of 7 years.", "citations": ["S.W. Palanitkar v. State of Bihar"], "val": 18 },
            { "id": "BNS_316", "name": "BNS 316", "type": "BNS", "details": "The BNS equivalent for cheating, focusing on organized fraudulent activities.", "citations": ["BNS Whitepaper"], "val": 16 }
          ],
          "links": [
            { "source": "IPC_302", "target": "BNS_101" },
            { "source": "IPC_302", "target": "CASE_2023_1" },
            { "source": "BNS_101", "target": "CASE_2023_1" },
            { "source": "IPC_307", "target": "BNS_107" },
            { "source": "IPC_420", "target": "BNS_316" }
          ]
        }

    def search_graph(self, query: str) -> Dict[str, Any]:
        """Search for nodes matching the query and their local neighbors."""
        if not query:
            return self.get_graph_data()
        
        # Try Neo4j first
        if self.driver:
            try:
                with self.driver.session() as session:
                    result = session.run("""
                        MATCH (n)
                        WHERE n.id CONTAINS $q OR n.title CONTAINS $q OR n.name CONTAINS $q OR n.description CONTAINS $q
                        WITH n LIMIT 20
                        OPTIONAL MATCH (n)-[r]-(m)
                        RETURN n, r, m
                        LIMIT 100
                    """, q=query)
                    
                    nodes = {}
                    links = []
                    
                    for record in result:
                        for key in ['n', 'm']:
                            node = record[key]
                            if node is None:
                                continue
                            node_id = node['id']
                            if node_id not in nodes:
                                labels = list(node.labels)
                                ntype = labels[0] if labels else "UNKNOWN"
                                nodes[node_id] = {
                                    "id": node_id,
                                    "name": node.get('name') or node.get('title') or node_id,
                                    "type": ntype,
                                    "details": node.get('details') or node.get('description') or node.get('summary') or "",
                                    "val": 25 if ntype == "Section" else 30
                                }
                        
                        if record['r'] is not None and record['m'] is not None:
                            links.append({
                                "source": record['n']['id'],
                                "target": record['m']['id'],
                                "type": record['r'].type
                            })
                    
                    if nodes:
                        return {
                            "nodes": list(nodes.values()),
                            "links": links
                        }
            except Exception as e:
                logger.error(f"Search failed: {e}")
        
        # Fallback: filter mock data locally
        mock = self._get_mock_data()
        q_upper = query.upper().strip()
        
        # Find matching nodes
        matched_ids = set()
        for node in mock["nodes"]:
            if (q_upper in node["id"].upper() or 
                q_upper in node["name"].upper() or 
                q_upper in node.get("details", "").upper()):
                matched_ids.add(node["id"])
        
        if not matched_ids:
            # No match — return all mock data
            return mock
        
        # Include linked neighbors
        neighbor_ids = set()
        for link in mock["links"]:
            if link["source"] in matched_ids:
                neighbor_ids.add(link["target"])
            if link["target"] in matched_ids:
                neighbor_ids.add(link["source"])
        
        all_ids = matched_ids | neighbor_ids
        filtered_nodes = [n for n in mock["nodes"] if n["id"] in all_ids]
        filtered_links = [l for l in mock["links"] if l["source"] in all_ids and l["target"] in all_ids]
        
        return {"nodes": filtered_nodes, "links": filtered_links}

    async def get_legal_advisory(self, node_id: str) -> Dict[str, Any]:
        """Generate an AI legal advisory for a specific node."""
        node_data = None
        
        # Try Neo4j first
        if self.driver:
            try:
                with self.driver.session() as session:
                    result = session.run("MATCH (n {id: $id}) RETURN n", id=node_id).single()
                    if result:
                        node_data = dict(result['n'])
            except: pass

        # Fallback to mock data
        if not node_data:
            mock = self._get_mock_data()
            for node in mock["nodes"]:
                if node["id"] == node_id:
                    node_data = node
                    break

        if not node_data:
            return {
                "advisory": "Node not found in the Knowledge Graph. Please verify the node ID and try again.",
                "severity_level": "UNKNOWN",
                "strategic_action": "Re-run search with a valid statute or case identifier."
            }

        node_name = node_data.get('name') or node_data.get('title') or node_id
        node_details = node_data.get('details') or node_data.get('description') or ""
        node_type = node_data.get('type') or node_data.get('code') or "STATUTE"

        # Try Google Gemini LLM
        try:
            import google.generativeai as genai
            api_key = os.getenv("GOOGLE_API_KEY")
            if api_key:
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel("gemini-2.0-flash")
                prompt = f"""Role: Senior Legal Counsel (Nyay-Mitra Engine).
Context: Generating automated advisory for {node_id} ({node_name}).
Data: {node_details}

Provide a concise, high-impact Legal Advisory including:
1. Summary of legal position.
2. Risks and compliance requirements.
3. Strategic recommendation for the user.

Respond ONLY with valid JSON (no markdown, no code blocks) with keys: "advisory" (string), "severity_level" (string), "strategic_action" (string)."""
                response = model.generate_content(prompt)
                import json
                text = response.text.strip()
                if text.startswith("```"):
                    text = text.split("```")[1]
                    if text.startswith("json"):
                        text = text[4:]
                advisory_data = json.loads(text.strip())
                return advisory_data
        except Exception as e:
            logger.error(f"Gemini advisory generation failed: {e}")

        # Rich fallback advisory based on node type
        if "IPC" in str(node_type).upper() or "IPC" in node_id.upper():
            return {
                "advisory": f"[{node_name}] — {node_details}\n\nThis is a legacy provision under the Indian Penal Code (1860). Under the IPC-to-BNS transition (2023), this section may have been re-numbered, merged, or modified in the Bharatiya Nyaya Sanhita. Practitioners must cross-reference the corresponding BNS section to ensure compliance with the current statutory framework. Any pending cases citing this IPC section should verify whether the provision's scope, penalties, or exceptions have changed under BNS.",
                "severity_level": "HIGH — TRANSITION REQUIRED",
                "strategic_action": "Cross-verify with corresponding BNS section using Nyay-Bridge. Check for punishment deltas and procedural changes."
            }
        elif "BNS" in str(node_type).upper() or "BNS" in node_id.upper():
            return {
                "advisory": f"[{node_name}] — {node_details}\n\nThis provision is part of the Bharatiya Nyaya Sanhita (2023), which replaced the Indian Penal Code. It represents the modernized statutory framework. Key areas to verify: (1) Whether legacy IPC precedents still apply, (2) Any new exceptions or aggravating factors introduced, (3) Changes to sentencing guidelines or bail provisions.",
                "severity_level": "MODERATE — ACTIVE LAW",
                "strategic_action": "Verify precedent applicability using Nyay-Audit. Ensure all cited case law has been re-validated under BNS framework."
            }
        else:
            return {
                "advisory": f"[{node_name}] — {node_details}\n\nThis is a verified judicial precedent in the Knowledge Graph. Its current status (whether active, overruled, or distinguished) should be verified against the latest Supreme Court and High Court databases. Consider the precedent's binding nature based on the court hierarchy and whether subsequent legislation has modified its applicability.",
                "severity_level": "MODERATE — VERIFY STATUS",
                "strategic_action": "Run Nyay-Audit veracity check to confirm this precedent has not been overruled or distinguished."
            }

    def close(self):
        if self.driver:
            self.driver.close()
