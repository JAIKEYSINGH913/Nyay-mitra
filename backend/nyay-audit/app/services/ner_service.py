import re
from typing import List, Dict, Any

class NERService:
    def __init__(self):
        # Pattern 1: "IPC Section 302", "BNS Sec 101", "IPC 302"
        self.statute_pattern_1 = re.compile(
            r'\b(IPC|BNS|CrPC|CPC)\s+(?:Sec(?:tion)?\s+)?(\d+[A-Z]?)\b', re.IGNORECASE
        )
        # Pattern 2: "Section 302 of IPC", "Section 420 IPC"
        self.statute_pattern_2 = re.compile(
            r'\bSec(?:tion)?\s+(\d+[A-Z]?)\s+(?:of\s+)?(IPC|BNS|CrPC|CPC)\b', re.IGNORECASE
        )
        # Pattern for Case Law (X v. Y) — capture only proper noun party names
        # Stops at lowercase words to avoid capturing "established..." etc.
        self.case_pattern = re.compile(
            r'([A-Z][a-z]+(?:\.?\s+[A-Z][a-z]+)*)\s+v\.?\s+([A-Z][a-z]+(?:\s+(?:of\s+)?[A-Z][a-z]+)*)',
        )

    def extract_citations(self, text: str) -> List[Dict[str, Any]]:
        citations = []
        seen = set()
        
        # Extract Statutes (Pattern 1: IPC 302)
        for match in self.statute_pattern_1.finditer(text):
            key = f"{match.group(1).upper()}_{match.group(2)}"
            if key not in seen:
                seen.add(key)
                citations.append({
                    "type": "STATUTE",
                    "act": match.group(1).upper(),
                    "section": match.group(2),
                    "raw": match.group(0)
                })
        
        # Extract Statutes (Pattern 2: Section 302 of IPC)
        for match in self.statute_pattern_2.finditer(text):
            key = f"{match.group(2).upper()}_{match.group(1)}"
            if key not in seen:
                seen.add(key)
                citations.append({
                    "type": "STATUTE",
                    "act": match.group(2).upper(),
                    "section": match.group(1),
                    "raw": match.group(0)
                })
            
        # Extract Case Law
        for match in self.case_pattern.finditer(text):
            raw = match.group(0)
            # Clean up: ensure we capture "State of Punjab" not just "State"
            party_b = match.group(2)
            # Look ahead in text for "of <Place>" continuation
            end_pos = match.end()
            remaining = text[end_pos:]
            of_match = re.match(r'\s+of\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)', remaining)
            if of_match:
                party_b += " of " + of_match.group(1)
                raw += of_match.group(0)
            
            if raw not in seen:
                seen.add(raw)
                citations.append({
                    "type": "CASE_LAW",
                    "party_a": match.group(1),
                    "party_b": party_b,
                    "raw": raw
                })
            
        return citations
