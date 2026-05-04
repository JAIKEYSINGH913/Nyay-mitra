"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { 
  Database, 
  Mic, 
  ShieldCheck, 
  Workflow, 
  Search, 
  User, 
  ArrowLeft,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Cpu,
  Layers,
  Activity,
  Mail,
  Phone,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { account } from "@/lib/appwrite";

const HELP_MODULES = [
  {
    title: "Nyay-Graph",
    tag: "KNOWLEDGE_NETWORK",
    icon: <Database className="w-6 h-6 text-white" />,
    description: "Explore the dense web of Indian Law in a high-fidelity 3D environment. It maps relationships between statutes, precedents, and circulars using Neo4j index-free adjacency.",
    usage: "Use the interactive nodes to traverse legal concepts and discover hidden statutory connections.",
    side: "left"
  },
  {
    title: "Nyay-Vani",
    tag: "VOICE_RETRIEVAL",
    icon: <Mic className="w-6 h-6 text-white" />,
    description: "Voice-activated judicial discovery optimized for courtroom efficiency. It uses advanced NLP to transform natural speech into precise legal queries.",
    usage: "Speak your legal query naturally. The system will retrieve relevant BNS/IPC sections instantly.",
    side: "right"
  },
  {
    title: "Nyay-Audit",
    tag: "VERACITY_VERIFIER",
    icon: <ShieldCheck className="w-6 h-6 text-white" />,
    description: "The Groundedness Verification engine. It audits AI-generated legal summaries against official Gazettes to eliminate hallucinations.",
    usage: "Paste or generate legal text. Nyay-Audit cross-references every claim with verified government documents.",
    side: "left"
  },
  {
    title: "Nyay-Bridge",
    tag: "IPC ↔ BNS SYNCHRONIZER",
    icon: <Workflow className="w-6 h-6 text-white" />,
    description: "Deep-link synchronization between legacy IPC sections and modern BNS protocols. It manages the transition logic for the Indian Penal system.",
    usage: "Enter an IPC section number to see its modern BNS equivalent and the specific delta (changes) between them.",
    side: "right"
  },
  {
    title: "Research Hub",
    tag: "SCIENTIFIC_LIBRARY",
    icon: <Search className="w-6 h-6 text-white" />,
    description: "A monolithic interface for legal researchers. Access whitepapers, technical documentation, and AI-assisted deep research tools.",
    usage: "Search for specific legal topics to receive grounded, Neo4j-anchored research summaries.",
    side: "left"
  },
  {
    title: "Sovereign Identity",
    tag: "PROFILE_SECURITY",
    icon: <User className="w-6 h-6 text-white" />,
    description: "Secure identity management using Appwrite. Includes multi-stage verification and automated profile synchronization.",
    usage: "Manage your professional details and security settings (OTP resets, Account termination) in the Profile dashboard.",
    side: "right"
  }
];

