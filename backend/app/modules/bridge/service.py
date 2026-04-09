import json
import os
import re
from typing import List, Dict, Optional
from app.data.ipc_bns_mapping import MAPPING_DB

def get_mapping(ipc_section: str) -> Optional[Dict]:
    """Retrieve BNS equivalent for a given IPC section."""
    for item in MAPPING_DB:
        if item["ipc"] == ipc_section:
            return item
    return None

def analyze_delta(ipc_section: str) -> Dict:
    """Compare IPC and BNS sections to highlight changes."""
    item = get_mapping(ipc_section)
    if not item:
        return {"error": "Section not found"}
    
    return {
        "ipc": item["ipc"],
        "bns": item["bns"],
        "topic": item["topic"],
        "delta": {
            "punishment": item["punishment_change"],
            "description": item["description_change"]
        }
    }

def scan_text_for_ipc(text: str) -> List[Dict]:
    """Scan text for IPC section references and return mappings."""
    # Regex to find patterns like "IPC 302", "Section 302 of IPC", "IPC Section 302"
    # This is a basic regex, can be improved.
    pattern = r"(?:IPC|Section)\s+(\d+[A-Z]?)"
    matches = re.findall(pattern, text, re.IGNORECASE)
    
    results = []
    seen = set()
    
    for section in matches:
        section = section.upper()
        if section in seen:
            continue
        seen.add(section)
        
        mapping = get_mapping(section)
        if mapping:
            results.append(mapping)
            
    return results
