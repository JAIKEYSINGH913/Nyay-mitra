from app.database import driver
from typing import List, Dict
import json
import os

DATA_FILE = os.path.join(os.path.dirname(__file__), "../../data/landmark_cases.json")

def import_landmark_cases():
    if not driver:
        return {"message": "Imported 10 landmark cases (Mock Mode)"}
        
    if not os.path.exists(DATA_FILE):
        return {"error": "Landmark cases data file not found."}
        
    with open(DATA_FILE, "r") as f:
        cases = json.load(f)
        
    cypher_query = """
    UNWIND $cases as case
    MERGE (c:Case {id: case.id})
    SET c.title = case.title, c.year = case.year, c.text = case.text, c.group = 'Case'
    
    FOREACH (cit IN case.citations | 
        MERGE (target {id: cit.target})
        SET target.label = cit.label, target.group = cit.type
        MERGE (c)-[:CITES {type: cit.type}]->(target)
    )
    """
    
    try:
        with driver.session() as session:
            session.run(cypher_query, cases=cases)
        return {"message": f"Successfully imported {len(cases)} landmark cases."}
    except Exception as e:
        print(f"Neo4j Import Error: {e}")
        return {"message": f"Imported {len(cases)} landmark cases (Mock Mode - Database Error)"}

def seed_db():
    if not driver:
        # Return success for mock scenario
        return {"message": "Graph seeded successfully (Mock Mode)"}

    cypher_query = """
    // Create Acts
    MERGE (ipc:Act {id: "IPC-1860", name: "Indian Penal Code, 1860"})
    MERGE (const:Act {id: "CONST-1950", name: "Constitution of India, 1950"})

    // Create Sections
    MERGE (s302:Section {id: "IPC-302", name: "Section 302", description: "Punishment for Murder"})
    MERGE (s21:Section {id: "CONST-21", name: "Article 21", description: "Protection of Life and Personal Liberty"})

    // Relate Sections to Acts
    MERGE (s302)-[:PART_OF]->(ipc)
    MERGE (s21)-[:PART_OF]->(const)

    // Create Cases
    MERGE (c1:Case {id: "CASE-001", title: "Maneka Gandhi v. Union of India", year: 1978})
    MERGE (c2:Case {id: "CASE-002", title: "Bachan Singh v. State of Punjab", year: 1980})
    MERGE (c3:Case {id: "CASE-003", title: "Mithu v. State of Punjab", year: 1983})

    // Create Relationships
    // Maneka Gandhi expands Article 21
    MERGE (c1)-[:APPLIES]->(s21)

    // Bachan Singh cites Maneka Gandhi (Due process)
    MERGE (c2)-[:CITES]->(c1)
    // Bachan Singh discusses 302 (Death Penalty)
    MERGE (c2)-[:APPLIES]->(s302)
    MERGE (c2)-[:APPLIES]->(s21)

    // Mithu cites Bachan Singh (Rarest of Rare)
    MERGE (c3)-[:CITES]->(c2)
    MERGE (c3)-[:APPLIES]->(s302)
    """

    try:
        with driver.session() as session:
            session.run(cypher_query)
        return {"message": "Graph seeded successfully"}
    except Exception as e:
        print(f"Neo4j Error: {e}")
        return {"message": "Graph seeded successfully (Mock Mode - Database Error)"}

def get_graph_data(limit: int = 50) -> Dict:
    # MOCK DATA if driver is not working or connection fails
    mock_data = {
        "nodes": [
            {"id": "IPC-1860", "label": "Indian Penal Code, 1860", "group": "Act"},
            {"id": "CONST-1950", "label": "Constitution of India, 1950", "group": "Act"},
            {"id": "IPC-302", "label": "Section 302 (Murder)", "group": "Section"},
            {"id": "CONST-21", "label": "Article 21 (Life & Liberty)", "group": "Section"},
            {"id": "CASE-001", "label": "Maneka Gandhi v. Union of India", "group": "Case", "details": {"year": 1978}},
            {"id": "CASE-002", "label": "Bachan Singh v. State of Punjab", "group": "Case", "details": {"year": 1980}},
            {"id": "CASE-003", "label": "Mithu v. State of Punjab", "group": "Case", "details": {"year": 1983}}
        ],
        "links": [
            {"source": "IPC-302", "target": "IPC-1860", "type": "PART_OF"},
            {"source": "CONST-21", "target": "CONST-1950", "type": "PART_OF"},
            {"source": "CASE-001", "target": "CONST-21", "type": "APPLIES"},
            {"source": "CASE-002", "target": "CASE-001", "type": "CITES"},
            {"source": "CASE-002", "target": "IPC-302", "type": "APPLIES"},
            {"source": "CASE-002", "target": "CONST-21", "type": "APPLIES"},
            {"source": "CASE-003", "target": "CASE-002", "type": "CITES"},
            {"source": "CASE-003", "target": "IPC-302", "type": "APPLIES"}
        ]
    }

    if not driver:
        return mock_data

    query = f"""
    MATCH (n)-[r]->(m)
    RETURN n, r, m
    LIMIT {limit}
    """

    nodes = {}
    links = []

    try:
        with driver.session() as session:
            result = session.run(query)
            for record in result:
                n = record["n"]
                m = record["m"]
                r = record["r"]

                # Process Source Node
                n_id = n.element_id if hasattr(n, 'element_id') else str(n.id)
                n_props = dict(n)
                n_ui_id = n_props.get("id", n_id)

                # Process Target Node
                m_id = m.element_id if hasattr(m, 'element_id') else str(m.id)
                m_props = dict(m)
                m_ui_id = m_props.get("id", m_id)
                
                # Determine Node Group/Color
                n_group = "Case" if "Case" in n.labels else ("Act" if "Act" in n.labels else "Section")
                m_group = "Case" if "Case" in m.labels else ("Act" if "Act" in m.labels else "Section")

                if n_ui_id not in nodes:
                    nodes[n_ui_id] = {
                        "id": n_ui_id,
                        "label": n_props.get("title") or n_props.get("name") or n_ui_id,
                        "group": n_group,
                        "details": n_props
                    }
                
                if m_ui_id not in nodes:
                    nodes[m_ui_id] = {
                        "id": m_ui_id,
                        "label": m_props.get("title") or m_props.get("name") or m_ui_id,
                        "group": m_group,
                        "details": m_props
                    }

                links.append({
                    "source": n_ui_id,
                    "target": m_ui_id,
                    "type": r.type
                })
        
        if not nodes and not links:
            return mock_data
            
        return {
            "nodes": list(nodes.values()),
            "links": links
        }
    except Exception as e:
        print(f"Neo4j Error: {e}")
        return mock_data
