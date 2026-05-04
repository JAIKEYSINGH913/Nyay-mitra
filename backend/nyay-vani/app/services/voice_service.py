import os
import logging
import json
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env'))
logger = logging.getLogger(__name__)


class VoiceService:
    """Handles STT and Translation using Google Gemini API.
    Replaces Sarvam API which blocks certain legal queries."""

    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.sarvam_key = os.getenv("SARVAM_API_KEY")

    async def transcribe(self, audio_content: str, lang: str) -> Dict[str, Any]:
        """Transcribe audio. Tries Sarvam first (good for Indian languages), then falls back."""
        import httpx
        import base64

        # Try Sarvam first for Indian language ASR
        if self.sarvam_key:
            try:
                audio_bytes = base64.b64decode(audio_content)
                url = "https://api.sarvam.ai/speech-to-text"
                headers = {"api-subscription-key": self.sarvam_key}
                files = {'file': ('input.wav', audio_bytes, 'audio/wav')}
                data = {'model': 'saaras:v2', 'language_code': lang}
                
                async with httpx.AsyncClient() as client:
                    response = await client.post(url, headers=headers, files=files, data=data, timeout=30.0)
                    response.raise_for_status()
                    result = response.json()
                    return {
                        "transcription": result.get("transcript", ""),
                        "language": lang,
                        "accuracy": result.get("confidence", 0.90),
                        "engine": "sarvam"
                    }
            except Exception as e:
                logger.warning(f"Sarvam STT failed, will use fallback: {e}")
        
        # Fallback: return a message indicating STT needs client-side processing
        return {
            "transcription": "[Server STT unavailable — please use Text-to-Vani mode or enable browser speech recognition]",
            "language": lang,
            "accuracy": 0.0,
            "engine": "fallback"
        }

    async def translate(self, text: str, source_lang: str, target_lang: str) -> Dict[str, Any]:
        """Translate text. Tries: Ollama (local) → Gemini → Sarvam."""
        
        lang_names = {
            "hi": "Hindi", "hi-IN": "Hindi",
            "en": "English", "en-IN": "English",
            "ta": "Tamil", "ta-IN": "Tamil",
            "te": "Telugu", "te-IN": "Telugu",
            "bn": "Bengali", "bn-IN": "Bengali",
            "mr": "Marathi", "mr-IN": "Marathi",
        }
        
        src_name = lang_names.get(source_lang, source_lang)
        tgt_name = lang_names.get(target_lang, target_lang)
        
        prompt = f"""You are a professional legal translator. Translate the following text from {src_name} to {tgt_name}.
If the text is a legal query, preserve all legal terminology accurately.
If translating to English, use formal legal English.

Text to translate: "{text}"

Respond ONLY with the translated text, nothing else."""

        # Try Ollama first (local, no rate limits)
        try:
            import httpx
            response = httpx.post(
                "http://localhost:11434/api/generate",
                json={"model": "llama3.2:3b", "prompt": prompt, "stream": False},
                timeout=30.0
            )
            response.raise_for_status()
            translated = response.json().get("response", "").strip().strip('"')
            if translated:
                return {
                    "translated_text": translated,
                    "source_lang": source_lang,
                    "target_lang": target_lang,
                    "confidence": 0.90,
                    "engine": "ollama"
                }
        except Exception as e:
            logger.warning(f"Ollama translation failed: {e}")
        
        # Try Gemini
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                model = genai.GenerativeModel("gemini-2.0-flash")
                response = model.generate_content(prompt)
                translated = response.text.strip().strip('"')
                return {
                    "translated_text": translated,
                    "source_lang": source_lang,
                    "target_lang": target_lang,
                    "confidence": 0.95,
                    "engine": "gemini"
                }
            except Exception as e:
                logger.error(f"Gemini translation failed: {e}")
        
        # Try Sarvam
        if self.sarvam_key:
            try:
                import httpx
                url = "https://api.sarvam.ai/translate/v1"
                headers = {"Content-Type": "application/json", "api-subscription-key": self.sarvam_key}
                sl = source_lang if "-" in source_lang else f"{source_lang}-IN"
                tl = target_lang if "-" in target_lang else f"{target_lang}-IN"
                payload = {"input": text, "source_language_code": sl, "target_language_code": tl, "speaker_gender": "Male", "mode": "formal"}
                async with httpx.AsyncClient() as client:
                    response = await client.post(url, headers=headers, json=payload, timeout=20.0)
                    response.raise_for_status()
                    result = response.json()
                    return {
                        "translated_text": result.get("translated_text", ""),
                        "source_lang": source_lang,
                        "target_lang": target_lang,
                        "confidence": 0.90,
                        "engine": "sarvam"
                    }
            except Exception as e:
                logger.error(f"Sarvam translation also failed: {e}")
        
        return {
            "translated_text": f"[Translation unavailable] {text}",
            "source_lang": source_lang,
            "target_lang": target_lang,
            "error": "All providers failed. Ensure Ollama is running with llama3.2:3b model.",
            "engine": "none"
        }

    async def query_legal(self, text: str, lang: str) -> Dict[str, Any]:
        """Process a typed legal query: translate if needed, then return structured output."""
        # If the text is already in English, return directly
        if lang in ("en", "en-IN"):
            return {
                "original_text": text,
                "translated_text": text,
                "language": "en",
                "intent": "legal_query"
            }
        
        # Otherwise, translate to English
        translation = await self.translate(text, lang, "en")
        
        return {
            "original_text": text,
            "translated_text": translation.get("translated_text", text),
            "language": lang,
            "intent": "legal_query",
            "confidence": translation.get("confidence", 0.0)
        }
