package com.nyaymitra.kernel.repository;

import com.nyaymitra.kernel.model.Statute;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatuteRepository extends Neo4jRepository<Statute, Long> {
    
    List<Statute> findByCode(String code);

    @Query("MATCH (s:Statute {code: 'IPC'}) RETURN s LIMIT 100")
    List<Statute> fetchIpcArchive();
}
