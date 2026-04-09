from database import query

def get_ipc_section(section_number):
    """
    Returns the statutory detail for a given IPC section from Neo4j Following NyayGraph schema.
    """
    cypher = """
    MATCH (s:Section {number: $section_number})-[:BELONGS_TO]->(c:Chapter)
    RETURN s.number as section, s.title as title, s.description as description, c.title as chapter
    """
    results = query(cypher, {"section_number": section_number})
    if results:
        return results[0]
    return None

def search_ipc(q):
    """
    Search IPC sections by title or description using semantic/keyword index.
    """
    cypher = """
    MATCH (s:Section)
    WHERE toLower(s.title) CONTAINS toLower($q) OR toLower(s.description) CONTAINS toLower($q)
    RETURN s.number as section, s.title as title, s.description as description
    LIMIT 10
    """
    return query(cypher, {"q": q})

# Vault section IPC_LEGACY
def get_statutory_vault_legacy():
    cypher = """
    MATCH (c:Chapter)-[:CONTAINS]->(s:Section)
    RETURN c.number as chapter_no, c.title as chapter, count(s) as section_count
    ORDER BY chapter_no
    """
    return query(cypher)
