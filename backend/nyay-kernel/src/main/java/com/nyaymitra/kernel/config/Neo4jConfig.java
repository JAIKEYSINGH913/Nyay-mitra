package com.nyaymitra.kernel.config;

import org.neo4j.driver.AuthTokens;
import org.neo4j.driver.Driver;
import org.neo4j.driver.GraphDatabase;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Neo4jConfig {

    @Value("${spring.data.neo4j.uri}")
    private String neo4jUri;

    @Value("${spring.data.neo4j.authentication.username}")
    private String neo4jUser;

    @Value("${spring.data.neo4j.authentication.password}")
    private String neo4jPassword;

    @Bean
    public Driver neo4jDriver() {
        return GraphDatabase.driver(
                neo4jUri,
                AuthTokens.basic(neo4jUser, neo4jPassword)
        );
    }
}
