from typing import Dict, List
from app.data.ipc_bns_mapping import MAPPING_DB

def process_query(text: str) -> Dict:
    text = text.lower()
    
    # Simple Keyword Matching for Demo
    # In production, this would use an LLM or Vector Search (Milvus)
    
    keywords = {
        "murder": ["302", "307"],
        "kill": ["302"],
        "died": ["302"],
        "cheat": ["420"],
        "fraud": ["420"],
        "money": ["420"],
        "rape": ["376"],
        "assault": ["376", "307"],
        "force": ["376"],
        "country": ["124A"],
        "government": ["124A"],
        "sedition": ["124A"],
        "anti-national": ["124A"],
        "stole": ["379"], # Theft (Note: 379 might not be in our top 5 subset, need to handle gracefully)
        "theft": ["379"]
    }
    
    matched_sections = set()
    
    for word, sections in keywords.items():
        if word in text:
            for sec in sections:
                matched_sections.add(sec)
                
    results = []
    for section in matched_sections:
        # Find in our Mapping DB
        found = False
        for item in MAPPING_DB:
            if item["ipc"] == section:
                results.append(item)
                found = True
                break
        
        if not found:
            # Fallback for sections not in our small JSON subset
            if section == "379":
                 results.append({
                    "ipc": "379",
                    "bns": "303",
                    "topic": "Theft",
                    "ipc_text": "Whoever, intending to take dishonestly any movable property...",
                    "bns_text": "Whoever, intending to take dishonestly any movable property...",
                    "punishment_change": "Community service added for first-time offenders.",
                    "description_change": "Expanded definition."
                })

    if not results:
        return {
            "status": "Unsure",
            "message": "I couldn't find a specific legal section for that. Try saying 'murder', 'cheating', or 'theft'.",
            "results": []
        }
        
    return {
        "status": "Success",
        "message": f"I found {len(results)} relevant legal sections.",
        "results": results
    }
