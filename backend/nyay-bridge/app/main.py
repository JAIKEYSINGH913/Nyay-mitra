from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import time
import json
import os
from typing import List, Optional, Dict, Any
from app.services.mapping_service import MappingService
from app.services.llama_service import LlamaService
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env'))

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Nyay-Bridge Intelligence Layer", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mapping_service = MappingService()
llama_service = LlamaService()

class BridgeRequest(BaseModel):
    ipc_section: str
    bns_section: str = ""
    ipc_text: str = ""
    bns_text: str = ""
    show_reasoning: bool = False

class BridgeResponse(BaseModel):
    status: str
    similarity_score: float
    mapped: bool
    bns_matches: List[Dict[str, Any]]
    deltas: List[Dict[str, Any]]
    reasoning: Optional[str] = None
    telemetry: Dict[str, Any]

@app.post("/api/bridge/map", response_model=BridgeResponse)
async def map_sections(request: BridgeRequest):
    start_time = time.time()
    
    ipc_text = request.ipc_text
    bns_text = request.bns_text
    bns_section = request.bns_section
    
    # AUTO-LOOKUP: If texts are missing, fetch from Neo4j
    if not ipc_text or not bns_text or bns_section in ("", "UNKNOWN"):
        lookup = mapping_service.lookup_section_texts(request.ipc_section)
        if lookup.get("found"):
            ipc_text = ipc_text or lookup["ipc_text"]
            bns_text = bns_text or lookup["bns_text"]
            bns_section = lookup["bns_id"] if bns_section in ("", "UNKNOWN") else bns_section
    
    # If we still don't have texts, return an error-like response
    if not ipc_text:
        ipc_text = f"Section {request.ipc_section} of the Indian Penal Code"
    if not bns_text:
        bns_text = f"Corresponding BNS provision for IPC {request.ipc_section}"
    
    # 1. Calculate Similarity
    similarity_score, embedding_distance = mapping_service.calculate_similarity(
        ipc_text, bns_text
    )
    
    is_mapped = similarity_score >= 0.70
    
    # 2. Extract Delta using Gemini LLM
    llama_output = await llama_service.extract_punishment_delta(
        ipc_text, bns_text, request.show_reasoning
    )
    
    delta_report = llama_output.get("delta_report", {})
    reasoning = llama_output.get("thinking_process") if request.show_reasoning else None
    
    # 3. Format for Frontend
    bns_matches = [
        {
            "label": "Primary Match",
            "bns": bns_section,
            "bns_text": bns_text,
            "similarity": round(similarity_score * 100, 1),
            "vector_dist": round(float(embedding_distance), 3)
        }
    ]
    
    deltas = []
    if isinstance(delta_report, dict):
        for key, val in delta_report.items():
            if key == "changes" and isinstance(val, list):
                for change in val:
                    deltas.append({
                        "type": change.get("type", "unchanged"),
                        "label": change.get("label", "STATUTORY_CHANGE"),
                        "description": change.get("description", ""),
                        "impact": change.get("impact", "neutral")
                    })
    
    if not deltas:
        deltas = [{"type": "unchanged", "label": "NO_DELTA", "description": "No significant punishment delta detected.", "impact": "neutral"}]

    if is_mapped:
        mapping_service.save_mapping(request.ipc_section, bns_section, similarity_score)
    
    processing_time = (time.time() - start_time) * 1000
    
    return BridgeResponse(
        status="SUCCESS" if is_mapped else "VERIFICATION_REQUIRED",
        similarity_score=float(similarity_score),
        mapped=is_mapped,
        bns_matches=bns_matches,
        deltas=deltas,
        reasoning=reasoning,
        telemetry={
            "processing_time_ms": round(processing_time, 2),
            "embedding_distance": float(embedding_distance),
            "model_llm": llama_output.get("engine", "gemini-1.5-flash"),
            "model_embedding": "InLegalBERT",
            "auto_lookup": True
        }
    )

@app.get("/health")
def health():
    return {"status": "UP", "service": "Nyay-Bridge"}
