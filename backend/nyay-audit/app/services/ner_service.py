import re
from typing import List, Dict, Any
from transformers import pipeline

class NERService:
    def __init__(self):
        # Using a legal-specific pipeline if available, otherwise regex extraction
        # Pattern for "IPC Sec X" or "BNS Sec X"
        self.statute_pattern = re.compile(r'\b(IPC|BNS|CrPC|CPC)\s+(?:Sec(?:tion)?|Art(?:icle)?)\s+(\d+[A-Z]?)', re.IGNORECASE)
        # Pattern for Case Law (X v. Y)
        self.case_pattern = re.compile(r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+v\.\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)', re.IGNORECASE)

    def extract_citations(self, text: str) -> List[Dict[str, Any]]:
        citations = []
        
        # Extract Statutes
        for match in self.statute_pattern.finditer(text):
            citations.append({
                "type": "STATUTE",
                "act": match.group(1).upper(),
                "section": match.group(2),
                "raw": match.group(0)
            })
            
        # Extract Case Law
        for match in self.case_pattern.finditer(text):
            citations.append({
                "type": "CASE_LAW",
                "party_a": match.group(1),
                "party_b": match.group(2),
                "raw": match.group(0)
            })
            
        return citations
