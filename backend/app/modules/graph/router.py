from fastapi import APIRouter
from . import service

router = APIRouter(prefix="/nyay-graph", tags=["Nyay-Graph"])

@router.post("/seed")
def seed_graph():
    return service.seed_db()

@router.post("/import")
def import_cases():
    return service.import_landmark_cases()

@router.get("/visualize")
def visualize_graph():
    return service.get_graph_data()
