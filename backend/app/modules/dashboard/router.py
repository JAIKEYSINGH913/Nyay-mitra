from fastapi import APIRouter
from . import service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_dashboard_stats():
    return service.get_stats()
