"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mic, MicOff, Terminal, Activity, ArrowRight, RefreshCw, Send } from "lucide-react";
import Link from "next/link";

const services = [
  { name: "Nyay-Graph", desc: "Discovery Engine", href: "/nyay-graph", color: "#0056D2", icon: "🕸️", status: "active" },
  { name: "Nyay-Bridge", desc: "IPC→BNS Transition", href: "/nyay-bridge", color: "#F59E0B", icon: "🌉", status: "active" },
  { name: "Nyay-Audit", desc: "Veracity Engine", href: "/nyay-audit", color: "#10b981", icon: "🔍", status: "pending" },
  { name: "Nyay-Vani", desc: "Accessibility Engine", href: "/nyay-vani", color: "#8b5cf6", icon: "🎙️", status: "pending" },
];

const terminalHistory = [
  { type: "system", text: "NyayMitra Terminal v1.0.0 — GraphRAG Legal AI" },
  { type: "system", text: "Connected to Neo4j Knowledge Graph (10K nodes)" },
  { type: "prompt", text: "Type a legal query or use voice input..." },
];

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);
  const [history, setHistory] = useState(terminalHistory);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const userMsg = { type: "user", text: `> ${query}` };
    const sysResp = { type: "response", text: `⚡ Processing query via GraphRAG pipeline... [Nyay-Graph → Bhashini → Audit Engine]` };
    setHistory((h) => [...h, userMsg, sysResp]);
    setQuery("");
  };

  const toggleVoice = () => {
    setListening((l) => !l);
    if (!listening) {
      setTimeout(() => {
        setListening(false);
        setQuery("Show me cases related to IPC Section 302");
      }, 2000);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: 64,
        background: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          borderBottom: "1px solid var(--border-color)",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bg-secondary)",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div className="status-dot status-active" />
            <span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}>
              SYSTEM ONLINE · {formatUptime(uptime)}
            </span>
          </div>
          <div style={{ width: 1, height: 16, background: "var(--border-color)" }} />
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
            NEO4J: CONNECTED · 10,520 NODES · RABBITMQ: ACTIVE
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <motion.button
            style={{
              background: "none", border: "1px solid var(--border-color)", borderRadius: 6,
              padding: "5px 10px", cursor: "pointer", color: "var(--text-muted)", fontSize: 11,
              display: "flex", alignItems: "center", gap: 4, fontFamily: "'JetBrains Mono', monospace",
            }}
            whileHover={{ borderColor: "var(--accent-cyan)", color: "var(--accent-cyan)" }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={11} /> REFRESH
          </motion.button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        <div
          style={{
            width: 280,
            borderRight: "1px solid var(--border-color)",
            background: "var(--bg-secondary)",
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "var(--text-muted)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 8,
              paddingLeft: 8,
            }}
          >
            Microservices
          </p>

          {services.map((svc, i) => (
            <motion.div key={svc.name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
              <Link href={svc.href} style={{ textDecoration: "none" }}>
                <motion.div
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    transition: "all 0.2s",
                  }}
                  whileHover={{
                    background: `${svc.color}10`,
                    borderColor: `${svc.color}40`,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span style={{ fontSize: 20 }}>{svc.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{svc.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{svc.desc}</div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <div
                      className={`status-dot ${svc.status === "active" ? "status-active" : "status-pending"}`}
                    />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}

          <div style={{ borderTop: "1px solid var(--border-color)", marginTop: 16, paddingTop: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 12, paddingLeft: 8 }}>
              Quick Stats
            </p>
            {[
              { label: "Graph Nodes", value: "10,520", color: "#0056D2" },
              { label: "BNS Mappings", value: "511", color: "#F59E0B" },
              { label: "Audit Accuracy", value: "94.2%", color: "#10b981" },
              { label: "Active Users", value: "3", color: "#8b5cf6" },
            ].map((stat) => (
              <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", marginBottom: 2 }}>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{stat.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: stat.color, fontFamily: "'JetBrains Mono', monospace" }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: 20, overflow: "auto" }}>
          {/* Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="terminal-window"
            style={{ padding: "20px" }}
          >
            {/* Terminal header */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
              <span style={{ flex: 1, textAlign: "center", fontSize: 11, color: "rgba(34,211,238,0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
                nyaymitra@legal-ai ~ /dashboard
              </span>
              <Terminal size={12} color="rgba(34,211,238,0.4)" />
            </div>

            {/* Terminal history */}
            <div style={{ minHeight: 160, maxHeight: 300, overflowY: "auto", marginBottom: 12 }}>
              <AnimatePresence>
                {history.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      fontSize: 13,
                      lineHeight: 1.8,
                      fontFamily: "'JetBrains Mono', monospace",
                      color:
                        line.type === "system" ? "rgba(34,211,238,0.6)" :
                        line.type === "user" ? "#22d3ee" :
                        line.type === "response" ? "#10b981" :
                        "rgba(34,211,238,0.4)",
                    }}
                  >
                    {line.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input row */}
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderTop: "1px solid rgba(34,211,238,0.15)",
                  paddingTop: 12,
                }}
              >
                <span style={{ fontSize: 13, color: "#22d3ee", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>
                  {listening ? "🔴 " : "❯ "}
                </span>
                <input
                  className="terminal-input"
                  value={listening ? "🎙️ Listening via Bhashini API..." : query}
                  onChange={(e) => !listening && setQuery(e.target.value)}
                  placeholder={listening ? "" : "Search legal sections, cases, BNS mappings..."}
                  readOnly={listening}
                  style={{ fontSize: 13, flex: 1 }}
                />
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <motion.button
                    type="button"
                    onClick={toggleVoice}
                    style={{
                      background: listening ? "rgba(239,68,68,0.15)" : "rgba(34,211,238,0.1)",
                      border: `1px solid ${listening ? "rgba(239,68,68,0.4)" : "rgba(34,211,238,0.25)"}`,
                      borderRadius: 6, padding: "6px 8px", cursor: "pointer",
                      color: listening ? "#ef4444" : "#22d3ee",
                      display: "flex", alignItems: "center",
                    }}
                    animate={listening ? { boxShadow: ["0 0 0 0 rgba(239,68,68,0)", "0 0 0 8px rgba(239,68,68,0)"] } : {}}
                    transition={listening ? { duration: 1, repeat: Infinity } : {}}
                    whileHover={{ scale: 1.08 }}
                    title="Bhashini Voice Input"
                  >
                    {listening ? <MicOff size={14} /> : <Mic size={14} />}
                  </motion.button>
                  <motion.button
                    type="submit"
                    style={{
                      background: "rgba(0,86,210,0.2)", border: "1px solid rgba(0,86,210,0.4)",
                      borderRadius: 6, padding: "6px 10px", cursor: "pointer", color: "#0082cc",
                      display: "flex", alignItems: "center", gap: 4, fontSize: 12,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send size={12} /> RUN
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Service Cards Grid */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>
              Service Overview
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
              {services.map((svc, i) => (
                <motion.div
                  key={svc.name}
                  className="glass-card"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  style={{ padding: "20px" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <span style={{ fontSize: 28 }}>{svc.icon}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div className={`status-dot ${svc.status === "active" ? "status-active" : "status-pending"}`} />
                      <span style={{ fontSize: 10, color: svc.status === "active" ? "#10b981" : "#F59E0B", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>
                        {svc.status === "active" ? "Live" : "Pending"}
                      </span>
                    </div>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{svc.name}</h3>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 14 }}>{svc.desc}</p>
                  <Link href={svc.href} style={{ textDecoration: "none" }}>
                    <motion.span style={{ fontSize: 12, fontWeight: 600, color: svc.color, display: "flex", alignItems: "center", gap: 4 }} whileHover={{ x: 3 }}>
                      Open Service <ArrowRight size={12} />
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
