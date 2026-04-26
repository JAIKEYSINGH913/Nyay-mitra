"use client";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  ChevronRight, 
  Shield, 
  Activity, 
  Terminal, 
  Layers,
  ChevronLeft
} from "lucide-react";
import { account } from "@/lib/appwrite";

// Dynamic Components
const DynamicBackground = dynamic(() => import("@/components/DynamicBackground"), { ssr: false });
const LegalGraph3D = dynamic(() => import("@/components/LegalGraph3D"), { ssr: false });
const AuthModal = dynamic(() => import("@/components/AuthModal"), { ssr: false });

export default function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await account.get();
        setIsLoggedIn(!!user);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-bg-primary transition-colors overflow-x-hidden min-h-screen">
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} onSuccess={() => setIsLoggedIn(true)} />

      {/* HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <DynamicBackground scrollProgress={smoothProgress} />
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/50 to-bg-primary" />
        </div>

        <div className="relative z-20 text-center max-w-7xl pt-10 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container/5 border border-primary-container/20 mb-6 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
            <span className="font-space text-[10px] tracking-[0.4em] text-primary-container uppercase font-black">System_Status: Operational // Build_4.02</span>
          </motion.div>
          <motion.h1 style={{ scale: useTransform(smoothProgress, [0, 0.1], [1, 0.9]), opacity: useTransform(smoothProgress, [0, 0.1], [1, 0]) }} className="font-space text-[clamp(2.5rem,8vw,7rem)] font-black tracking-tighter leading-[0.9] uppercase mb-8 text-text-primary">
            The Sovereign <br /> <span className="text-primary-container">Cockpit</span> for <br /> Indian Law
          </motion.h1>
          <motion.p style={{ opacity: useTransform(smoothProgress, [0, 0.08], [1, 0]) }} className="font-body text-text-secondary text-[clamp(1rem,2vw,1.5rem)] max-w-2xl mx-auto mb-10 leading-relaxed opacity-60">
            Engineered for the IPC-BNS transition. <br /> A monolithic interface for the modern jurist.
          </motion.p>
          <motion.div style={{ opacity: useTransform(smoothProgress, [0, 0.08], [1, 0]) }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-industrial bg-primary-container text-white px-8 py-3 group text-sm md:text-base">INITIALIZE_HUB <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></button>
            <button className="btn-industrial-outline border-primary-container/30 px-8 py-3 hover:bg-primary-container/5 text-sm md:text-base">TELEMETRY_DASHBOARD</button>
          </motion.div>
        </div>
      </section>

      {/* BENTO GRID */}
      <section className="pb-16 px-6 relative z-10 bg-bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="py-12 text-center overflow-hidden">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 0.05, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.5 }} className="font-space text-[clamp(2.5rem,11vw,15rem)] font-black text-text-primary uppercase tracking-tighter leading-[0.8] select-none px-4">Advanced <br /> Legal Modules</motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <BentoCard className="md:col-span-8 min-h-[400px]" title="Statutory Delta" tag="IPC ↔ BNS" desc="Deep-link synchronization between legacy IPC sections and modern BNS protocols." icon={<Terminal className="w-6 h-6 text-primary-container" />} delay={0} />
            <BentoCard className="md:col-span-4 min-h-[400px]" title="Veracity Audit" tag="GROUNDEDNESS" desc="Military-grade verification of LLM outputs against official Gazettes." icon={<Shield className="w-6 h-6 text-secondary-container" />} delay={0.1} />
            <BentoCard className="md:col-span-5 min-h-[350px]" title="Vani Engine" tag="VOICE_FIRST" desc="Voice-activated judicial discovery optimized for courtroom efficiency." icon={<Activity className="w-6 h-6 text-primary-container" />} delay={0.2} />
            <BentoCard className="md:col-span-7 min-h-[350px]" title="Knowledge Graph" tag="NEURAL_NETWORK" desc="Visualize the dense web of Indian Law in high-fidelity 3D environments." icon={<Layers className="w-6 h-6 text-secondary-container" />} delay={0.3} />
          </div>
        </div>
      </section>

      {/* 3D GRAPH SECTION - FIXED VISIBILITY & GROUNDING */}
      <section className="bg-black py-20 overflow-hidden min-h-[800px] flex items-center justify-center">
        <div className="max-w-7xl w-full px-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} className="relative w-full aspect-[16/10] border border-white/10 bg-black shadow-[0_0_100px_rgba(255,255,255,0.05)] overflow-hidden rounded-none">
             <div className="absolute inset-0 z-0"><LegalGraph3D /></div>
          </motion.div>
        </div>
      </section>

      <OperationsSection />
      <TelemetrySection />

      {/* CTA SECTION */}
      <section className="py-24 md:py-32 px-6 text-center relative overflow-hidden bg-bg-primary">
        <div className="absolute inset-0 z-0 opacity-10"><DynamicBackground /></div>
        <div className="relative z-10">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="font-space text-[clamp(2.5rem,7vw,7rem)] font-black uppercase tracking-tighter mb-10 text-text-primary leading-none">Initialize <br /><span className="text-primary-container">Nyay-Mitra</span></motion.h2>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => !isLoggedIn ? setAuthModalOpen(true) : window.location.href = "/home"} className="btn-industrial px-14 py-5 md:px-20 md:py-8 text-lg md:text-xl bg-primary-container text-white border-none rounded-full">
            {isLoggedIn ? "ENTER_COMMAND_CENTER" : "INITIALIZE_SESSION"}
          </motion.button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 md:py-20 px-10 bg-black text-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-16 relative z-10">
            <div className="font-space text-5xl md:text-[10rem] font-black tracking-tighter leading-none opacity-5 hover:opacity-10 transition-opacity select-none">NYAY-MITRA</div>
            <div className="font-space text-[10px] tracking-widest opacity-30 uppercase font-bold mb-4">© 2026 Sovereign_Judicial_Engine</div>
         </div>
      </footer>
    </div>
  );
}

