import ServicePending from "@/components/ServicePending";

export default function NyayGraphPage() {
  return (
    <ServicePending
      name="Nyay-Graph"
      icon="🕸️"
      color="#0056D2"
      description="A PageRank-optimized legal discovery engine built on a Neo4j Knowledge Graph of 500K+ cases, acts, and sections. Connects every legal precedent in India's judicial history."
      techStack={["Neo4j", "FastAPI", "GraphRAG", "PageRank", "React Force Graph", "Python"]}
      steps={[
        "Neo4j Knowledge Graph schema design and data ingestion pipeline",
        "FastAPI endpoints: /graph/seed, /graph/visualize, /graph/search",
        "PageRank algorithm tuning on legal citation networks",
        "React force-directed graph visualization component",
        "Integration with Nyay-Audit and Nyay-Bridge services",
        "Performance optimization for 500K+ node queries",
      ]}
    />
  );
}
