"use client";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  ChevronRight, 
  ArrowUpRight, 
  Shield, 
  Activity, 
  Database, 
  Terminal, 
  Layers
} from "lucide-react";
import { account } from "@/lib/appwrite";
import Link from "next/link";

// Dynamic Components
const DynamicBackground = dynamic(() => import("@/components/DynamicBackground"), { ssr: false });
const LegalGraph3D = dynamic(() => import("@/components/LegalGraph3D"), { ssr: false });
const BridgeAnimation = dynamic(() => import("@/components/BridgeAnimation"), { ssr: false });
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
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onSuccess={() => setIsLoggedIn(true)} 
      />

      {/* ─── HERO SECTION ──────────────── */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <DynamicBackground scrollProgress={smoothProgress} />
        
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="cosmos-bg dark:block hidden opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/50 to-bg-primary" />
        </div>

        <div className="relative z-20 text-center max-w-7xl pt-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container/5 border border-primary-container/20 mb-6 rounded-full"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
            <span className="font-space text-[clamp(8px,1vw,10px)] tracking-[0.4em] text-primary-container uppercase font-black">
              System_Status: Operational // Build_4.02
            </span>
          </motion.div>

          <motion.h1
            style={{ 
              scale: useTransform(smoothProgress, [0, 0.1], [1, 0.9]),
              opacity: useTransform(smoothProgress, [0, 0.1], [1, 0])
            }}
            className="font-space text-[clamp(2.5rem,8vw,7rem)] font-black tracking-tighter leading-[0.9] uppercase mb-8 text-text-primary"
          >
            The Sovereign <br />
            <span className="text-primary-container">Cockpit</span> for <br />
            Indian Law
          </motion.h1>

          <motion.p
            style={{ opacity: useTransform(smoothProgress, [0, 0.08], [1, 0]) }}
            className="font-body text-text-secondary text-[clamp(1rem,2vw,1.5rem)] max-w-2xl mx-auto mb-10 leading-relaxed opacity-60"
          >
            Engineered for the IPC-BNS transition. <br />
            A monolithic interface for the modern jurist.
          </motion.p>

          <motion.div
            style={{ opacity: useTransform(smoothProgress, [0, 0.08], [1, 0]) }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="btn-industrial bg-primary-container text-white px-8 py-3 group text-sm md:text-base">
              INITIALIZE_HUB <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="btn-industrial-outline border-primary-container/30 px-8 py-3 hover:bg-primary-container/5 text-sm md:text-base">
              TELEMETRY_DASHBOARD
            </button>
          </motion.div>
        </div>

        {/* ─── THE COCKPIT BOX (3D GRAPH): SMALL TO BIG EFFECT ─── */}
        <motion.div
          style={{ 
            y: useTransform(smoothProgress, [0.05, 0.3], ["120%", "0%"]), // Docking timing
            rotateX: useTransform(smoothProgress, [0.05, 0.3], [15, 0]),
            opacity: useTransform(smoothProgress, [0.05, 0.15, 0.3, 0.4], [0, 1, 1, 0]),
            scale: useTransform(smoothProgress, [0.05, 0.3], [0.6, 1]), // SMALL TO BIG EFFECT
          }}
          className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none px-4"
        >
          <div className="relative w-full max-w-5xl aspect-video border-[1px] border-primary-container/30 bg-bg-primary shadow-[0_60px_120px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden rounded-sm">
             <div className="absolute inset-0 z-0">
               <LegalGraph3D />
             </div>
             {/* HUD Overlays */}
             <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none z-10">
                <div className="font-space text-[clamp(7px,1vw,9px)] text-primary-container font-black uppercase tracking-[0.4em] bg-bg-primary/90 px-2 py-1 border border-primary-container/20">
                  Real-time_Nav_Mesh // [STATUS: ACTIVE]
                </div>
                <div className="font-mono text-[7px] text-text-muted text-right uppercase leading-none opacity-50">
                  GRID_STABILITY: 100%<br />
                  SECTOR: 04_ALPHA
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* ─── BENTO GRID: ARCHITECTURAL MODULES ──────────────── */}
      <section className="py-32 md:py-60 px-6 relative z-10 bg-bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between mb-24 md:mb-32 gap-10">
            <div className="max-w-2xl">
              <span className="font-space text-[clamp(10px,1.2vw,12px)] tracking-[0.5em] text-primary-container font-black uppercase mb-4 block">CORE_ARCHITECTURE</span>
              <h2 className="font-space text-[clamp(2.5rem,6vw,5rem)] font-black uppercase tracking-tighter leading-[0.9] text-text-primary">
                Advanced <br /><span className="text-primary-container">Legal Modules</span>
              </h2>
            </div>
            <p className="font-body text-text-secondary opacity-60 max-w-md text-lg leading-relaxed mt-4">
              Integrated technical solutions designed to streamline complex judicial research and transition workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <BentoCard 
              className="md:col-span-8 min-h-[500px]"
              title="Statutory Delta"
              tag="IPC ↔ BNS"
              desc="Deep-link synchronization between legacy IPC sections and modern BNS protocols. Zero-latency retrieval."
              icon={<Terminal className="w-6 h-6 text-primary-container" />}
            >
              <div className="absolute bottom-4 left-0 w-full h-[50%] overflow-hidden flex items-center justify-center px-4">
                <div className="w-full max-w-2xl scale-110 md:scale-150 origin-bottom">
                  <BridgeAnimation />
                </div>
              </div>
            </BentoCard>

            <BentoCard 
              className="md:col-span-4 min-h-[500px]"
              title="Veracity Audit"
              tag="GROUNDEDNESS"
              desc="Military-grade verification of LLM outputs against official Gazettes and Supreme Court precedents."
              icon={<Shield className="w-6 h-6 text-secondary-container" />}
            />

            <BentoCard 
              className="md:col-span-5 min-h-[400px]"
              title="Vani Engine"
              tag="VOICE_FIRST"
              desc="Voice-activated judicial discovery optimized for courtroom efficiency."
              icon={<Activity className="w-6 h-6 text-primary-container" />}
            />

            <BentoCard 
              className="md:col-span-7 min-h-[400px]"
              title="Knowledge Graph"
              tag="NEURAL_NETWORK"
              desc="Visualize the dense web of Indian Law. Explore connections in high-fidelity 3D environments."
              icon={<Layers className="w-6 h-6 text-secondary-container" />}
            />
          </div>
        </div>
      </section>

      {/* ─── HORIZONTAL SCROLL: OPERATIONS (FIXED CUTOFF) ───── */}
      <HorizontalScrollSection scrollProgress={smoothProgress} />

      {/* ─── METADATA TELEMETRY ──────────────────────────────── */}
      <section className="py-24 md:py-40 border-y border-border-color bg-bg-surface-low/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
          <Stat label="Processing_Latency" value="0.04ms" trend="-12%" />
          <Stat label="Groundedness_Score" value="99.9%" trend="Stable" />
          <Stat label="Neural_Nodes" value="1.2M" trend="+40k" />
          <Stat label="Sovereign_Silos" value="Active" trend="Alpha-7" />
        </div>
      </section>

      {/* ─── CALL TO ACTION ─────────────────────────────────── */}
      <section className="py-40 md:py-72 px-6 text-center relative overflow-hidden bg-bg-primary">
        <div className="absolute inset-0 z-0 opacity-10">
           <DynamicBackground />
        </div>
        <div className="relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-space text-[clamp(3rem,8vw,8rem)] font-black uppercase tracking-tighter mb-12 text-text-primary leading-none"
          >
            Initialize <br /><span className="text-primary-container">Nyay-Mitra</span>
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => !isLoggedIn ? setAuthModalOpen(true) : window.location.href = "/home"}
            className="btn-industrial px-16 py-6 md:px-24 md:py-10 text-xl md:text-2xl bg-primary-container text-white border-none rounded-full"
          >
            {isLoggedIn ? "ENTER_COMMAND_CENTER" : "INITIALIZE_SESSION"}
          </motion.button>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────── */}
      <footer className="py-24 md:py-48 px-10 bg-black text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-primary-container/10 to-transparent opacity-20 pointer-events-none" />
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-20 relative z-10">
            <div className="flex flex-col gap-10 w-full md:w-auto">
               <div className="font-space text-5xl sm:text-7xl md:text-[12rem] font-black tracking-tighter leading-none opacity-5 hover:opacity-10 transition-opacity cursor-default select-none">
                 NYAY-MITRA
               </div>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
               <div className="font-space text-[10px] tracking-widest opacity-30 uppercase font-bold mb-4">© 2026 Sovereign_Judicial_Engine</div>
            </div>
         </div>
      </footer>
    </div>
  );
}