function BentoCard({ title, tag, desc, icon, className, delay, children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [15, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0.5, 1], [0, 0.3]);

  return (
    <motion.div ref={ref} style={{ y, scale, rotateX, opacity, perspective: "1000px" }} className={`relative group bg-bg-surface-low p-8 md:p-12 overflow-hidden glass-panel hover:bg-bg-surface-high/80 transition-all duration-700 rounded-none shadow-xl border-l-[4px] border-primary-container/20 hover:border-primary-container ${className}`}>
      <motion.div style={{ opacity: glowOpacity }} className="absolute inset-0 bg-gradient-to-br from-primary-container/10 to-transparent pointer-events-none" />
      <div className="relative z-20 text-left">
        <div className="flex items-center gap-4 mb-6">
          <motion.div whileHover={{ rotate: 90 }} className="p-2.5 bg-primary-container/10 border border-primary-container/20 rounded-sm">{icon}</motion.div>
          <span className="font-space text-[10px] tracking-[0.4em] font-black text-primary-container uppercase">{tag}</span>
        </div>
        <h3 className="font-space text-2xl md:text-4xl font-black uppercase mb-4 text-text-primary group-hover:text-primary-container transition-all duration-500 tracking-tighter">{title}</h3>
        <p className="font-body text-text-secondary opacity-60 text-base leading-relaxed max-w-sm group-hover:opacity-100 transition-opacity duration-500">{desc}</p>
      </div>
      {children}
    </motion.div>
  );
}

function OperationsSection() {
  const sectionRef = useRef(null);
  const [manualOffset, setManualOffset] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const scrollX = useTransform(scrollYProgress, [0, 1], [300, -600]);
  const springX = useSpring(scrollX, { stiffness: 100, damping: 30 });
  return (
    <section ref={sectionRef} className="py-20 md:py-24 bg-bg-primary relative overflow-hidden">
      <div className="mb-16 text-center relative z-10">
        <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 0.05, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="font-space text-[clamp(2.5rem,10vw,14rem)] font-black text-text-primary uppercase tracking-tighter leading-none select-none px-4">OPERATIONS</motion.h2>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-4 z-30">
          <button onClick={() => setManualOffset(prev => prev + 300)} className="p-3 bg-bg-surface-high border border-primary-container/30 rounded-full hover:bg-primary-container hover:text-white transition-all shadow-lg"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={() => setManualOffset(prev => prev - 300)} className="p-3 bg-bg-surface-high border border-primary-container/30 rounded-full hover:bg-primary-container hover:text-white transition-all shadow-lg"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="relative">
        <motion.div style={{ x: springX, marginLeft: manualOffset }} className="flex gap-4 md:gap-8 px-[5vw] transition-all duration-700 ease-out">
          <OperationCard img="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200" title="Sovereign Control" subtitle="IPC_SYNC" />
          <OperationCard img="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1200" title="Neural Synthesis" subtitle="BNS_CORE" />
          <OperationCard img="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200" title="Global Linkage" subtitle="NYAY_BRIDGE" />
          <OperationCard img="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200" title="Quantum Security" subtitle="ALPHA_VAULT" />
        </motion.div>
      </div>
    </section>
  );
}

