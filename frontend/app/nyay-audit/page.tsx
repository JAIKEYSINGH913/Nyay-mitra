import ServicePending from "@/components/ServicePending";

export default function NyayAuditPage() {
  return (
    <ServicePending
      name="Nyay-Audit"
      icon="🔍"
      color="#10b981"
      description="AI Veracity Engine that detects hallucinations in AI-generated legal documents. Every citation is validated against the Knowledge Graph with 94.2% accuracy, making NyayMitra fully trustworthy and glass-box auditable."
      techStack={["FastAPI", "Neo4j", "spaCy NLP", "Python", "Citation Parser", "GraphDB Validator"]}
      steps={[
        "Legal citation parser for IPC, BNS, CrPC, and Indian Acts",
        "Neo4j graph lookup for citation existence validation",
        "FastAPI endpoint: /audit/analyze with JSON report output",
        "Hallucination flagging engine with confidence scoring",
        "Frontend draft editor with real-time audit overlay",
        "Batch document auditing pipeline for law firms",
      ]}
    />
  );
}
