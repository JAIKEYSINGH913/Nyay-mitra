from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import time
import os
from typing import List, Dict, Any, Optional
from app.services.sarvam_service import SarvamService
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Nyay-Vani Multilingual Voice Engine", version="1.0.0")

sarvam_service = SarvamService()


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
    # Sarvam expects BCP-47 codes. Mapping standard codes if needed:
    lang = request.language_code
    if lang == "hi": lang = "hi-IN"
    if lang == "en": lang = "en-IN"
    
    result = await sarvam_service.transcribe(request.audio_content, lang)
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
    # Mapping lang codes for Sarvam
    sl = request.source_lang if "-" in request.source_lang else f"{request.source_lang}-IN"
    tl = request.target_lang if "-" in request.target_lang else f"{request.target_lang}-IN"

    result = await sarvam_service.translate(request.text, sl, tl)
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