function OperationCard({ img, title, subtitle }) {
  return (
    <motion.div className="relative shrink-0 w-[85vw] md:w-[40vw] aspect-[16/9] overflow-hidden group border border-border-color/10 shadow-xl rounded-none">
      <motion.img src={img} whileHover={{ scale: 1.05 }} transition={{ duration: 1 }} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-left">
        <span className="font-space text-[10px] md:text-xs tracking-[0.4em] text-primary-container font-black uppercase mb-2 block drop-shadow-lg">{subtitle}</span>
        <h3 className="font-space text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-2xl">{title}</h3>
      </div>
    </motion.div>
  );
}

function TelemetrySection() {
  const sectionRef = useRef(null);
  const [activeStat, setActiveStat] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const stats = [
    { label: "Processing_Latency", value: "0.04ms", trend: "-12%", reason: "Neural cache predicting query patterns.", proof: "40% faster than legacy lookups." },
    { label: "Groundedness_Score", value: "99.9%", trend: "Stable", reason: "Real-time Gazetted cross-referencing.", proof: "Verified vs 45k+ precedents." },
    { label: "Neural_Nodes", value: "1.2M", trend: "+40k", reason: "Automated ingestion of circulars.", proof: "Mapping Indian Penal transitions." },
    { label: "Sovereign_Silos", value: "Active", trend: "Alpha-7", reason: "Air-gapped judicial research.", proof: "Local-AI data sovereignty." },
  ];
  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-bg-primary relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <motion.h2 whileInView={{ opacity: 0.05, y: 0 }} initial={{ opacity: 0, y: 10 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="font-space text-[clamp(2.5rem,10vw,16rem)] font-black text-text-primary uppercase tracking-tighter leading-none select-none">Sovereign <br /> Telemetry</motion.h2>
        </div>
        <div className="flex flex-col gap-8 md:gap-16">
          {stats.map((stat, i) => (
            <div key={i} className={`flex w-full ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
              <SinusoidalStatCard index={i} progress={scrollYProgress} isActive={activeStat === i} onHover={() => setActiveStat(i)} onLeave={() => setActiveStat(null)} {...stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SinusoidalStatCard({ label, value, trend, reason, proof, progress, index, isActive, onHover, onLeave }) {
  const x = useTransform(progress, [0, 0.5, 1], [index % 2 === 0 ? "15%" : "-15%", "0%", index % 2 === 0 ? "-15%" : "15%"]);
  const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);
  return (
    <motion.div style={{ x, opacity }} onMouseEnter={onHover} onMouseLeave={onLeave} className="w-full max-w-2xl mx-auto relative z-10">
      <div className={`relative group flex flex-col gap-4 p-8 md:p-12 bg-bg-surface-low/30 backdrop-blur-3xl transition-all duration-500 cursor-help rounded-none shadow-lg ${isActive ? "border-primary-container bg-bg-surface-high/60 -translate-y-1" : "hover:border-primary-container/30"}`}>
        <div className="flex flex-col gap-2">
          <span className="font-space text-[10px] tracking-[0.4em] text-text-muted uppercase font-black group-hover:text-primary-container transition-colors">{label}</span>
          <div className="flex items-end justify-between">
            <span className="font-space text-4xl md:text-6xl font-black text-text-primary tracking-tighter leading-none">{value}</span>
            <span className="font-space text-[10px] font-black text-primary-container uppercase tracking-widest">{trend}</span>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {isActive && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4 }} className="overflow-hidden">
              <div className="pt-6 mt-4 border-t border-border-color/10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><span className="text-[9px] font-black text-primary-container uppercase tracking-[0.2em] block mb-1">REASONING:</span><p className="text-[12px] text-text-secondary leading-relaxed font-medium">{reason}</p></div>
                <div><span className="text-[9px] font-black text-secondary-container uppercase tracking-[0.2em] block mb-1">PROOF:</span><p className="text-[12px] text-text-secondary leading-relaxed italic">{proof}</p></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