function BentoCard({ title, tag, desc, icon, className, children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative group bg-bg-surface-low border-l-[3px] border-primary-container/40 p-10 md:p-14 overflow-hidden glass-panel hover:border-primary-container transition-all duration-500 rounded-sm ${className}`}
    >
      <div className="relative z-20">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary-container/10 border border-primary-container/20 rounded-sm">
            {icon}
          </div>
          <span className="font-space text-[11px] tracking-[0.4em] font-black text-primary-container uppercase">{tag}</span>
        </div>
        <h3 className="font-space text-[clamp(1.5rem,3vw,3.5rem)] font-black uppercase mb-6 text-text-primary group-hover:text-primary-container transition-all duration-500 leading-[0.9] tracking-tighter">
          {title}
        </h3>
        <p className="font-body text-text-secondary opacity-60 text-lg leading-relaxed max-w-sm group-hover:opacity-100 transition-opacity duration-500">
          {desc}
        </p>
      </div>
      {children}
    </motion.div>
  );
}

function HorizontalScrollSection({ scrollProgress }) {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });
  
  // FIXED: Synchronized transform to prevent early disappearance
  const x = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "-75%"]);

  return (
    <section ref={targetRef} className="relative h-[600vh] bg-bg-primary">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-10 md:gap-20 px-10 md:px-32">
          <ScrollCard 
            img="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200"
            title="Sovereign Control"
            subtitle="IPC_SYNC"
          />
          <ScrollCard 
            img="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1200"
            title="Neural Synthesis"
            subtitle="BNS_CORE"
          />
          <ScrollCard 
            img="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200"
            title="Global Linkage"
            subtitle="NYAY_BRIDGE"
          />
          <ScrollCard 
            img="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200"
            title="Quantum Security"
            subtitle="ALPHA_VAULT"
          />
        </motion.div>
      </div>
      <div className="absolute top-1/2 left-20 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none hidden md:block">
         <div className="font-space text-[20rem] font-black text-text-primary tracking-tighter uppercase leading-none">OPERATIONS</div>
      </div>
    </section>
  );
}

function ScrollCard({ img, title, subtitle }) {
  return (
    <div className="w-[85vw] max-w-[900px] h-[65vh] md:h-[750px] relative shrink-0 overflow-hidden group border border-border-color shadow-[0_40px_80px_rgba(0,0,0,0.4)] glass-panel rounded-sm bg-bg-surface-low">
      <img src={img} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />
      <div className="absolute bottom-10 left-10 md:bottom-16 md:left-16">
        <span className="font-space text-[clamp(10px,1.2vw,14px)] tracking-[0.5em] text-primary-container font-black uppercase mb-4 md:mb-6 block drop-shadow-lg">{subtitle}</span>
        <h3 className="font-space text-[clamp(2.5rem,6vw,6rem)] font-black text-white uppercase tracking-tighter leading-[0.8] drop-shadow-2xl">{title}</h3>
      </div>
    </div>
  );
}

function Stat({ label, value, trend }) {
  return (
    <div className="flex flex-col gap-4 group">
      <span className="font-space text-[clamp(10px,1vw,12px)] tracking-[0.4em] text-text-muted uppercase font-black">{label}</span>
      <div className="flex items-end gap-4">
        <span className="font-space text-[clamp(2rem,5vw,4rem)] font-black text-text-primary group-hover:text-primary-container transition-all duration-500 tracking-tighter leading-none">{value}</span>
        <div className="flex items-center gap-1 text-primary-container opacity-60 mb-1 font-space text-[10px] font-black">
          <ChevronRight className="w-2.5 h-2.5 -rotate-90" />
          {trend}
        </div>
      </div>
      <div className="h-[2px] w-full bg-bg-surface-high overflow-hidden mt-2 rounded-full">
         <motion.div 
           initial={{ width: 0 }}
           whileInView={{ width: "100%" }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           className="h-full bg-primary-container"
         />
      </div>
    </div>
  );
}
