from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import time
import os
from typing import List, Dict, Any, Optional
from app.services.voice_service import VoiceService
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env'))

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Nyay-Vani Multilingual Voice Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

voice_service = VoiceService()


class STTRequest(BaseModel):
    audio_content: str  # Base64 encoded audio
    language_code: str

class TranslationRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str

class TextQueryRequest(BaseModel):
    text: str
    language: str = "hi"

class VaniResponse(BaseModel):
    status: str
    output: Any
    telemetry: Dict[str, Any]

@app.post("/api/vani/stt", response_model=VaniResponse)
async def speech_to_text(request: STTRequest):
    start_time = time.time()
    lang = request.language_code
    if lang == "hi": lang = "hi-IN"
    if lang == "en": lang = "en-IN"
    
    result = await voice_service.transcribe(request.audio_content, lang)
    processing_time = (time.time() - start_time) * 1000
    
    return VaniResponse(
        status="SUCCESS",
        output=result,
        telemetry={
            "stt_engine": result.get("engine", "unknown"),
            "stt_accuracy": result.get("accuracy", 0.0),
            "processing_time_ms": round(processing_time, 2)
        }
    )

@app.post("/api/vani/translate", response_model=VaniResponse)
async def translate(request: TranslationRequest):
    start_time = time.time()
    sl = request.source_lang if "-" in request.source_lang else f"{request.source_lang}-IN"
    tl = request.target_lang if "-" in request.target_lang else f"{request.target_lang}-IN"

    result = await voice_service.translate(request.text, sl, tl)
    processing_time = (time.time() - start_time) * 1000
    
    return VaniResponse(
        status="SUCCESS",
        output=result,
        telemetry={
            "translation_engine": result.get("engine", "unknown"),
            "translation_confidence": result.get("confidence", 0.0),
            "processing_time_ms": round(processing_time, 2)
        }
    )

@app.post("/api/vani/query", response_model=VaniResponse)
async def text_query(request: TextQueryRequest):
    """Process a typed legal query in any language. Translates to English for downstream use."""
    start_time = time.time()
    
    result = await voice_service.query_legal(request.text, request.language)
    processing_time = (time.time() - start_time) * 1000
    
    return VaniResponse(
        status="SUCCESS",
        output=result,
        telemetry={
            "query_type": "text_input",
            "processing_time_ms": round(processing_time, 2),
            "source_language": request.language
        }
    )

@app.get("/health")
def health():
    return {"status": "UP", "service": "Nyay-Vani"}
