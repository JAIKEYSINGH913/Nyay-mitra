"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  Shield, 
  Target, 
  Globe,
  Zap,
  ChevronDown,
  BookOpen,
  ArrowRight,
  Terminal,
  Activity,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Scale,
  Minus,
  Cpu,
  Layers,
  Database,
  ArrowDown
} from "lucide-react";

// HUMAN MALE FIGURES - ANIME PROFILE SILHOUETTES (BASED ON USER REFERENCE)
const TEAM_MEMBERS = [
  {
    name: "Jaikey Singh",
    role: "Team Leader",
    background: "B.Tech Computer Science & Engineering",
    message: "Leading the architectural synthesis of the Sovereign Judicial Engine.",
    direction: "left",
    // Human male silhouette path
    silhouette: "M50,15 C45,15 42,20 40,30 C38,40 42,50 45,60 C40,70 35,80 32,100 C30,120 28,150 25,190 L35,200 L65,200 L75,190 C72,150 70,120 68,100 C65,80 60,70 55,60 C58,50 62,40 60,30 C58,20 55,15 50,15"
  },
  {
    name: "Gaurav Singh",
    role: "Infrastructure Engineer",
    background: "B.Tech Computer Science & Engineering",
    message: "Optimizing the high-performance kernel for real-time legal discovery.",
    direction: "right",
    silhouette: "M50,10 C45,10 40,15 38,25 C35,40 40,55 45,65 C35,85 30,120 28,195 L50,205 L72,195 C70,120 65,85 55,65 C60,55 65,40 62,25 C60,15 55,10 50,10"
  },
  {
    name: "Amit Yadav",
    role: "Neural Logic Developer",
    background: "B.Tech Computer Science & Engineering",
    message: "Eliminating judicial hallucinations through strict semantic grounding.",
    direction: "left",
    silhouette: "M50,5 C40,5 35,15 32,30 C30,50 40,70 45,80 C35,110 30,150 28,200 L72,200 C70,150 65,110 55,80 C60,70 70,50 68,30 C65,15 60,5 50,5"
  },
  {
    name: "Harshit Verma",
    role: "Linguistic Strategist",
    background: "B.Tech Computer Science & Engineering",
    message: "Bridging the gap between legalese and regional Indian dialects.",
    direction: "right",
    silhouette: "M50,20 C42,20 38,30 35,45 C32,60 38,80 42,95 C35,120 30,160 28,200 L72,200 C70,160 65,120 58,95 C62,80 68,60 65,45 C62,30 58,20 50,20"
  }
];

