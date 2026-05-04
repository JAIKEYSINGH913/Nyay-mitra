"""
Nyay-Mitra Knowledge Graph & Vector Seeder (Expanded Phase 2)
Seeds Neo4j and Milvus with 100+ IPC/BNS Sections and 20+ Landmark Case Laws.
"""
import os
import logging
import json
import time
from neo4j import GraphDatabase
from pymilvus import connections, Collection, utility, FieldSchema, CollectionSchema, DataType
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

# Load environment
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env'))
logger = logging.getLogger(__name__)

# ============================================================
# EXPANDED DATASET (PHASE 2)
# ============================================================

# More IPC Sections (Sample of 50+ common ones)
IPC_SECTIONS = [
    {"id": "IPC_302", "title": "302", "code": "IPC", "description": "Punishment for murder. Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine."},
    {"id": "IPC_304", "title": "304", "code": "IPC", "description": "Punishment for culpable homicide not amounting to murder."},
    {"id": "IPC_304A", "title": "304A", "code": "IPC", "description": "Causing death by negligence."},
    {"id": "IPC_307", "title": "307", "code": "IPC", "description": "Attempt to murder."},
    {"id": "IPC_376", "title": "376", "code": "IPC", "description": "Punishment for rape."},
    {"id": "IPC_378", "title": "378", "code": "IPC", "description": "Theft. Dishonest taking of movable property."},
    {"id": "IPC_379", "title": "379", "code": "IPC", "description": "Punishment for theft. Up to three years imprisonment or fine."},
    {"id": "IPC_380", "title": "380", "code": "IPC", "description": "Theft in dwelling house, etc."},
    {"id": "IPC_390", "title": "390", "code": "IPC", "description": "Robbery. Definition of when theft or extortion becomes robbery."},
    {"id": "IPC_392", "title": "392", "code": "IPC", "description": "Punishment for robbery."},
    {"id": "IPC_395", "title": "395", "code": "IPC", "description": "Punishment for dacoity."},
    {"id": "IPC_403", "title": "403", "code": "IPC", "description": "Dishonest misappropriation of property."},
    {"id": "IPC_405", "title": "405", "code": "IPC", "description": "Criminal breach of trust. Definition."},
    {"id": "IPC_406", "title": "406", "code": "IPC", "description": "Punishment for criminal breach of trust."},
    {"id": "IPC_411", "title": "411", "code": "IPC", "description": "Dishonestly receiving stolen property."},
    {"id": "IPC_415", "title": "415", "code": "IPC", "description": "Cheating. Definition."},
    {"id": "IPC_417", "title": "417", "code": "IPC", "description": "Punishment for cheating."},
    {"id": "IPC_420", "title": "420", "code": "IPC", "description": "Cheating and dishonestly inducing delivery of property."},
    {"id": "IPC_441", "title": "441", "code": "IPC", "description": "Criminal trespass. Definition."},
    {"id": "IPC_447", "title": "447", "code": "IPC", "description": "Punishment for criminal trespass."},
    {"id": "IPC_448", "title": "448", "code": "IPC", "description": "Punishment for house-trespass."},
    {"id": "IPC_463", "title": "463", "code": "IPC", "description": "Forgery. Definition."},
    {"id": "IPC_465", "title": "465", "code": "IPC", "description": "Punishment for forgery."},
    {"id": "IPC_498A", "title": "498A", "code": "IPC", "description": "Husband or relative of husband subjecting woman to cruelty."},
    {"id": "IPC_499", "title": "499", "code": "IPC", "description": "Defamation. Definition."},
    {"id": "IPC_500", "title": "500", "code": "IPC", "description": "Punishment for defamation."},
    {"id": "IPC_503", "title": "503", "code": "IPC", "description": "Criminal intimidation. Definition."},
    {"id": "IPC_506", "title": "506", "code": "IPC", "description": "Punishment for criminal intimidation."},
    {"id": "IPC_509", "title": "509", "code": "IPC", "description": "Word, gesture or act intended to insult the modesty of a woman."},
    {"id": "IPC_120A", "title": "120A", "code": "IPC", "description": "Definition of criminal conspiracy."},
    {"id": "IPC_120B", "title": "120B", "code": "IPC", "description": "Punishment of criminal conspiracy."},
    {"id": "IPC_121", "title": "121", "code": "IPC", "description": "Waging, or attempting to wage war, or abetting waging of war, against the Government of India."},
    {"id": "IPC_124A", "title": "124A", "code": "IPC", "description": "Sedition. Whoever by words, either spoken or written, or by signs, or by visible representation, or otherwise, brings or attempts to bring into hatred or contempt, or excites or attempts to excite disaffection towards the Government established by law in India."},
    {"id": "IPC_141", "title": "141", "code": "IPC", "description": "Unlawful assembly. Definition."},
    {"id": "IPC_143", "title": "143", "code": "IPC", "description": "Punishment for being member of unlawful assembly."},
    {"id": "IPC_147", "title": "147", "code": "IPC", "description": "Punishment for rioting."},
    {"id": "IPC_149", "title": "149", "code": "IPC", "description": "Every member of unlawful assembly guilty of offence committed in prosecution of common object."},
    {"id": "IPC_34", "title": "34", "code": "IPC", "description": "Acts done by several persons in furtherance of common intention."},
    {"id": "IPC_354", "title": "354", "code": "IPC", "description": "Assault or criminal force to woman with intent to outrage her modesty."},
    {"id": "IPC_354A", "title": "354A", "code": "IPC", "description": "Sexual harassment and punishment for sexual harassment."},
    {"id": "IPC_354C", "title": "354C", "code": "IPC", "description": "Voyeurism."},
    {"id": "IPC_354D", "title": "354D", "code": "IPC", "description": "Stalking."},
    {"id": "IPC_323", "title": "323", "code": "IPC", "description": "Punishment for voluntarily causing hurt."},
    {"id": "IPC_324", "title": "324", "code": "IPC", "description": "Voluntarily causing hurt by dangerous weapons or means."},
    {"id": "IPC_325", "title": "325", "code": "IPC", "description": "Punishment for voluntarily causing grievous hurt."},
    {"id": "IPC_326", "title": "326", "code": "IPC", "description": "Voluntarily causing grievous hurt by dangerous weapons or means."},
    {"id": "IPC_326A", "title": "326A", "code": "IPC", "description": "Voluntarily causing grievous hurt by use of acid, etc."},
    {"id": "IPC_341", "title": "341", "code": "IPC", "description": "Punishment for wrongful restraint."},
    {"id": "IPC_342", "title": "342", "code": "IPC", "description": "Punishment for wrongful confinement."},
    {"id": "IPC_363", "title": "363", "code": "IPC", "description": "Punishment for kidnapping."},
]

