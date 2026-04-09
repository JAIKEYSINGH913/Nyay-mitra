import os
import httpx
import json
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate

class LlamaService:
    def __init__(self):
        # Configure based on user provided endpoint (Ollama/vLLM)
        # Defaulting to localhost:11434 for Ollama
        self.api_url = os.getenv("OLLAMA_ENDPOINT", "http://localhost:11434/v1")
        self.api_key = os.getenv("OLLAMA_API_KEY", "ollama")
        
        self.llm = ChatOpenAI(
            base_url=self.api_url,
            api_key=self.api_key,
            model=os.getenv("LLAMA_MODEL_VERSION", "llama3.1"),
            temperature=0
        )

    async def extract_punishment_delta(self, ipc_text: str, bns_text: str, show_reasoning: bool = False):
        prompt_template = PromptTemplate.from_template("""
        Role: Senior Judicial Architect specializing in IPC to BNS transition.
        Task: Compare the following IPC section and its corresponding BNS mapping.
        
        IPC Text: {ipc_text}
        BNS Text: {bns_text}
        
        Strictly provide a structured JSON "Delta Report" in the following format:
        {{
            "fine_changes": "detailed string of currency changes",
            "prison_term_changes": "string describing changes in years/months",
            "new_classifications": ["list", "of", "new", "legal", "terms"],
            "severity_delta": "INCREASED | DECREASED | UNCHANGED"
        }}
        
        {reasoning_instruction}
        """)
        
        reasoning_instruction = "Before the JSON, provide your step-by-step 'Thinking Process' wrapped in <thinking> tags." if show_reasoning else ""
        
        prompt = prompt_template.format(
            ipc_text=ipc_text,
            bns_text=bns_text,
            reasoning_instruction=reasoning_instruction
        )
        
        response = self.llm.invoke(prompt)
        raw_content = response.content
        
        thinking_process = ""
        if "<thinking>" in raw_content:
            thinking_process = raw_content.split("<thinking>")[1].split("</thinking>")[0].strip()
            # Extract JSON from the rest of the message
            json_part = raw_content.split("</thinking>")[1].strip()
        else:
            json_part = raw_content.strip()
            
        try:
            # Simple extractor for the JSON block
            if "```json" in json_part:
                json_part = json_part.split("```json")[1].split("```")[0].strip()
            delta_report = json.loads(json_part)
        except:
            delta_report = {"error": "Failed to parse structured delta", "raw": json_part}
            
        return {{
            "delta_report": delta_report,
            "thinking_process": thinking_process
        }}
