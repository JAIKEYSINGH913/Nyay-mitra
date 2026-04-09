from fastapi import APIRouter
from pydantic import BaseModel
from . import service

router = APIRouter(prefix="/nyay-audit", tags=["Nyay-Audit"])

class AuditRequest(BaseModel):
    text: str

@router.post("/analyze")
def analyze_text(request: AuditRequest):
    return service.audit_document(request.text)
