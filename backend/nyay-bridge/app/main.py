from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import time
import json
import os
from typing import List, Optional, Dict, Any
from app.services.mapping_service import MappingService
from app.services.llama_service import LlamaService
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Nyay-Bridge Intelligence Layer", version="1.0.0")

mapping_service = MappingService()
llama_service = LlamaService()

class BridgeRequest(BaseModel):
    ipc_section: str
    bns_section: str
    ipc_text: str
    bns_text: str
    show_reasoning: bool = False

class BridgeResponse(BaseModel):
    status: str
    similarity_score: float
    mapped: bool
    delta_report: Optional[Dict[str, Any]] = None
    reasoning: Optional[str] = None
    telemetry: Dict[str, Any]

@app.post("/api/bridge/map", response_model=BridgeResponse)
async def map_sections(request: BridgeRequest):
    start_time = time.time()
    
    # 1. Calculate Similarity using InLegalBERT
    similarity_score, embedding_distance = mapping_service.calculate_similarity(
        request.ipc_text, request.bns_text
    )
    
    is_mapped = similarity_score >= 0.85
    delta_report = None
    reasoning = None
    
    # 2. Extract Delta using Llama if similarity is High or if forced
    if is_mapped:
        llama_output = await llama_service.extract_punishment_delta(
            request.ipc_text, request.bns_text, request.show_reasoning
        )
        delta_report = llama_output.get("delta_report")
        reasoning = llama_output.get("thinking_process") if request.show_reasoning else None
    
    processing_time = (time.time() - start_time) * 1000
    
    return BridgeResponse(
        status="SUCCESS" if is_mapped else "VERIFICATION_REQUIRED",
        similarity_score=float(similarity_score),
        mapped=is_mapped,
        delta_report=delta_report,
        reasoning=reasoning,
        telemetry={
            "processing_time_ms": round(processing_time, 2),
            "embedding_distance": float(embedding_distance),
            "model_llama": os.getenv("LLAMA_MODEL_VERSION", "3.3"),
            "model_embedding": "InLegalBERT"
        }
    )

@app.get("/health")
def health():
    return {"status": "UP", "service": "Nyay-Bridge"}
