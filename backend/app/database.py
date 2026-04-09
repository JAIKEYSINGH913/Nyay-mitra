import os
from neo4j import GraphDatabase, basic_auth
from dotenv import load_dotenv

load_dotenv()

URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
API_KEY = os.getenv("NEO4J_API_KEY")

if API_KEY:
    # Most Neo4j API keys can be passed as username with empty password in basic auth 
    # Or as a Bearer token. Standard key auth is (API_KEY, "") in some versions.
    driver = GraphDatabase.driver(URI, auth=(API_KEY, ""))
else:
    USER = os.getenv("NEO4J_USER", "neo4j")
    PASSWORD = os.getenv("NEO4J_PASSWORD", "password")
    driver = GraphDatabase.driver(URI, auth=basic_auth(USER, PASSWORD))

def get_session():
    return driver.session()

def close_driver():
    driver.close()

def query(cypher_query, parameters=None):
    with driver.session() as session:
        result = session.run(cypher_query, parameters)
        return [record.data() for record in result]
