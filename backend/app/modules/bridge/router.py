from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from . import service

router = APIRouter(prefix="/nyay-bridge", tags=["Nyay-Bridge"])

class ScanRequest(BaseModel):
    text: str

@router.get("/mapping/{ipc_section}")
def get_mapping(ipc_section: str):
    result = service.get_mapping(ipc_section)
    if not result:
        raise HTTPException(status_code=404, detail="IPC Section not found in mapping")
    return result

@router.get("/delta/{ipc_section}")
def get_delta(ipc_section: str):
    result = service.analyze_delta(ipc_section)
    if not result or "error" in result:
         raise HTTPException(status_code=404, detail="IPC Section not found")
    return result

@router.post("/scan")
def scan_document(request: ScanRequest):
    return service.scan_text_for_ipc(request.text)