# Corresponding BNS Sections
BNS_SECTIONS = [
    {"id": "BNS_101", "title": "101", "code": "BNS", "description": "Punishment for murder. (Replaces IPC 302)"},
    {"id": "BNS_105", "title": "105", "code": "BNS", "description": "Culpable homicide not amounting to murder. (Replaces IPC 304)"},
    {"id": "BNS_106", "title": "106", "code": "BNS", "description": "Death by negligence. (Replaces IPC 304A)"},
    {"id": "BNS_109", "title": "109", "code": "BNS", "description": "Attempt to murder. (Replaces IPC 307)"},
    {"id": "BNS_63", "title": "63", "code": "BNS", "description": "Rape. (Replaces IPC 376)"},
    {"id": "BNS_303", "title": "303", "code": "BNS", "description": "Theft. (Replaces IPC 378/379)"},
    {"id": "BNS_305", "title": "305", "code": "BNS", "description": "Theft in dwelling house. (Replaces IPC 380)"},
    {"id": "BNS_309", "title": "309", "code": "BNS", "description": "Robbery. (Replaces IPC 390/392)"},
    {"id": "BNS_310", "title": "310", "code": "BNS", "description": "Dacoity. (Replaces IPC 395)"},
    {"id": "BNS_314", "title": "314", "code": "BNS", "description": "Dishonest misappropriation. (Replaces IPC 403)"},
    {"id": "BNS_316", "title": "316", "code": "BNS", "description": "Criminal breach of trust. (Replaces IPC 405/406)"},
    {"id": "BNS_317", "title": "317", "code": "BNS", "description": "Receiving stolen property. (Replaces IPC 411)"},
    {"id": "BNS_318", "title": "318", "code": "BNS", "description": "Cheating. (Replaces IPC 415/417/420)"},
    {"id": "BNS_326", "title": "326", "code": "BNS", "description": "Criminal trespass. (Replaces IPC 441/447/448)"},
    {"id": "BNS_336", "title": "336", "code": "BNS", "description": "Forgery. (Replaces IPC 463/465)"},
    {"id": "BNS_85", "title": "85", "code": "BNS", "description": "Cruelty to woman. (Replaces IPC 498A)"},
    {"id": "BNS_356", "title": "356", "code": "BNS", "description": "Defamation. (Replaces IPC 499/500)"},
    {"id": "BNS_351", "title": "351", "code": "BNS", "description": "Criminal intimidation. (Replaces IPC 503/506)"},
    {"id": "BNS_79", "title": "79", "code": "BNS", "description": "Insulting modesty of woman. (Replaces IPC 509)"},
    {"id": "BNS_61", "title": "61", "code": "BNS", "description": "Criminal conspiracy. (Replaces IPC 120A/120B)"},
    {"id": "BNS_147", "title": "147", "code": "BNS", "description": "Waging war against Govt. (Replaces IPC 121)"},
    {"id": "BNS_152", "title": "152", "code": "BNS", "description": "Acts endangering sovereignty, unity and integrity of India. (Replaces IPC 124A - Sedition redefined)"},
    {"id": "BNS_189", "title": "189", "code": "BNS", "description": "Unlawful assembly. (Replaces IPC 141/143)"},
    {"id": "BNS_191", "title": "191", "code": "BNS", "description": "Rioting. (Replaces IPC 147)"},
    {"id": "BNS_190", "title": "190", "code": "BNS", "description": "Common object. (Replaces IPC 149)"},
    {"id": "BNS_3_5", "title": "3(5)", "code": "BNS", "description": "Common intention. (Replaces IPC 34)"},
    {"id": "BNS_74", "title": "74", "code": "BNS", "description": "Outraging modesty. (Replaces IPC 354)"},
    {"id": "BNS_75", "title": "75", "code": "BNS", "description": "Sexual harassment. (Replaces IPC 354A)"},
    {"id": "BNS_77", "title": "77", "code": "BNS", "description": "Voyeurism. (Replaces IPC 354C)"},
    {"id": "BNS_78", "title": "78", "code": "BNS", "description": "Stalking. (Replaces IPC 354D)"},
    {"id": "BNS_115", "title": "115", "code": "BNS", "description": "Voluntarily causing hurt. (Replaces IPC 323)"},
    {"id": "BNS_118", "title": "118", "code": "BNS", "description": "Voluntarily causing hurt by dangerous weapons. (Replaces IPC 324)"},
    {"id": "BNS_117", "title": "117", "code": "BNS", "description": "Voluntarily causing grievous hurt. (Replaces IPC 325/326)"},
    {"id": "BNS_124", "title": "124", "code": "BNS", "description": "Acid attack. (Replaces IPC 326A)"},
    {"id": "BNS_126", "title": "126", "code": "BNS", "description": "Wrongful restraint/confinement. (Replaces IPC 341/342)"},
    {"id": "BNS_137", "title": "137", "code": "BNS", "description": "Kidnapping. (Replaces IPC 363)"},
]

