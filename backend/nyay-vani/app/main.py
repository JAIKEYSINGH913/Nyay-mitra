from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import time
import os
from typing import List, Dict, Any, Optional
from app.services.bhashini_service import BhashiniService
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Nyay-Vani Multilingual Voice Engine", version="1.0.0")

bhashini_service = BhashiniService()

class STTRequest(BaseModel):
    audio_content: str  # Base64 encoded audio
    language_code: str

class TranslationRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str

class VaniResponse(BaseModel):
    status: str
    output: Any
    telemetry: Dict[str, Any]

@app.post("/api/vani/stt", response_model=VaniResponse)
async def speech_to_text(request: STTRequest):
    start_time = time.time()
    result = await bhashini_service.transcribe(request.audio_content, request.language_code)
    processing_time = (time.time() - start_time) * 1000
    
    return VaniResponse(
        status="SUCCESS",
        output=result,
        telemetry={
            "stt_accuracy": result.get("accuracy", 0.92),
            "processing_time_ms": round(processing_time, 2)
        }
    )

@app.post("/api/vani/translate", response_model=VaniResponse)
async def translate(request: TranslationRequest):
    start_time = time.time()
    result = await bhashini_service.translate(request.text, request.source_lang, request.target_lang)
    processing_time = (time.time() - start_time) * 1000
    
    return VaniResponse(
        status="SUCCESS",
        output=result,
        telemetry={
            "translation_confidence": result.get("confidence", 0.95),
            "processing_time_ms": round(processing_time, 2)
        }
    )

@app.get("/health")
def health():
    return {"status": "UP", "service": "Nyay-Vani"}
