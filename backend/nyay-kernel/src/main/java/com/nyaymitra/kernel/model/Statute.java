package com.nyaymitra.kernel.model;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;

@Node("Statute")
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

    public Statute() {}

    public Statute(Long id, String section, String title, String description, String code) {
        this.id = id;
        this.section = section;
        this.title = title;
        this.description = description;
        this.code = code;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public static StatuteBuilder builder() {
        return new StatuteBuilder();
    }

    public static class StatuteBuilder {
        private Long id;
        private String section;
        private String title;
        private String description;
        private String code;

        public StatuteBuilder id(Long id) { this.id = id; return this; }
        public StatuteBuilder section(String section) { this.section = section; return this; }
        public StatuteBuilder title(String title) { this.title = title; return this; }
        public StatuteBuilder description(String description) { this.description = description; return this; }
        public StatuteBuilder code(String code) { this.code = code; return this; }

        public Statute build() {
            return new Statute(id, section, title, description, code);
        }
    }
}
