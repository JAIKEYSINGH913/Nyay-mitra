import os
import json
import logging
import httpx
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env'))
logger = logging.getLogger(__name__)


class LlamaService:
    def __init__(self):
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        self.ollama_url = os.getenv("OLLAMA_ENDPOINT", "http://localhost:11434")
        self.ollama_model = "llama3.2:3b"
        self.gemini_model = "gemini-2.0-flash"

    def _call_ollama(self, prompt: str) -> str:
        """Call local Ollama for inference."""
        try:
            response = httpx.post(
                f"{self.ollama_url}/api/generate",
                json={"model": self.ollama_model, "prompt": prompt, "stream": False},
                timeout=60.0
            )
            response.raise_for_status()
            return response.json().get("response", "")
        except Exception as e:
            logger.error(f"Ollama error: {e}")
            raise

    def _call_gemini(self, prompt: str) -> str:
        """Call Google Gemini API for inference."""
        try:
            import google.generativeai as genai
            genai.configure(api_key=self.google_api_key)
            model = genai.GenerativeModel(self.gemini_model)
            response = model.generate_content(prompt)
            return response.text if response.text else ""
        except Exception as e:
            logger.error(f"Gemini error: {e}")
            raise

    def _call_llm(self, prompt: str) -> str:
        """Try Ollama first (local, no rate limits), then Gemini as fallback."""
        # Try Ollama first
        try:
            return self._call_ollama(prompt)
        except Exception as e:
            logger.warning(f"Ollama unavailable, trying Gemini: {e}")
        
        # Try Gemini
        if self.google_api_key:
            try:
                return self._call_gemini(prompt)
            except Exception as e:
                logger.warning(f"Gemini also failed: {e}")
        
        raise Exception("No LLM available (both Ollama and Gemini failed)")

    async def extract_punishment_delta(self, ipc_text: str, bns_text: str, show_reasoning: bool = False):
        """Extract punishment delta between IPC and BNS."""

        prompt = f"""You are a Senior Judicial Architect specializing in IPC to BNS transition.
Compare these two legal provisions and identify ALL changes:

IPC Text: {ipc_text}
BNS Text: {bns_text}

Respond ONLY with valid JSON (no markdown, no code fences):
{{"changes": [{{"type": "new|increased|decreased|unchanged", "label": "SHORT_LABEL", "description": "Detail", "impact": "increased|decreased|neutral"}}]}}"""

        try:
            # Try LLM
            engine = "ollama"
            try:
                raw = self._call_ollama(prompt)
            except Exception:
                engine = "gemini"
                raw = self._call_gemini(prompt)
            
            # Parse JSON from response
            json_part = raw.strip()
            if "```json" in json_part:
                json_part = json_part.split("```json")[1].split("```")[0].strip()
            elif "```" in json_part:
                json_part = json_part.split("```")[1].split("```")[0].strip()
            
            delta_report = json.loads(json_part)
            return {"delta_report": delta_report, "thinking_process": "", "engine": engine}
            
        except Exception as e:
            logger.error(f"LLM Delta Error: {e}")
            return {
                "delta_report": {
                    "changes": [{
                        "type": "unchanged",
                        "label": "LLM_OFFLINE",
                        "description": f"LLM service unavailable ({str(e)[:100]}). Similarity-based mapping completed. LLM delta analysis will be available when Ollama or Gemini quota refreshes.",
                        "impact": "neutral"
                    }]
                },
                "thinking_process": f"[System] LLM skipped — {str(e)[:100]}" if show_reasoning else "",
                "engine": "none"
            }
