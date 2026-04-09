from pymilvus import connections
import os
from dotenv import load_dotenv

load_dotenv()

MILVUS_HOST = os.getenv("MILVUS_HOST", "localhost")
MILVUS_PORT = os.getenv("MILVUS_PORT", "19530")

def connect_milvus():
    try:
        connections.connect("default", host=MILVUS_HOST, port=MILVUS_PORT)
        print("Connected to Milvus")
    except Exception as e:
        print(f"Failed to connect to Milvus: {e}")

def disconnect_milvus():
    connections.disconnect("default")