export default function AboutSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="pt-[500px] pb-64 px-6 relative overflow-hidden bg-bg-primary">
      {/* 1. BACKGROUND BRANDING */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-full pointer-events-none select-none z-0">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.04 }}
          className="font-space text-[clamp(4rem,18vw,22rem)] font-black text-text-primary uppercase tracking-tighter leading-none text-center whitespace-nowrap"
        >
          ABOUT US
        </motion.h2>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* 2. THE GAP SECTION */}
        <div className="pt-20 mb-80">
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="relative p-1 bg-gradient-to-r from-red-500/10 to-transparent"
           >
              <div className="p-12 md:p-24 bg-bg-primary border border-white/5 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                   <div className="lg:col-span-5 space-y-8">
                      <div className="flex items-center gap-3">
                         <AlertCircle className="text-red-500 w-5 h-5" />
                         <span className="text-[10px] tracking-[0.5em] text-red-500 font-black uppercase">PHASE_01: Status_Quo</span>
                      </div>
                      <h2 className="text-6xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                        Existing <br /><span className="text-red-500">Gaps</span>
                      </h2>
                      <p className="text-lg text-text-secondary opacity-60 leading-relaxed font-body">
                        The transition from colonial-era codes to modern statutes has created a vacuum in legal interpretation. This gap prevents citizens from understanding their rights in the current legislative climate.
                      </p>
                   </div>

                   <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                      <AcademicGapItem 
                        title="Legislative Drift" 
                        desc="Precedents lack clear mapping to new statutes, creating a 'grey zone' in legal research and judicial logic."
                      />
                      <AcademicGapItem 
                        title="Topological Latency" 
                        desc="Manual cross-referencing across vast statutory networks leads to days of research time for a single case."
                      />
                      <AcademicGapItem 
                        title="Linguistic Isolation" 
                        desc="Legal documentation remains inaccessible to non-English speakers, isolating the majority of the population."
                      />
                      <AcademicGapItem 
                        title="Verification Crisis" 
                        desc="Generic AI models provide unverified citations, leading to fatal hallucinations in critical legal workflows."
                      />
                   </div>
                </div>
              </div>
           </motion.div>
        </div>

        {/* TRANSITION (FIXED OVERLAP & INCREASED SPACING) */}
        <div className="py-40 flex flex-col items-center gap-4 relative z-20">
           <div className="h-32 w-[1px] bg-gradient-to-b from-white/10 to-primary-container" />
           <motion.div 
             animate={{ y: [0, 15, 0] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="w-16 h-16 rounded-full border border-primary-container/20 flex items-center justify-center bg-bg-primary shadow-[0_0_30px_rgba(0,243,255,0.1)]"
           >
              <ArrowDown className="text-primary-container w-6 h-6" />
           </motion.div>
           <div className="h-32 w-[1px] bg-gradient-to-t from-white/10 to-primary-container" />
        </div>

        {/* 3. THE SOLUTION SECTION */}
        <div className="mt-40 mb-96">
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="relative p-1 bg-gradient-to-l from-primary-container/10 to-transparent"
           >
              <div className="p-12 md:p-24 bg-bg-primary border border-white/5 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                   <div className="lg:col-span-5 space-y-8">
                      <div className="flex items-center gap-3">
                         <Cpu className="text-primary-container w-5 h-5" />
                         <span className="text-[10px] tracking-[0.5em] text-primary-container font-black uppercase">PHASE_02: Architecture</span>
                      </div>
                      <h2 className="text-6xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                        The <span className="text-primary-container">Nyay</span> <br />Engine
                      </h2>
                      <p className="text-lg text-text-secondary opacity-60 leading-relaxed font-body">
                        We have synthesized a sovereign intelligence layer that maps statutory transitions through a verified multi-dimensional network.
                      </p>
                   </div>

                   <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                      <AcademicSolutionItem 
                        title="Graph-Based Synthesis" 
                        desc="Using index-free adjacency to map statutory links with high veracity and zero concept drift."
                      />
                      <AcademicSolutionItem 
                        title="Sub-Millisecond Retrieval" 
                        desc="Advanced topological traversal reduces research time to mere milliseconds, ensuring judicial velocity."
                      />
                      <AcademicSolutionItem 
                        title="Regional Implementation" 
                        desc="Voice-first neural mapping that bridges legalese into 14+ Indian mother tongues seamlessly."
                      />
                      <AcademicSolutionItem 
                        title="Sovereign Clusters" 
                        desc="Air-gapped local clusters preserve data integrity within the border, ensuring absolute privacy."
                      />
                   </div>
                </div>
              </div>
           </motion.div>
        </div>

        {/* 4. THE ARCHITECTS */}
        <div className="relative pt-64">
          <div className="text-center mb-64 overflow-hidden">
             <motion.h2 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               className="font-space text-[clamp(3.5rem,10vw,10rem)] font-black uppercase tracking-tighter text-white leading-none"
             >
               The <span className="text-primary-container">Architects</span>
             </motion.h2>
             <p className="font-space text-[10px] tracking-[0.8em] text-white/20 mt-6 uppercase">Final_Year_Thesis_Research_Group</p>
          </div>

          <div className="space-y-48 relative">
             {TEAM_MEMBERS.map((member, idx) => (
               <MemberRow key={idx} member={member} index={idx} />
             ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AcademicGapItem({ title, desc }) {
  return (
    <div className="space-y-4 border-l border-red-500/10 pl-6 group">
       <h4 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-red-500 transition-colors">{title}</h4>
       <p className="text-sm text-text-secondary opacity-50 leading-relaxed font-body italic group-hover:opacity-80 transition-opacity">"{desc}"</p>
    </div>
  );
}

function AcademicSolutionItem({ title, desc }) {
  return (
    <div className="space-y-4 border-l border-primary-container/10 pl-6 group">
       <h4 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-primary-container transition-colors">{title}</h4>
       <p className="text-sm text-text-secondary opacity-50 leading-relaxed font-body group-hover:opacity-100 transition-opacity">{desc}</p>
    </div>
  );
}

function MemberRow({ member, index }) {
  const isLeft = member.direction === "left";
  
  return (
    <div className={`flex flex-col md:flex-row items-center justify-between relative py-24 ${isLeft ? "" : "md:flex-row-reverse"}`}>
      
      {/* HUMAN MALE SILHOUETTE (NO BOXES, CONTOURED BORDER) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full md:w-[40%] flex justify-center z-10"
      >
        <div className="relative group cursor-none">
           <div className="relative h-[500px] w-[300px] flex items-center justify-center">
              
              <div className="absolute inset-0 bg-primary-container/5 blur-[120px] rounded-full scale-150 group-hover:bg-primary-container/15 transition-all duration-1000" />
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative w-full h-full flex items-center justify-center transition-all duration-700"
              >
                 {/* HUMAN MALE SILHOUETTE */}
                 <svg viewBox="0 0 100 200" className="w-full h-full text-black drop-shadow-[0_0_2px_rgba(0,243,255,0.6)] drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] transition-all">
                    <path fill="currentColor" d={member.silhouette} />
                 </svg>

                 {/* Neural Overlay */}
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                    <div className="w-40 h-40 border-[0.5px] border-primary-container/30 rounded-full animate-ping" />
                 </div>
              </motion.div>
           </div>

           <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
             <div className="w-[1px] h-10 bg-primary-container/40" />
             <span className="font-space text-[10px] font-black text-primary-container tracking-[0.5em] uppercase">THESIS_NODE_0{index + 1}</span>
          </div>
        </div>
      </motion.div>

      {/* CARD */}
      <motion.div 
        initial={{ opacity: 0, x: isLeft ? 100 : -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="w-full md:w-[48%] z-10"
      >
        <div className="p-12 bg-white/[0.01] border border-white/5 hover:border-primary-container/40 transition-all group backdrop-blur-3xl">
          <div className="space-y-10">
            <div>
              <h3 className="text-5xl font-black uppercase tracking-tighter text-white mb-2 leading-none">{member.name}</h3>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-[1px] bg-primary-container" />
                 <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-container">{member.role}</span>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="p-4 bg-black/20 border border-white/5">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-2">Academic Core:</span>
                <p className="text-sm text-text-secondary leading-relaxed font-medium italic">{member.background}</p>
              </div>
              <div className="relative">
                <div className="absolute -left-6 top-0 bottom-0 w-[1px] bg-primary-container/10 group-hover:bg-primary-container/50 transition-colors" />
                <span className="text-[9px] font-black uppercase tracking-widest text-primary-container block mb-3">Thesis Message:</span>
                <p className="text-lg text-white/80 leading-relaxed font-body italic">
                  "{member.message}"
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex justify-between items-center opacity-20 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] font-black tracking-[0.4em] uppercase">RESEARCH_PORTFOLIO</span>
               <Activity className="w-4 h-4 text-primary-container" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