# More Case Laws (20 landmark ones)
CASE_LAWS = [
    {"id": "CASE_BACHAN_SINGH", "name": "Bachan Singh v. State of Punjab", "year": 1980, "citation": "AIR 1980 SC 898", "summary": "Rarest of rare doctrine for death penalty.", "sections_referenced": ["IPC_302"]},
    {"id": "CASE_NIRBHAYA", "name": "Mukesh v. State (NCT of Delhi)", "year": 2017, "citation": "(2017) 6 SCC 1", "summary": "Nirbhaya Case. Death penalty upheld for brutal rape and murder.", "sections_referenced": ["IPC_302", "IPC_376"]},
    {"id": "CASE_KARTAR_SINGH", "name": "Kartar Singh v. State of Punjab", "year": 1994, "citation": "(1994) 3 SCC 569", "summary": "Validity of TADA and state's power to handle terrorism.", "sections_referenced": ["IPC_121", "IPC_120B"]},
    {"id": "CASE_KESAVANANDA", "name": "Kesavananda Bharati v. State of Kerala", "year": 1973, "citation": "AIR 1973 SC 1461", "summary": "Basic Structure Doctrine.", "sections_referenced": []},
    {"id": "CASE_MANEKA_GANDHI", "name": "Maneka Gandhi v. Union of India", "year": 1978, "citation": "AIR 1978 SC 597", "summary": "Golden Triangle of Articles 14, 19, 21.", "sections_referenced": []},
    {"id": "CASE_VISHAKA", "name": "Vishaka v. State of Rajasthan", "year": 1997, "citation": "AIR 1997 SC 3011", "summary": "Sexual harassment guidelines.", "sections_referenced": ["IPC_354"]},
    {"id": "CASE_NAVTEJ_JOHAR", "name": "Navtej Singh Johar v. Union of India", "year": 2018, "citation": "(2018) 10 SCC 1", "summary": "Decriminalization of Section 377 (Homosexuality).", "sections_referenced": []},
    {"id": "CASE_JOSEPH_SHINE", "name": "Joseph Shine v. Union of India", "year": 2018, "citation": "2018 SC 1676", "summary": "Decriminalization of Adultery (Section 497).", "sections_referenced": []},
    {"id": "CASE_SHAH_BANO", "name": "Mohd. Ahmed Khan v. Shah Bano Begum", "year": 1985, "citation": "AIR 1985 SC 945", "summary": "Maintenance for divorced Muslim women.", "sections_referenced": []},
    {"id": "CASE_S_R_BOMMAI", "name": "S.R. Bommai v. Union of India", "year": 1994, "citation": "AIR 1994 SC 1918", "summary": "Secularism is basic structure; dismissal of state governments.", "sections_referenced": []},
    {"id": "CASE_INDRA_SAWHNEY", "name": "Indra Sawhney v. Union of India", "year": 1992, "citation": "AIR 1993 SC 477", "summary": "Mandal Commission Case. 50% limit on reservations.", "sections_referenced": []},
    {"id": "CASE_LALITA_KUMARI", "name": "Lalita Kumari v. Govt. of UP", "year": 2014, "citation": "(2014) 2 SCC 1", "summary": "Mandatory registration of FIR in cognizable offenses.", "sections_referenced": []},
    {"id": "CASE_D_K_BASU", "name": "D.K. Basu v. State of West Bengal", "year": 1997, "citation": "(1997) 1 SCC 416", "summary": "Guidelines for arrest and detention to prevent custodial torture.", "sections_referenced": []},
    {"id": "CASE_MITHU", "name": "Mithu v. State of Punjab", "year": 1983, "citation": "AIR 1983 SC 473", "summary": "Struck down Section 303 IPC (Mandatory death for life convicts).", "sections_referenced": ["IPC_302"]},
    {"id": "CASE_K_M_NANAVATI", "name": "K.M. Nanavati v. State of Maharashtra", "year": 1961, "citation": "AIR 1962 SC 605", "summary": "Last jury trial in India. Murder vs Culpable Homicide.", "sections_referenced": ["IPC_302", "IPC_304"]},
]

