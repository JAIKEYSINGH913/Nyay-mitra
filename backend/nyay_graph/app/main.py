from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from nyay_graph.app.services.graph_service import GraphService
from nyay_graph.app.services.seed_data import seed_neo4j
from dotenv import load_dotenv
import os

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env'))

app = FastAPI(title="Nyay-Graph Backend", version="1.0.0")

# Add CORS so the frontend can hit this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

graph_service = GraphService()

@app.get("/api/graph/data")
def get_graph_data():
    return graph_service.get_graph_data()

@app.get("/api/graph/check")
def check_databases():
    return graph_service.get_database_status()

@app.get("/api/graph/search")
def search_graph(q: str):
    return graph_service.search_graph(q)

@app.get("/api/graph/advisory/{node_id}")
async def get_advisory(node_id: str):
    return await graph_service.get_legal_advisory(node_id)

@app.post("/api/graph/seed")
def seed_database():
    """Seeds Neo4j with real Indian legal data."""
    try:
        result = seed_neo4j()
        # Reinitialize the graph service to pick up new data
        global graph_service
        graph_service = GraphService()
        return {"status": "SUCCESS", "data": result}
    except Exception as e:
        return {"status": "ERROR", "detail": str(e)}

@app.get("/health")
def health():
    return {"status": "UP", "service": "Nyay-Graph"}

@app.on_event("shutdown")
def shutdown_event():
    graph_service.close()