export default function HelpPage() {
  const containerRef = useRef(null);
  const [showContact, setShowContact] = useState(false);
  const [userEmail, setUserEmail] = useState("Loading...");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setUserEmail(user.email);
      } catch (e) {
        setUserEmail("Not Logged In");
      }
    };
    fetchUser();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white pt-32 pb-20 px-6 md:px-10 font-space overflow-x-hidden relative selection:bg-red-600 selection:text-white">
      
      {/* 1. HUGE FADED TITLE */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none z-0">
        <h1 className="text-[15vw] font-black tracking-tighter uppercase opacity-[0.05] leading-none whitespace-nowrap select-none">
          HELP CENTER
        </h1>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 pt-64">
        
        {/* HEADER */}
        <div className="mb-24 pt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6 leading-tight">
              Operational <br /> <span className="text-red-600">Guidelines</span>
            </h2>
            <p className="text-white/40 text-lg max-w-2xl font-light leading-relaxed">
              Understand the core mechanics of the Nyay-Mitra ecosystem. Every module is engineered for specific judicial workflows.
            </p>
          </motion.div>
        </div>

        {/* HELP MODULES - SCROLLING SIDE PANELS */}
        <div className="space-y-12 mb-32">
          {HELP_MODULES.map((module, i) => (
            <ScrollingHelpCard key={i} module={module} index={i} />
          ))}
        </div>

        {/* FAQ / SYSTEM STATUS with DROPDOWN CONTACT */}
        <div className="mb-32">
           <div className="p-12 bg-red-600/5 border border-red-600/20 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-xl text-center md:text-left">
                 <h4 className="text-2xl font-black uppercase tracking-tighter mb-4 text-white">Still need assistance?</h4>
                 <p className="text-[13px] text-white/40 font-medium tracking-wide">Our system is constantly learning. If you encounter an edge case in legal logic, please report it to our engineering collective.</p>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowContact(!showContact)}
                  className="px-12 py-6 bg-red-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-700 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(220,38,38,0.3)] flex items-center gap-3"
                >
                  <MessageSquare className="w-5 h-5" /> Contact Collective
                </button>

                <AnimatePresence>
                  {showContact && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full right-0 mb-6 w-80 p-8 bg-[#0a0a0a] border border-red-600/20 rounded-[2rem] shadow-2xl backdrop-blur-3xl z-[50]"
                    >
                       <div className="space-y-6">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600">Proxy Credentials</h5>
                          <div className="space-y-4">
                             <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-600">
                                   <Mail className="w-4 h-4" />
                                </div>
                                <div>
                                   <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Support Channel</p>
                                   <p className="text-[12px] font-black text-white/80 uppercase tracking-tighter truncate w-48">{userEmail}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-600">
                                   <Phone className="w-4 h-4" />
                                </div>
                                <div>
                                   <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Emergency Line</p>
                                   <p className="text-[12px] font-black text-white/80 uppercase tracking-tighter">+91 •••• ••092</p>
                                </div>
                             </div>
                          </div>
                          <div className="pt-4 border-t border-white/5">
                             <p className="text-[9px] text-white/30 font-medium leading-relaxed italic">The collective is active 24/7 for judicial technical inquiries.</p>
                          </div>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
           </div>
        </div>

        {/* SIGNATURE SECTION */}
        <div className="mt-32 pb-20 border-t border-white/5 pt-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-16 relative z-10">
             <div className="font-space text-5xl md:text-[8rem] font-black tracking-tighter leading-none opacity-5 hover:opacity-10 transition-opacity select-none cursor-default">
               NYAY-MITRA
             </div>
             <div className="font-space text-[10px] tracking-widest opacity-30 uppercase font-bold mb-4">
               © 2026 Sovereign_Judicial_Engine
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScrollingHelpCard({ module, index }: { module: any, index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center", "end start"]
  });

  const sideOffset = module.side === "left" ? -400 : 400;
  
  const x = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [sideOffset, 0, 0, sideOffset]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.8, 1, 1, 0.8]);

  const springX = useSpring(x, { stiffness: 100, damping: 20 });
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 20 });

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, opacity: springOpacity, scale }}
      whileHover={{ scale: 1.02, borderColor: "rgba(220, 38, 38, 0.5)" }}
      className="p-10 md:p-14 border border-white/5 bg-white/[0.02] rounded-[3rem] backdrop-blur-3xl flex flex-col md:flex-row gap-10 transition-all group"
    >
      <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(220,38,38,0.3)] group-hover:rotate-12 transition-all">
        {module.icon}
      </div>
      
      <div className="flex-1 space-y-6">
        <div>
          <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] block mb-2">{module.tag}</span>
          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter group-hover:text-red-500 transition-colors">{module.title}</h3>
        </div>
        
        <p className="text-[15px] text-white/40 leading-relaxed font-medium max-w-2xl">
          {module.description}
        </p>
        
        <div className="pt-6 border-t border-white/5 flex items-start gap-4">
          <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 animate-pulse" />
          <p className="text-[12px] text-white/60 font-medium italic leading-relaxed">
            <span className="text-red-500 font-black not-italic uppercase tracking-widest mr-2">Usage:</span>
            {module.usage}
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center">
         <ChevronRight className="w-8 h-8 text-white/5 group-hover:text-red-600 group-hover:translate-x-2 transition-all" />
      </div>
    </motion.div>
  );
}