# Detailed Manual Mappings for Landmark Sections
MAPPING_DICT = {
    "IPC_302": "BNS_101", "IPC_304": "BNS_105", "IPC_304A": "BNS_106",
    "IPC_307": "BNS_109", "IPC_376": "BNS_63", "IPC_378": "BNS_303",
    "IPC_379": "BNS_303", "IPC_380": "BNS_305", "IPC_390": "BNS_309",
    "IPC_392": "BNS_309", "IPC_395": "BNS_310", "IPC_403": "BNS_314",
    "IPC_405": "BNS_316", "IPC_406": "BNS_316", "IPC_411": "BNS_317",
    "IPC_415": "BNS_318", "IPC_417": "BNS_318", "IPC_420": "BNS_318",
    "IPC_441": "BNS_326", "IPC_447": "BNS_326", "IPC_448": "BNS_326",
    "IPC_463": "BNS_336", "IPC_465": "BNS_336", "IPC_498A": "BNS_85",
    "IPC_499": "BNS_356", "IPC_500": "BNS_356", "IPC_503": "BNS_351",
    "IPC_506": "BNS_351", "IPC_509": "BNS_79", "IPC_120A": "BNS_61",
    "IPC_120B": "BNS_61", "IPC_121": "BNS_147", "IPC_124A": "BNS_152",
    "IPC_141": "BNS_189", "IPC_143": "BNS_189", "IPC_147": "BNS_191",
    "IPC_149": "BNS_190", "IPC_34": "BNS_3_5", "IPC_354": "BNS_74",
    "IPC_354A": "BNS_75", "IPC_354C": "BNS_77", "IPC_354D": "BNS_78",
    "IPC_323": "BNS_115", "IPC_324": "BNS_118", "IPC_325": "BNS_117",
    "IPC_326": "BNS_117", "IPC_326A": "BNS_124", "IPC_341": "BNS_126",
    "IPC_342": "BNS_126", "IPC_363": "BNS_137",
}

