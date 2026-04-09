from fastapi import APIRouter
from pydantic import BaseModel
from . import service

router = APIRouter(prefix="/nyay-vani", tags=["Nyay-Vani"])

class VoiceQuery(BaseModel):
    text: str

@router.post("/query")
def query_vani(request: VoiceQuery):
    return service.process_query(request.text)
