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
        """Transcribe audio. Tries: Sarvam → Gemini (Multimodal) → Fallback."""
        import base64
        import httpx

        # 1. Try Sarvam (Optimized for Indian Accents)
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
                    if result.get("transcript"):
                        return {
                            "transcription": result.get("transcript", ""),
                            "language": lang,
                            "accuracy": result.get("confidence", 0.90),
                            "engine": "sarvam"
                        }
            except Exception as e:
                logger.warning(f"Sarvam STT failed: {e}")

        # 2. Try Gemini Multimodal STT (Powerful fallback)
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                model = genai.GenerativeModel("gemini-1.5-flash")
                
                # Convert base64 to bytes and then to GenAI part
                audio_bytes = base64.b64decode(audio_content)
                
                # Use a broader mime_type or try to infer it. 
                # MediaRecorder usually sends webm.
                prompt = f"Transcribe this audio accurately. The language is {lang}. Respond ONLY with the transcription text. If the audio is silent, respond with [SILENCE]."
                response = model.generate_content([
                    prompt,
                    {"mime_type": "audio/webm", "data": audio_bytes}
                ])
                
                transcription = response.text.strip()
                if transcription and "[SILENCE]" not in transcription:
                    return {
                        "transcription": transcription,
                        "language": lang,
                        "accuracy": 0.85,
                        "engine": "gemini-neural"
                    }
            except Exception as e:
                logger.error(f"Gemini STT fallback failed: {e}")

        # 3. Ultimate Fallback
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
        
        # Try Gemini (Reliable Fallback)
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                model = genai.GenerativeModel("gemini-1.5-flash")
                
                # Disable safety filters for legal translation (prevents blocking criminal queries)
                safety_settings = [
                    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
                ]
                
                response = model.generate_content(prompt, safety_settings=safety_settings)
                translated = response.text.strip().strip('"')
                if translated:
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
        """Perform bidirectional legal processing and IPC/BNS mapping."""
        # 1. Translate to English if needed
        english_query = text
        if lang not in ("en", "en-IN"):
            trans_res = await self.translate(text, lang, "en")
            english_query = trans_res.get("translated_text", text)
        
        # 2. Kernel Process (Legal Grounding mapping IPC to BNS)
        english_answer = "Legal grounding unavailable."
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                model = genai.GenerativeModel("gemini-1.5-flash")
                
                safety_settings = [
                    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
                ]
                
                kernel_prompt = f"""
                You are the Nyay-Mitra Judicial Kernel. A user has provided the following query:
                "{english_query}"
                
                Provide a short, verified explanation (2-3 sentences max) mapping this query to the relevant legal sections, specifically mapping legacy IPC sections to modern BNS (Bharatiya Nyaya Sanhita) sections.
                For example, if it's about cheating, mention IPC 420 and BNS 318.
                Respond ONLY with the explanation.
                """
                response = model.generate_content(kernel_prompt, safety_settings=safety_settings)
                english_answer = response.text.strip().strip('"')
            except Exception as e:
                logger.error(f"Kernel grounding failed: {e}")
                english_answer = f"Error during legal grounding: {str(e)}"
        
        # 3. Translate answer back to native language
        native_answer = english_answer
        if lang not in ("en", "en-IN") and english_answer != "Legal grounding unavailable.":
            trans_back_res = await self.translate(english_answer, "en", lang)
            native_answer = trans_back_res.get("translated_text", english_answer)

        return {
            "original_query": text,
            "english_query": english_query,
            "english_answer": english_answer,
            "native_answer": native_answer,
            "language": lang,
            "intent": "legal_grounding"
        }
