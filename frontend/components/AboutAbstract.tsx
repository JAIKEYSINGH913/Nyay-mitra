"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  AlertCircle, 
  Cpu, 
  ArrowRight,
  Shield,
  Target,
  Globe
} from "lucide-react";

export default function AboutAbstract() {
  return (
    <section className="py-48 px-6 relative overflow-hidden bg-bg-primary border-t border-white/5">
      {/* 1. BACKGROUND WATERMARK (MATCHING RESEARCH_HUB SCALE) */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none z-0">
        <h1 className="text-[12vw] font-black tracking-tighter uppercase opacity-[0.05] leading-none whitespace-nowrap select-none">
          THE MANIFESTO
        </h1>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 pt-44">
        
        {/* 2. SUBSECTION TITLE */}
        <div className="mb-32">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="flex items-center gap-3 mb-4"
           >
              <div className="w-8 h-[1px] bg-primary-container" />
              <span className="text-[10px] tracking-[0.4em] text-primary-container font-black uppercase">Academic_Core</span>
           </motion.div>
           <motion.h2 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-tight text-white"
           >
              System <span className="text-primary-container">Philosophies</span>
           </motion.h2>
        </div>

        {/* 3. CONTENT GRID (PROBLEM | SOLUTION | REDIRECT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* PROBLEM BLOCK */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-10"
          >
            <div className="flex items-center gap-3">
               <AlertCircle className="text-red-500 w-5 h-5" />
               <span className="text-[10px] tracking-[0.4em] text-red-500 font-black uppercase">Existing_Gaps</span>
            </div>
            <h3 className="text-6xl md:text-7xl font-black tracking-tighter uppercase leading-none text-white">
              Existing <br /><span className="text-red-500">Gaps</span>
            </h3>
            <p className="text-lg text-text-secondary opacity-60 leading-relaxed font-body">
              The transition from IPC to BNS has created a structural vacuum. Legal interpretation is locked behind manual research, linguistic isolation, and unverified data pools.
            </p>
            <div className="pt-4 grid grid-cols-2 gap-6">
               <div className="space-y-2 border-l border-white/10 pl-6">
                  <div className="text-xl font-bold text-white">40+ Hrs</div>
                  <div className="text-[9px] text-white/30 uppercase tracking-widest font-black">Manual_Research</div>
               </div>
               <div className="space-y-2 border-l border-white/10 pl-6">
                  <div className="text-xl font-bold text-white">70%</div>
                  <div className="text-[9px] text-white/30 uppercase tracking-widest font-black">Rural_Isolation</div>
               </div>
            </div>
          </motion.div>

          {/* SOLUTION BLOCK */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="lg:col-span-4 p-10 bg-white/[0.02] border border-white/5 relative group"
          >
            <div className="absolute -inset-1 bg-primary-container/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative space-y-6">
              <div className="w-12 h-12 bg-primary-container flex items-center justify-center text-white">
                 <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter text-white">The <span className="text-primary-container">Nyay</span> Engine</h3>
              <p className="text-sm text-text-secondary opacity-60 leading-relaxed italic">
                "Our Graph-Based Synthesis layer ensures every citation is verified through topological proof, ensuring total data sovereignty."
              </p>
            </div>
          </motion.div>

          {/* CTA BLOCK */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 flex flex-col justify-center items-start lg:items-end text-left lg:text-right h-full pt-4"
          >
             <span className="text-[10px] tracking-[0.3em] text-white/20 font-black uppercase mb-4">Deep_Dive_Required?</span>
             <h4 className="text-2xl font-black uppercase tracking-tight text-white mb-6">Meet the <br /> <span className="text-primary-container">Architects</span></h4>
             <Link href="/about">
                <button className="flex items-center gap-4 py-4 px-8 bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] hover:bg-primary-container hover:text-white transition-all shadow-2xl">
                  Full Dossier
                  <ArrowRight className="w-4 h-4" />
                </button>
             </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
