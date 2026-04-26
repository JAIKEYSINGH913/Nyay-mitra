import os
from neo4j import GraphDatabase
from pymilvus import connections, utility
from dotenv import load_dotenv

load_dotenv(dotenv_path="backend/.env")

def test_neo4j():
    print("Testing Neo4j connection...")
    uri = os.getenv("NEO4J_URI")
    user = os.getenv("NEO4J_USER")
    password = os.getenv("NEO4J_PASSWORD")
    
    try:
        driver = GraphDatabase.driver(uri, auth=(user, password))
        with driver.session() as session:
            result = session.run("RETURN 1 AS one")
            record = result.single()
            if record["one"] == 1:
                print("✅ Neo4j: Connected successfully!")
            else:
                print("❌ Neo4j: Unexpected result.")
        driver.close()
    except Exception as e:
        print(f"❌ Neo4j Error: {str(e)}")

def test_milvus():
    print("Testing Milvus (Zilliz) connection...")
    uri = os.getenv("MILVUS_URI")
    user = os.getenv("MILVUS_USER")
    password = os.getenv("MILVUS_PASSWORD")
    
    try:
        connections.connect("default", uri=uri, user=user, password=password, secure=True)
        print(f"✅ Milvus: Connected successfully! Collections: {utility.list_collections()}")
    except Exception as e:
        print(f"❌ Milvus Error: {str(e)}")

if __name__ == "__main__":
    test_neo4j()
    test_milvus()
