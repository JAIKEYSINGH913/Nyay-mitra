"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { 
  Shield, 
  Workflow, 
  Database,
  Activity,
  FileText,
  Bolt,
  HeartPulse,
  ChevronRight,
  ArrowUpRight,
  Terminal,
  Layers,
  ArrowRight
} from "lucide-react";

// Dynamic imports for heavy animations
const DynamicBackground = dynamic(() => import("@/components/DynamicBackground"), { ssr: false });
const BridgeAnimation = dynamic(() => import("@/components/BridgeAnimation"), { ssr: false });
const LegalGraph3D = dynamic(() => import("@/components/LegalGraph3D"), { ssr: false });

export default function HomePage() {
  return (
    <div className="relative pt-20">
      {/* ─── SYSTEM OVERLAY ───────────────────────────── */}
      <div className="scan-line" />
      <DynamicBackground />
      
      {/* ─── HERO SECTION ─────────────────────────────── */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-20">
        <div className="absolute inset-0 node-network pointer-events-none z-0" />
        
        {/* INTERACTIVE BACKGROUND LAYER (Handled by DynamicBackground) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-primary"></div>
        </div>

        <div className="relative z-20 text-center max-w-5xl mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 bg-bg-secondary border-b-2 border-primary-container mb-8 group"
          >
            <span className="font-space text-[0.6875rem] tracking-[0.3em] text-secondary-container uppercase font-bold">
              Protocol Alpha-7 // Sovereign_Cockpit_v.4.02
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-space text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] uppercase mb-10 text-text-primary"
          >
            The Sovereign <br />
            <span className="text-primary-container relative">
               Cockpit
               <div className="absolute inset-0 bg-white/5 -z-10 blur-3xl scale-110 opacity-10 group-hover:opacity-20 transition-opacity" />
            </span> for <br />
            Indian Law
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-body text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed opacity-80"
          >
            High-velocity legal intelligence engineered for the IPC-BNS transition. 
            A monolithic interface for the modern jurist.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col md:flex-row gap-6 justify-center relative z-30"
          >
            <button className="btn-industrial bg-primary-container text-white px-12 group relative overflow-hidden">
               <span className="relative z-10 flex items-center gap-2">
                  INITIALIZE_HUB <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </span>
               <motion.div 
                 initial={{ x: "-100%" }}
                 whileHover={{ x: "100%" }}
                 transition={{ duration: 0.5 }}
                 className="absolute inset-0 bg-white/20 skew-x-12" 
               />
            </button>
            <button className="btn-industrial-outline border-border-color px-12 hover:bg-white/5 transition-colors">
              VIEW_TELEMETRY
            </button>
          </motion.div>
        </div>

        {/* Dashboard Preview Float (Lower Hero Area) */}
        <motion.div 
           initial={{ opacity: 0, y: 100 }}
           animate={{ opacity: 1, y: 0 }}
           whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
           transition={{ 
             layout: { duration: 0.3 },
             opacity: { delay: 0.8, duration: 1.2 },
             y: { delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }
           }}
           className="relative z-20 w-full max-w-6xl aspect-video bg-bg-surface-lowest border border-border-color p-2 shadow-2xl overflow-hidden group cursor-pointer"
           style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
        >
          <div className="w-full h-full bg-bg-surface-high relative overflow-hidden">
             <LegalGraph3D />
             <div className="absolute inset-0 bg-gradient-to-t from-bg-surface-lowest via-transparent to-transparent opacity-80 pointer-events-none"></div>
             
             {/* Scanline Effect Overlay */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 pointer-events-none"></div>

             {/* Integrated Telemetry Details */}
             <div className="absolute bottom-10 left-10 flex gap-6 z-20">
                <div className="h-16 w-40 bg-bg-surface-lowest/80 border-l-4 border-primary-container flex flex-col justify-center px-4 backdrop-blur-md border border-white/5">
                   <span className="telemetry-label !text-primary-container uppercase !text-[9px]">SYSTEM_LATENCY</span>
                   <span className="system-value text-xl font-bold">14.002 MS</span>
                </div>
                <div className="h-16 w-40 bg-bg-surface-lowest/80 border-l-4 border-secondary-container flex flex-col justify-center px-4 backdrop-blur-md border border-white/5">
                   <span className="telemetry-label !text-secondary-container uppercase !text-[9px]">NEURAL_NODES</span>
                   <span className="system-value text-xl font-bold">4.2M_INDEXED</span>
                </div>
             </div>
             
             <motion.div 
                animate={{ y: ["0%", "100%", "0%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-[1px] bg-white opacity-20 pointer-events-none z-30" 
             />
          </div>
        </motion.div>
      </section>

      {/* ─── RESEARCH HUB BENTO GRID ───────────────────────────────────── */}
      <section className="py-32 px-6 bg-bg-primary border-t border-border-color transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <motion.div 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="max-w-xl"
            >
              <h2 className="font-space text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-6 text-text-primary">Research Hub</h2>
              <div className="h-1 w-24 bg-primary-container mb-8"></div>
              <p className="text-text-secondary opacity-70 text-lg leading-relaxed font-body font-normal">
                Navigating the tectonic shift from the Indian Penal Code (IPC) to the Bharatiya Nyaya Sanhita (BNS). Access real-time transition protocols and authority mapping.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
               whileHover={{ translateY: -5 }}
               className="md:col-span-2 bg-bg-surface-low p-10 flex flex-col justify-between group hover:bg-bg-surface-high transition-all relative overflow-hidden rounded-2xl glass-panel border-l-2 border-primary-container"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {/* Glowing Border Effect */}
              <div className="absolute inset-0 border border-primary-container/0 group-hover:border-primary-container/30 transition-all rounded-2xl pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10">
                   <FileText className="w-5 h-5 text-primary-container" />
                   <span className="telemetry-label !text-text-primary !font-bold uppercase">Transition Protocol</span>
                </div>
                <h3 className="font-space text-4xl md:text-5xl font-bold uppercase mb-6 leading-tight text-text-primary">
                   IPC-BNS Transition: <br />Architectural Delta Analysis
                </h3>
                <p className="text-text-secondary opacity-60 mb-16 max-w-lg text-lg leading-relaxed font-body">
                   Detailed mapping of section migration, clause evolution, and semantic shifts in criminal jurisprudence.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-12 items-center border-t border-border-color pt-10 mt-auto relative z-10 dark:border-white/5">
                <div>
                   <div className="telemetry-label !text-[10px] opacity-40 uppercase mb-2">Node_Stability</div>
                   <div className="font-space text-3xl font-bold text-secondary-container">99.98%</div>
                </div>
                <div className="ml-auto">
                   <button className="flex items-center gap-3 bg-bg-surface-low border-b-2 border-primary-container py-4 px-8 font-space text-[11px] font-bold uppercase hover:bg-primary-container hover:text-white transition-all shadow-xl">
                      OPEN_RESEARCH_MODULE <ArrowUpRight className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col gap-6">
              <div className="bg-bg-surface-low p-8 flex flex-col justify-between h-[300px] border-l-2 border-primary-container group hover:bg-bg-surface-high transition-all cursor-pointer rounded-2xl glass-panel">
                <div>
                  <div className="telemetry-label !text-primary-container uppercase !font-bold mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary-container animate-pulse" />
                    Active Data Stream
                  </div>
                  <h4 className="font-space text-2xl font-bold uppercase mb-4 text-text-primary">Authority Engines</h4>
                  <p className="text-sm text-text-secondary opacity-70 font-body">Synthesized cross-referencing across 75+ years of Supreme Court precedent.</p>
                </div>
                <Bolt className="w-5 h-5 text-primary-container self-end" />
              </div>

              <div className="bg-bg-surface-low p-8 flex flex-col justify-between h-[300px] border-l-2 border-secondary-container group hover:bg-bg-surface-high transition-all cursor-pointer rounded-2xl glass-panel">
                <div>
                  <div className="telemetry-label !text-secondary-container uppercase !font-bold mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary-container" />
                    UX Environment
                  </div>
                  <h4 className="font-space text-2xl font-bold uppercase mb-4 text-text-primary">Trauma-Sensitive</h4>
                  <p className="text-sm text-text-secondary opacity-70 font-body">Interface calibrated for low cognitive load during high-stakes litigation.</p>
                </div>
                <HeartPulse className="w-5 h-5 text-secondary-container self-end" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TECHNICAL METADATA GRID ───────────────────────────────────── */}
      <section className="py-24 px-6 bg-bg-secondary transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-20 text-center md:text-left">
          {[
            { label: "System Latency", value: "14.002 MS", color: "bg-primary-container", width: "15%" },
            { label: "Neural Synapse", value: "8.42 T/FLOPS", color: "bg-secondary-container", width: "82%" },
            { label: "Legal Coverage", value: "PAN-INDIA", color: "bg-primary-container", width: "100%" },
            { label: "Auth Level", value: "SOVEREIGN", color: "bg-secondary-container", width: "100%" }
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-4 group">
              <span className="telemetry-label !text-[10px] opacity-40 uppercase tracking-[.3em] font-bold">{stat.label}</span>
              <div className="h-[2px] w-full bg-bg-surface-low overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   whileInView={{ width: stat.width }}
                   viewport={{ once: true }}
                   transition={{ duration: 1.5, ease: "easeInOut" }}
                   className={`h-full ${stat.color}`} 
                />
              </div>
              <span className="font-space text-2xl lg:text-3xl font-bold tracking-tight uppercase group-hover:text-primary-container transition-colors text-text-primary">{stat.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PROTOCOL DEPLOYMENT (Bridge Animation) ────────────────────── */}
      <section className="py-32 px-6 bg-bg-secondary">
         <div className="max-w-5xl mx-auto text-center mb-20 font-space">
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-6">Protocol Deployment</h2>
            <p className="text-on-surface-variant opacity-60 text-lg font-body">Real-time visualization of the statutory delta transfer.</p>
         </div>
         <div className="max-w-5xl mx-auto border border-border-color bg-bg-surface p-1 shadow-2xl relative font-space">
            <div className="bg-[#1c1b1b] p-12 overflow-hidden relative">
               <BridgeAnimation />
            </div>
         </div>
      </section>

      {/* ─── DESIGN DNA SECTION ────────────────────────────────────────── */}
      <section className="py-40 px-6 overflow-hidden bg-bg-primary border-t border-border-color transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-24 items-center">
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-primary-container z-20" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-secondary-container z-20" />
            <div className="relative group overflow-hidden border border-border-color bg-bg-surface-low rounded-2xl glass-panel">
              <img 
                 className="w-full transition-all duration-1000 scale-100 hover:scale-105" 
                 src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1000" 
                 alt="Legal Integrity"
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <h2 className="font-space text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-12 leading-[0.85] text-text-primary">Legal <br/><span className="text-primary-container">Engineering</span> DNA</h2>
            <div className="space-y-12">
              {[
                { id: "01", title: "Authority Engines", icon: <Shield className="w-5 h-5 text-primary-container" />, desc: "Proprietary LLM layers trained on Supreme Court datasets ensure zero hallucination." },
                { id: "02", title: "Monolithic Architecture", icon: <Activity className="w-5 h-5 text-secondary-container" />, desc: "Every pixel is calculated for speed of thought and precision of action." },
                { id: "03", title: "Cryptographic Integrity", icon: <Database className="w-5 h-5 text-primary-container" />, desc: "End-to-end encrypted research vaults protected by military-grade protocols." }
              ].map((item) => (
                <div key={item.id} className="flex gap-8 group">
                  <span className="font-space text-3xl font-black text-text-muted group-hover:text-primary-container transition-all">{item.id}</span>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                       {item.icon}
                       <h4 className="font-space text-2xl font-bold uppercase tracking-tight group-hover:text-primary-container transition-all text-text-primary">{item.title}</h4>
                    </div>
                    <p className="text-text-secondary opacity-70 text-base leading-relaxed pl-6 border-l border-border-color group-hover:border-primary-container transition-all">
                       {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-16">
              <button className="btn-industrial-outline px-12 py-5 text-sm font-bold uppercase tracking-widest flex items-center gap-3 group border-border-color hover:border-primary-container text-text-primary">
                EXPLORE_PROTOCOLS <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ───────────────────────────────────────────────── */}
      <section className="py-40 px-6 bg-primary-container text-on-primary-container relative overflow-hidden text-center border-t-8 border-bg-surface">
        <div className="absolute inset-0 bg-black opacity-10" />
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center">
          <h2 className="font-space text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-10 leading-tight">
            Deploy the <br />Sovereign Cockpit Today
          </h2>
          <p className="font-body text-2xl mb-16 opacity-90 max-w-2xl mx-auto">
            Secure your instance of NYAYMITRA_OS and dominate the transition.
          </p>
          <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             className="bg-white text-primary-container font-space font-bold py-6 px-16 tracking-[0.3em] uppercase text-2xl shadow-outer transition-all"
          >
            INITIALIZE_HUB
          </motion.button>
        </div>
      </section>
    </div>
  );
}
