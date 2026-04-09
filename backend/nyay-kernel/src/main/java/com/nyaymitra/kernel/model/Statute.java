package com.nyaymitra.kernel.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;

@Node("Statute")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Statute {

    @Id
    @GeneratedValue
    private Long id;

    @Property("section")
    private String section;

    @Property("title")
    private String title;

    @Property("description")
    private String description;

    @Property("code")
    private String code; // IPC, BNS, etc.
}
