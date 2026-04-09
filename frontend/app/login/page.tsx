"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Scale, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1200);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px 40px",
        background: "var(--bg-primary)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background effects */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(0,130,204,0.12) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />
      {/* Scan-line effect (dark mode feel) */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,130,204,0.015) 3px, rgba(0,130,204,0.015) 4px)",
        pointerEvents: "none",
      }} />

      {/* Grid corner ornaments */}
      {["tl","tr","bl","br"].map((pos) => {
        const style: React.CSSProperties = {
          position: "absolute",
          width: 60, height: 60,
          border: "1px solid rgba(0,130,204,0.3)",
          pointerEvents: "none",
        };
        if (pos === "tl") { style.top = 80; style.left = 20; style.borderRight = "none"; style.borderBottom = "none"; }
        if (pos === "tr") { style.top = 80; style.right = 20; style.borderLeft = "none"; style.borderBottom = "none"; }
        if (pos === "bl") { style.bottom = 20; style.left = 20; style.borderRight = "none"; style.borderTop = "none"; }
        if (pos === "br") { style.bottom = 20; style.right = 20; style.borderLeft = "none"; style.borderTop = "none"; }
        return <div key={pos} style={style} />;
      })}

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", maxWidth: 420, position: "relative" }}
      >
        {/* Card */}
        <div
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(20px)",
            border: "1px solid var(--border-color)",
            borderRadius: 20,
            padding: "40px 36px",
            boxShadow: "0 0 60px rgba(0,130,204,0.12), var(--card-shadow)",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <motion.div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
              whileHover={{ scale: 1.02 }}
            >
              <svg width="32" height="32" viewBox="0 0 36 36">
                <circle cx="18" cy="10" r="4" fill="var(--accent-blue)" />
                <circle cx="8" cy="26" r="3" fill="var(--accent-cyan)" />
                <circle cx="28" cy="26" r="3" fill="var(--accent-gold)" />
                <line x1="18" y1="10" x2="8" y2="26" stroke="var(--node-edge)" strokeWidth="1.5" />
                <line x1="18" y1="10" x2="28" y2="26" stroke="var(--node-edge)" strokeWidth="1.5" />
                <line x1="8" y1="26" x2="28" y2="26" stroke="var(--node-edge)" strokeWidth="1" strokeDasharray="3,2" />
              </svg>
              <span style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>
                Nyay<span className="text-gradient-blue">Mitra</span>
              </span>
            </motion.div>
            <p style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
              LEGAL AI ECOSYSTEM · SECURE ACCESS
            </p>
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6, textAlign: "center" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", textAlign: "center", marginBottom: 28 }}>
            Sign in to your NyayMitra account
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email field */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="judge@nyaymitra.gov.in"
                required
                style={{
                  width: "100%",
                  background: "rgba(0,0,0,0.05)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: 14,
                  color: "var(--text-primary)",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent-blue)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(0,86,210,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-color)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password field */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  style={{
                    width: "100%",
                    background: "rgba(0,0,0,0.05)",
                    border: "1px solid var(--border-color)",
                    borderRadius: 10,
                    padding: "12px 44px 12px 16px",
                    fontSize: 14,
                    color: "var(--text-primary)",
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--accent-blue)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(0,86,210,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-color)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: "absolute", right: 14, top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-muted)",
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontSize: 15,
                padding: "13px",
                opacity: loading ? 0.85 : 1,
              }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <motion.div
                    style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  Authenticating...
                </>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border-color)" }} />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--border-color)" }} />
          </div>

          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>Don't have an account? </span>
            <Link href="/register" style={{ fontSize: 14, fontWeight: 600, color: "var(--accent-blue)", textDecoration: "none" }}>
              Create one
            </Link>
          </div>

          {/* Security notice */}
          <div style={{
            marginTop: 24, padding: "10px 14px",
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: 8,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <Shield size={13} color="#10b981" />
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Encrypted communication · NyayMitra Security Protocol
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
