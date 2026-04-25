import httpx
import os
import base64
import io
from typing import Dict, Any

class SarvamService:
    def __init__(self):
        self.api_key = os.getenv("SARVAM_API_KEY")
        self.base_url = "https://api.sarvam.ai"

    async def transcribe(self, audio_content: str, lang: str) -> Dict[str, Any]:
        """
        Sarvam AI Speech-to-Text (ASR) Implementation
        Uses the Saaras:v3 model.
        """
        url = f"{self.base_url}/speech-to-text"
        
        # Decode base64 audio
        audio_bytes = base64.b64decode(audio_content)
        
        headers = {
            "api-subscription-key": self.api_key
        }
        
        # Sarvam STT usually expects multipart/form-data with a file
        files = {
            'file': ('input.wav', audio_bytes, 'audio/wav')
        }
        data = {
            'model': 'saaras:v2', # Saaras v2 is common, v3 for better accuracy
            'language_code': lang  # Note: lang should be BCP-47 like 'hi-IN'
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, headers=headers, files=files, data=data, timeout=30.0)
                response.raise_for_status()
                result = response.json()
                
                return {
                    "transcription": result.get("transcript", ""),
                    "language": lang,
                    "accuracy": result.get("confidence", 0.90)
                }
            except Exception as e:
                print(f"Sarvam STT Error: {str(e)}")
                # Falling back to a clean mock if API fails for local dev
                return {
                    "transcription": "[Sarvam ASR Error/Mock] Legal inquiry detected.",
                    "language": lang,
                    "error": str(e)
                }

    async def translate(self, text: str, source_lang: str, target_lang: str) -> Dict[str, Any]:
        """
        Sarvam AI Translation Implementation
        """
        url = f"{self.base_url}/translate/v1"
        
        headers = {
            "Content-Type": "application/json",
            "api-subscription-key": self.api_key
        }
        
        # Sarvam Translate v1 body
        payload = {
            "input": text,
            "source_language_code": source_lang,
            "target_language_code": target_lang,
            "speaker_gender": "Male",
            "mode": "formal"
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, headers=headers, json=payload, timeout=20.0)
                response.raise_for_status()
                result = response.json()
                
                return {
                    "translated_text": result.get("translated_text", ""),
                    "source_lang": source_lang,
                    "target_lang": target_lang,
                    "confidence": 0.95
                }
            except Exception as e:
                print(f"Sarvam Translation Error: {str(e)}")
                return {
                    "translated_text": f"[Sarvam Translate Error]: {text}",
                    "source_lang": source_lang,
                    "target_lang": target_lang,
                    "error": str(e)
                }
