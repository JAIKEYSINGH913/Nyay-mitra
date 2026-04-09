"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Shield, User, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1400);
  };

  const fields = [
    { id: "name", label: "Full Name", type: "text", icon: <User size={14} />, placeholder: "Justice A. Kumar" },
    { id: "email", label: "Email Address", type: "email", icon: <Mail size={14} />, placeholder: "judge@courts.gov.in" },
    { id: "password", label: "Password", type: "password", icon: <Lock size={14} />, placeholder: "Min 8 characters" },
    { id: "confirm", label: "Confirm Password", type: "password", icon: <Lock size={14} />, placeholder: "Repeat password" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "80px 20px 40px", background: "var(--bg-primary)", position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(139,92,246,0.1) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,92,246,0.012) 3px, rgba(139,92,246,0.012) 4px)",
        pointerEvents: "none",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", maxWidth: 460 }}
      >
        <div style={{
          background: "var(--glass-bg)", backdropFilter: "blur(20px)",
          border: "1px solid var(--border-color)", borderRadius: 20,
          padding: "40px 36px",
          boxShadow: "0 0 60px rgba(139,92,246,0.1), var(--card-shadow)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <svg width="32" height="32" viewBox="0 0 36 36" style={{ margin: "0 auto 8px" }}>
              <circle cx="18" cy="10" r="4" fill="var(--accent-blue)" />
              <circle cx="8" cy="26" r="3" fill="var(--accent-cyan)" />
              <circle cx="28" cy="26" r="3" fill="var(--accent-gold)" />
              <line x1="18" y1="10" x2="8" y2="26" stroke="var(--node-edge)" strokeWidth="1.5" />
              <line x1="18" y1="10" x2="28" y2="26" stroke="var(--node-edge)" strokeWidth="1.5" />
              <line x1="8" y1="26" x2="28" y2="26" stroke="var(--node-edge)" strokeWidth="1" strokeDasharray="3,2" />
            </svg>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
              Create Account
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Join the NyayMitra legal intelligence platform
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div key={field.id} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                  {field.label}
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id={field.id}
                    type={field.id.includes("password") || field.id === "confirm" ? (showPw ? "text" : "password") : field.type}
                    placeholder={field.placeholder}
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
                      e.target.style.borderColor = "#8b5cf6";
                      e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--border-color)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  {(field.id === "password" || field.id === "confirm") && (
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      style={{
                        position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)",
                      }}
                    >
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <motion.button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, fontSize: 15, padding: "13px", marginTop: 8,
                background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
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
                  Creating Account...
                </>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>Already have an account? </span>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 600, color: "#8b5cf6", textDecoration: "none" }}>
              Sign in
            </Link>
          </div>

          <div style={{
            marginTop: 20, padding: "10px 14px",
            background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: 8, display: "flex", alignItems: "center", gap: 8,
          }}>
            <Shield size={13} color="#10b981" />
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Your data is encrypted and protected · NyayMitra Privacy Standard
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
