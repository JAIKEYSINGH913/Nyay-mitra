from app.database import driver

def init_neo4j_constraints():
    if not driver:
        print("Neo4j driver not initialized.")
        return

    with driver.session() as session:
        # Constraints for Section
        session.run("CREATE CONSTRAINT section_id IF NOT EXISTS FOR (s:Section) REQUIRE s.id IS UNIQUE")
        # Constraints for Case
        session.run("CREATE CONSTRAINT case_id IF NOT EXISTS FOR (c:Case) REQUIRE c.id IS UNIQUE")
        print("Neo4j constraints initialized.")

if __name__ == "__main__":
    init_neo4j_constraints()
    if driver:
        driver.close()
