import os
from pymilvus import connections, utility, Collection, CollectionSchema, FieldSchema, DataType
from dotenv import load_dotenv

load_dotenv()

# Zilliz Cloud / Milvus Setup
MILVUS_URI = os.getenv("MILVUS_URI")
MILVUS_USER = os.getenv("MILVUS_USER")
MILVUS_PASSWORD = os.getenv("MILVUS_PASSWORD")

def connect_milvus():
    """Establishes connection to Zilliz/Milvus."""
    try:
        if MILVUS_URI:
            connections.connect(
                "default",
                uri=MILVUS_URI,
                user=MILVUS_USER,
                password=MILVUS_PASSWORD,
                secure=True
            )
        else:
            connections.connect("default", host="localhost", port="19530")
        print("✅ MILVUS_CONNECTION: ESTABLISHED")
    except Exception as e:
        print(f"❌ MILVUS_CONNECTION: FAILED - {e}")

def init_milvus_collection():
    """Initializes the nyay_statutes collection for legal vector search."""
    collection_name = "nyay_statutes"
    
    if utility.has_collection(collection_name):
        print(f"📡 COLLECTION_STATUS: {collection_name} ALREADY_EXISTS")
        return Collection(collection_name)

    # 1. Define Schema
    fields = [
        FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
        FieldSchema(name="section_id", dtype=DataType.VARCHAR, max_length=100),
        FieldSchema(name="text_content", dtype=DataType.VARCHAR, max_length=65535),
        FieldSchema(name="vector", dtype=DataType.FLOAT_VECTOR, dim=1536) # Dim: 1536 for Llama/OpenAI
    ]
    schema = CollectionSchema(fields, "Legal statute vector repository for Nyay-Mitra")

    # 2. Create Collection
    collection = Collection(collection_name, schema)
    print(f"✅ COLLECTION_CREATED: {collection_name}")

    # 3. Create Index (HNSW for ultra-fast latency)
    index_params = {
        "metric_type": "L2",
        "index_type": "HNSW",
        "params": {"M": 8, "efConstruction": 64}
    }
    collection.create_index(field_name="vector", index_params=index_params)
    print("⚡ INDEX_TYPE: HNSW_INITIALIZED")
    
    return collection

def disconnect_milvus():
    connections.disconnect("default")

if __name__ == "__main__":
    connect_milvus()
    init_milvus_collection()
