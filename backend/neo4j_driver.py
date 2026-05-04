"""
Shared Neo4j driver factory for Python 3.14 SSL compatibility.
AuraDB uses self-signed certificate chains that Python 3.14 rejects.
This helper transparently switches from neo4j+s:// to neo4j+ssc:// to bypass cert verification.
"""
import os
from neo4j import GraphDatabase
from dotenv import load_dotenv

# Load shared .env from root
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))


def get_neo4j_driver():
    """Create a Neo4j driver with Python 3.14 SSL fix."""
    uri = os.getenv("NEO4J_URI")
    user = os.getenv("NEO4J_USER", os.getenv("NEO4J_USERNAME"))
    password = os.getenv("NEO4J_PASSWORD")
    
    # Fix: neo4j+s:// fails cert verification on Python 3.14
    if "+s://" in uri and "+ssc://" not in uri:
        uri = uri.replace("neo4j+s://", "neo4j+ssc://").replace("bolt+s://", "bolt+ssc://")
    
    return GraphDatabase.driver(uri, auth=(user, password))