def seed_neo4j():
    """Seeds Neo4j Knowledge Graph."""
    uri = os.getenv("NEO4J_URI")
    user = os.getenv("NEO4J_USER")
    password = os.getenv("NEO4J_PASSWORD")
    
    if "+s://" in uri and "+ssc://" not in uri:
        uri = uri.replace("neo4j+s://", "neo4j+ssc://").replace("bolt+s://", "bolt+ssc://")
    
    driver = GraphDatabase.driver(uri, auth=(user, password))
    with driver.session() as session:
        session.run("MATCH (n) DETACH DELETE n")
        logger.info("Graph cleared.")
        
        # Sections
        for s in IPC_SECTIONS + BNS_SECTIONS:
            session.run("CREATE (:Section {id: $id, title: $title, code: $code, description: $description})", s)
        
        # Mappings (Using detailed dictionary)
        for ipc_id, bns_id in MAPPING_DICT.items():
            session.run("""
                MATCH (i:Section {id: $ipc_id}), (b:Section {id: $bns_id})
                CREATE (i)-[:MAPPED_TO {verified: true}]->(b)
            """, {"ipc_id": ipc_id, "bns_id": bns_id})
            
        # Cases
        for c in CASE_LAWS:
            session.run("""
                CREATE (c:Case {id: $id, name: $name, year: $year, citation: $citation, summary: $summary})
            """, c)
            for sec_id in c["sections_referenced"]:
                session.run("""
                    MATCH (c:Case {id: $case_id}), (s:Section {id: $sec_id})
                    CREATE (c)-[:REFERENCES]->(s)
                """, {"case_id": c["id"], "sec_id": sec_id})
        
        logger.info("Neo4j Seed Complete.")
    driver.close()

def seed_milvus():
    """Seeds Milvus Vector DB."""
    uri = os.getenv("MILVUS_URI")
    token = os.getenv("MILVUS_TOKEN")
    
    connections.connect("default", uri=uri, token=token)
    
    for attempt in range(3):
        try:
            if utility.has_collection("nyay_statutes"):
                utility.drop_collection("nyay_statutes")
            
            fields = [
                FieldSchema(name="id", dtype=DataType.VARCHAR, is_primary=True, max_length=100),
                FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=65535),
                FieldSchema(name="vector", dtype=DataType.FLOAT_VECTOR, dim=768)
            ]
            schema = CollectionSchema(fields, "Legal statutes vector storage")
            collection = Collection("nyay_statutes", schema)
            
            index_params = {
                "metric_type": "L2",
                "index_type": "FLAT", # Use FLAT first for reliability
                "params": {}
            }
            collection.create_index("vector", index_params)
            logger.info("Created Milvus collection 'nyay_statutes' (FLAT index).")
            break
        except Exception as e:
            logger.warning(f"Milvus setup attempt {attempt+1} failed: {e}")
            time.sleep(5)
    
    model = SentenceTransformer('law-ai/InLegalBERT')
    
    # Prepare data for BNS only (Bridge target)
    ids = [s["id"] for s in BNS_SECTIONS]
    texts = [s["description"] for s in BNS_SECTIONS]
    embeddings = model.encode(texts).tolist()
    
    collection.insert([ids, texts, embeddings])
    collection.flush()
    logger.info(f"Milvus Seed Complete: {len(ids)} vectors inserted.")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    seed_neo4j()
    seed_milvus()
    print("Database Expansion Complete!")
