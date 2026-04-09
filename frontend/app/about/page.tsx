"use client";
import { motion } from "framer-motion";
import { Scale, Target, Heart } from "lucide-react";
import { Github } from "../../components/icons";

const team = [
  { name: "Jaikey Singh", role: "Sovereign Architect", avatar: "JS", color: "#00E0FF" },
  { name: "Gaurav Singh", role: "Full-Stack Engineer", avatar: "GS", color: "#FFD700" },
  { name: "Amit Yadav", role: "Systems Infrastructure", avatar: "AY", color: "#00E0FF" },
  { name: "Harshit Verma", role: "Neural Networks", avatar: "HV", color: "#FFD700" },
  { name: "Saurabh Pathak", role: "Data Integrity", avatar: "SP", color: "#00E0FF" },
  { name: "Dr. Anand Prakash Srivastava", role: "Strategic Advisor", avatar: "AS", color: "#FFD700" },
  { name: "Arun Choudhary", role: "Technical Lead", avatar: "AC", color: "#00E0FF" }
];

const values = [
  { icon: <Scale size={20} />, title: "Deterministic", color: "#0056D2", desc: "Every legal inference is traced to a ground-truth node in the Knowledge Graph. No hallucinations." },
  { icon: <Target size={20} />, title: "Glass-Box", color: "#F59E0B", desc: "Full transparency into every recommendation. Legal professionals can audit the reasoning path." },
  { icon: <Heart size={20} />, title: "Accessible", color: "#10b981", desc: "Bhashini API powers 22+ Indian languages, making justice accessible to every citizen." },
  { icon: <Github size={20} />, title: "Open Core", color: "#8b5cf6", desc: "Core Knowledge Graph schema and Bridge mappings are open-source for India's legal community." },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingTop: 64 }}>
      {/* Hero */}
      <section style={{ padding: "80px 20px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,86,210,0.07) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, background: "rgba(0,86,210,0.08)", border: "1px solid rgba(0,86,210,0.2)", marginBottom: 20 }}>
            <Scale size={14} color="var(--accent-blue)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-blue)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Our Mission</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, color: "var(--text-primary)", marginBottom: 20, letterSpacing: "-1px", lineHeight: 1.1 }}>
            Justice for <span className="text-gradient-blue">Every Citizen</span>
          </h1>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 32 }}>
            NyayMitra was built to tackle India's crisis of 51 million pending cases by giving legal professionals the most deterministic, explainable AI tool ever built for the Indian judicial system.
          </p>
          <a href="https://github.com/JAIKEYSINGH913/Nyay-mitra" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <motion.button className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Github size={16} /> View on GitHub
            </motion.button>
          </a>
        </motion.div>
      </section>

      {/* Values */}
      <section style={{ padding: "60px 20px", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800, color: "var(--text-primary)", textAlign: "center", marginBottom: 40, letterSpacing: "-0.5px" }}>
            Core <span className="text-gradient-blue">Principles</span>
          </motion.h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {values.map((v, i) => (
              <motion.div key={v.title} className="glass-card" style={{ padding: "28px" }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${v.color}15`, border: `1px solid ${v.color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: v.color }}>
                  {v.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800, color: "var(--text-primary)", textAlign: "center", marginBottom: 40, letterSpacing: "-0.5px" }}>
            The <span className="text-gradient-blue">Team</span>
          </motion.h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
            {team.map((member, i) => (
              <motion.div key={member.name} className="glass-card" style={{ padding: "28px", textAlign: "center" }}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%", background: `${member.color}20`,
                  border: `2px solid ${member.color}50`, display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px", fontSize: 20, fontWeight: 800, color: member.color,
                }}>
                  {member.avatar}
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{member.name}</h3>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
