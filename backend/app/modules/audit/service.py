import re
from typing import List, Dict
from app.data.ipc_bns_mapping import MAPPING_DB  # reuse existing mapping as "Truth"
# In a real scenario, this would check Neo4j.

def extract_citations(text: str) -> List[str]:
    """Find patterns like 'IPC 302', 'Section 420'."""
    patterns = [
        r"IPC\s+(\d+[A-Z]?)",
        r"Section\s+(\d+[A-Z]?)\s+of\s+IPC",
        r"Indian\s+Penal\s+Code\s+Section\s+(\d+[A-Z]?)"
    ]
    
    citations = set()
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            citations.add(match.upper())
            
    return list(citations)

def verify_citation(section: str) -> Dict:
    """Check if section exists in our Knowledge Base (Mapping DB)."""
    # Simulate Graph Lookup
    found = False
    for item in MAPPING_DB:
        if item["ipc"] == section:
            found = True
            break
            
    if found:
        return {"section": section, "status": "Verified", "message": "Citation found in official records."}
    else:
        # Check if it looks like a valid number but just missing from our specific DB
        if section.isdigit() and int(section) < 511: # IPC has 511 sections
             return {"section": section, "status": "Flagged", "message": "Citation exists in IPC but not in current Knowledge Graph subset."}
        return {"section": section, "status": "Hallucinated", "message": "Citation appears invalid or non-existent."}

def audit_document(text: str) -> Dict:
    citations = extract_citations(text)
    results = []
    
    for cit in citations:
        results.append(verify_citation(cit))
        
    # Calculate Score
    if not results:
        score = 100
    else:
        verified_count = sum(1 for r in results if r["status"] == "Verified")
        score = int((verified_count / len(results)) * 100)
        
    return {
        "score": score,
        "citations": results,
        "summary": "Document audit complete."
    }
