from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import time
import os
from msgspec import json
from typing import List, Dict, Any, Optional
from app.services.ner_service import NERService
from app.services.graph_service import GraphService
from dotenv import load_dotenv
from jose import jwt

load_dotenv()

app = FastAPI(title="Nyay-Audit Veracity Engine", version="1.0.0")
security = HTTPBearer()

ner_service = NERService()
graph_service = GraphService()

# JWT Config
JWT_SECRET = os.getenv("JWT_SECRET_KEY", "nyaymitra_secret_key_2024_judicial_core")
ALGORITHM = "HS256"

class AuditRequest(BaseModel):
    text: str

class AuditResponse(BaseModel):
    status: str
    veracity_score: float
    citations_found: List[Dict[str, Any]]
    halucinations: List[str]
    bad_law_alerts: List[str]
    telemetry: Dict[str, Any]

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="INVALID_SESSION_TOKEN")

@app.post("/api/audit/verify", response_model=AuditResponse)
async def verify_veracity(request: AuditRequest, user=Depends(verify_token)):
    # Request Sanitization: Basic protection against Cypher Injection
    sanitized_text = re.sub(r"[;'\"]", "", request.text)
    
    start_time = time.time()
    
    # 1. NER Extraction using sanitized input
    citations = ner_service.extract_citations(sanitized_text)
    
    verified_citations = []
    halucinations = []
    bad_law_alerts = []
    
    # 2. Graph Verification
    for citation in citations:
        is_valid, metadata = graph_service.verify_citation(citation)
        if not is_valid:
            halucinations.append(f"EXTRINSIC_HALLUCINATION: {citation['raw']}")
        else:
            if metadata.get("is_overruled"):
                bad_law_alerts.append(f"STARE_DECISIS_ALERT: {citation['raw']} (OVERRULED)")
            verified_citations.append(metadata)
            
    # 3. Hybrid Binary-Fuzzy Threshold Logic
    total_statutes = len([c for c in citations if c['type'] == 'STATUTE'])
    total_cases = len([c for c in citations if c['type'] == 'CASE_LAW'])
    
    statute_verified = len([v for v in verified_citations if v['type'] == 'STATUTE'])
    case_verified = len([v for v in verified_citations if v['type'] == 'CASE_LAW'])
    
    # Logic: Statutes are Binary (Must be 100% verified)
    statute_score = 1.0 if total_statutes == 0 else (1.0 if statute_verified == total_statutes else 0.0)
    
    # Logic: Case Law is Fuzzy (0.95 threshold)
    case_score = 1.0 if total_cases == 0 else (case_verified / total_cases)
    
    # Weighted Average: 70% Statute, 30% Case Law (if both exist)
    if total_statutes > 0 and total_cases > 0:
        veracity_score = (statute_score * 0.7) + (case_score * 0.3)
    elif total_statutes > 0:
        veracity_score = statute_score
    else:
        veracity_score = case_score
        
    # Final Kill Switch: If veracity_score < 0.9, we hard block
    status = "VERIFIED" if veracity_score >= 1.0 else ("WARNING" if veracity_score >= 0.9 else "BLOCK")
    
    processing_time = (time.time() - start_time) * 1000
    
    return AuditResponse(
        status=status,
        veracity_score=round(float(veracity_score), 3),
        citations_found=verified_citations,
        halucinations=halucinations,
        bad_law_alerts=bad_law_alerts,
        telemetry={
            "processing_time_ms": round(processing_time, 2),
            "statute_integrity": statute_score,
            "case_fidelity": round(case_score, 2),
            "graph_probes": len(citations),
            "audit_mode": "HYBRID_WEIGHTED"
        }
    )

@app.get("/health")
def health():
    return {"status": "UP", "service": "Nyay-Audit"}
