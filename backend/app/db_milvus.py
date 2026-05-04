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
        if connections.has_connection("default"):
            connections.disconnect("default")
            
        if MILVUS_URI:
            print(f"INFO: CONNECTING_TO_MILVUS_CLOUD: {MILVUS_URI}")
            connections.connect(
                alias="default",
                uri=MILVUS_URI,
                user=MILVUS_USER,
                password=MILVUS_PASSWORD,
                secure=True
            )
        else:
            print("INFO: CONNECTING_TO_MILVUS_LOCAL: localhost:19530")
            connections.connect(alias="default", host="localhost", port="19530")
        
        # Verify connection
        utility.list_collections()
        print("INFO: MILVUS_CONNECTION: ESTABLISHED")
    except Exception as e:
        print(f"ERROR: MILVUS_CONNECTION: FAILED - {e}")
        raise e


def init_milvus_collection():
    """Initializes the nyay_statutes collection for legal vector search."""
    collection_name = "nyay_statutes"
    
    if utility.has_collection(collection_name):
        print(f"INFO: COLLECTION_STATUS: {collection_name} ALREADY_EXISTS")
        return Collection(collection_name)

    # 1. Define Schema
    fields = [
        FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
        FieldSchema(name="section_id", dtype=DataType.VARCHAR, max_length=100),
        FieldSchema(name="text_content", dtype=DataType.VARCHAR, max_length=65535),
        FieldSchema(name="vector", dtype=DataType.FLOAT_VECTOR, dim=768) # Dim: 768 for InLegalBERT
    ]
    schema = CollectionSchema(fields, "Legal statute vector repository for Nyay-Mitra")

    # 2. Create Collection
    collection = Collection(collection_name, schema)
    print(f"INFO: COLLECTION_CREATED: {collection_name}")

    # 3. Create Index (HNSW for ultra-fast latency)
    index_params = {
        "metric_type": "L2",
        "index_type": "HNSW",
        "params": {"M": 8, "efConstruction": 64}
    }
    collection.create_index(field_name="vector", index_params=index_params)
    print("INFO: INDEX_TYPE: HNSW_INITIALIZED")
    
    return collection

def disconnect_milvus():
    connections.disconnect("default")

if __name__ == "__main__":
    connect_milvus()
    init_milvus_collection()
