"use client";
import { motion } from "framer-motion";
import { BookOpen, Download, ExternalLink, FileText, Tag } from "lucide-react";

const abstract = `NyayMitra proposes a novel Glass-Box Deterministic Legal AI Ecosystem specifically designed 
for the Indian judicial system, addressing the critical challenge of 51 million pending cases. 
Unlike opaque Large Language Models, NyayMitra employs a Knowledge Graph-backed GraphRAG architecture 
using Neo4j, ensuring every AI inference is fully traceable, auditable, and deterministic.

The system comprises four tightly-integrated microservices: (1) Nyay-Graph — a PageRank-optimized 
legal discovery engine on a Neo4j knowledge graph of cases, acts, and sections; (2) Nyay-Bridge — 
a deterministic IPC-to-BNS transition tool with a 511-section bidirectional mapping database; 
(3) Nyay-Audit — a veracity engine that detects hallucinations and validates AI-generated legal 
drafts against ground-truth; and (4) Nyay-Vani — a multilingual accessibility layer using the 
Bhashini API to serve India's linguistically diverse population.

Our evaluation demonstrates 94.2% audit accuracy, sub-200ms query latency on a 10K-node graph, 
and full explainability of every recommendation — establishing a new benchmark for trustworthy 
AI in critical legal infrastructure.`;

const sections = [
  { n: "1", title: "Introduction", desc: "Context of India's judicial backlog and the need for trustworthy AI" },
  { n: "2", title: "Problem Statement", desc: "Opacity of LLMs in high-stakes legal environments" },
  { n: "3", title: "Architecture Overview", desc: "GraphRAG pipeline with Neo4j at its core" },
  { n: "4", title: "Nyay-Graph", desc: "Knowledge Graph construction and PageRank optimization" },
  { n: "5", title: "Nyay-Bridge", desc: "Deterministic IPC→BNS mapping methodology" },
  { n: "6", title: "Nyay-Audit", desc: "Hallucination detection and veracity scoring" },
  { n: "7", title: "Nyay-Vani", desc: "Multilingual accessibility via Bhashini API" },
  { n: "8", title: "Evaluation", desc: "94.2% accuracy benchmarks and latency analysis" },
  { n: "9", title: "Conclusion", desc: "Future roadmap and scalability considerations" },
];

export default function ResearchPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingTop: 64 }}>
      {/* Header */}
      <div style={{
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-color)",
        padding: "60px 20px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 80% at 50% 0%, rgba(0,86,210,0.07) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <BookOpen size={16} color="var(--accent-blue)" />
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-blue)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Research Publication · 2026
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 800, color: "var(--text-primary)", marginBottom: 16, lineHeight: 1.2, letterSpacing: "-0.5px" }}>
              NyayMitra: A Proposed GraphRAG Architecture for Deterministic Legal AI in the Indian Judicial System
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
              {["GraphRAG", "Neo4j", "Legal AI", "IPC-BNS", "Knowledge Graph", "Bhashini", "India"].map(t => (
                <span key={t} style={{
                  display: "flex", alignItems: "center", gap: 4,
                  fontSize: 12, padding: "4px 10px", borderRadius: 6,
                  background: "rgba(0,86,210,0.08)", border: "1px solid rgba(0,86,210,0.2)",
                  color: "var(--accent-blue)",
                }}>
                  <Tag size={10} />{t}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <motion.button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Download size={14} /> Download PDF
              </motion.button>
              <motion.button className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <ExternalLink size={14} /> Cite Paper
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 20px", display: "flex", gap: 40, flexWrap: "wrap" }}>
        {/* Main */}
        <div style={{ flex: 1, minWidth: 300 }}>
          {/* Abstract */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card" style={{ padding: "32px", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <FileText size={16} color="var(--accent-blue)" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Abstract</h2>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--text-secondary)", whiteSpace: "pre-line" }}>
              {abstract}
            </p>
          </motion.div>

          {/* Key Metrics */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card" style={{ padding: "32px" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>Key Metrics</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { v: "94.2%", l: "Audit Accuracy", c: "#10b981" },
                { v: "<200ms", l: "Query Latency", c: "#0056D2" },
                { v: "511", l: "IPC-BNS Mappings", c: "#F59E0B" },
                { v: "22+", l: "Languages (Vani)", c: "#8b5cf6" },
              ].map(m => (
                <div key={m.l} style={{ padding: "16px", borderRadius: 10, background: `${m.c}0d`, border: `1px solid ${m.c}30` }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: m.c, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>{m.v}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{m.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* TOC Sidebar */}
        <div style={{ width: 240, flexShrink: 0 }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="glass-card" style={{ padding: "24px", position: "sticky", top: 80 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16, fontFamily: "'JetBrains Mono', monospace" }}>
              Table of Contents
            </h3>
            {sections.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.04 }}
                style={{ padding: "8px 0", borderBottom: i < sections.length - 1 ? "1px solid var(--border-color)" : "none", cursor: "pointer" }}
                whileHover={{ x: 3 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--accent-blue)", flexShrink: 0, fontWeight: 600, marginTop: 1 }}>{s.n}.</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>{s.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
