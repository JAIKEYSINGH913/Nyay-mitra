"use client";
import { motion } from "framer-motion";
import Link from "next/link";

interface ServicePendingProps {
  name: string;
  icon: string;
  color: string;
  description: string;
  techStack: string[];
  steps: string[];
}

export default function ServicePending({
  name,
  icon,
  color,
  description,
  techStack,
  steps,
}: ServicePendingProps) {
  const hexAlpha = (hex: string, alpha: number) =>
    hex + Math.round(alpha * 255).toString(16).padStart(2, "0");

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: 64,
        background: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${hexAlpha(color, 0.1)} 0%, transparent 70%)`,
          pointerEvents: "none",
          filter: "blur(30px)",
        }}
      />

      {/* Scan lines */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 4px, ${hexAlpha(color, 0.015)} 4px, ${hexAlpha(color, 0.015)} 5px)`,
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 680, position: "relative" }}>
        {/* Back button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/dashboard" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: 13, marginBottom: 32, fontFamily: "'JetBrains Mono', monospace" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
            Return to Dashboard
          </Link>
        </motion.div>

        {/* Orbital animation */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(139,92,246,0.3)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#8b5cf6" }}>terminal</span>
          </div>
        </div>

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{ textAlign: "center", marginBottom: 20 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 20,
            background: hexAlpha(color, 0.1),
            border: `1px solid ${hexAlpha(color, 0.35)}`,
            marginBottom: 16,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: color }}>hourglass_empty</span>
            <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
              Integration in Progress
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, color: "var(--text-primary)", marginBottom: 12, letterSpacing: "-0.5px" }}>
            {icon} {name}
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            {description}
          </p>
        </motion.div>

        {/* Progress steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
          style={{ padding: "28px", marginBottom: 24 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: color }}>account_tree</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
              Integration Roadmap
            </span>
          </div>

          {steps.map((step, i) => {
            const done = i < 2;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  background: done ? color : "rgba(255,255,255,0.06)",
                  border: `1.5px solid ${done ? color : "var(--border-color)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700,
                  color: done ? "#fff" : "var(--text-muted)",
                  boxShadow: done ? `0 0 10px ${hexAlpha(color, 0.4)}` : "none",
                  marginTop: 1,
                }}>
                  {done ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 14, color: done ? "var(--text-primary)" : "var(--text-secondary)", lineHeight: 1.5 }}>
                  {step}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "var(--accent-blue)" }}>account_tree</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>
              PLANNED STACK
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {techStack.map((tech) => (
              <span key={tech} style={{
                fontSize: 12, padding: "5px 12px", borderRadius: 6,
                background: hexAlpha(color, 0.08),
                border: `1px solid ${hexAlpha(color, 0.25)}`,
                color, fontFamily: "'JetBrains Mono', monospace",
              }}>
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link href="/dashboard" style={{ textDecoration: "none" }}>
            <motion.button
              className="btn-primary"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span> Return Home Dashboard
            </motion.button>
          </Link>
          <Link href="/research" style={{ textDecoration: "none" }}>
            <motion.button
              className="btn-ghost"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Read Architecture Paper
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
