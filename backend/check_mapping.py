import os
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv('backend/.env')
uri = os.getenv('NEO4J_URI').replace('neo4j+s://', 'neo4j+ssc://')
user = os.getenv('NEO4J_USER')
password = os.getenv('NEO4J_PASSWORD')

driver = GraphDatabase.driver(uri, auth=(user, password))
with driver.session() as session:
    res = session.run("MATCH (i:Section {id: 'IPC_302'})-[r:MAPPED_TO]->(b:Section) RETURN b.id as bns_id").single()
    print(f"IPC_302 mapped to: {res['bns_id'] if res else 'NONE'}")
driver.close()
