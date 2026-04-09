import json
import os

DATA_FILE = os.path.join(os.path.dirname(__file__), "ipc_bns_mapping.json")

def load_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as f:
        return json.load(f)

MAPPING_DB = load_data()
