"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Cpu, Search, ArrowRight, Layers, Shield } from "lucide-react";

export default function ResearchHubSection() {
  return (
    <section className="py-32 px-10 bg-black relative overflow-hidden border-t border-white/5">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-container/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          
          {/* Left: Explanatory Content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-[1px] bg-primary-container" />
                <span className="font-space text-xs tracking-[0.4em] text-primary-container uppercase font-bold">Scientific_Foundation</span>
              </div>
              
              <h2 className="font-space text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none opacity-10 mb-8 select-none">
                RESEARCH_HUB
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-space text-2xl font-bold text-white mb-4 uppercase tracking-widest">The Abstract</h3>
                  <p className="text-white/60 text-lg leading-relaxed font-light italic border-l-2 border-primary-container/30 pl-6 py-2">
                    "Nyay-Mitra introduces a computational framework designed to bridge the transition between the Indian Penal Code (IPC) and the Bharatiya Nyaya Sanhita (BNS). By utilizing high-dimensional vector embeddings and knowledge graph synthesis, the platform ensures that legal research is not just faster, but mathematically grounded in constitutional sovereignty."
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-none">
                    <div className="flex items-center gap-3 mb-4 text-primary-container">
                      <Cpu className="w-5 h-5" />
                      <span className="font-space font-bold text-sm tracking-widest uppercase">Smart Search</span>
                    </div>
                    <p className="text-white/40 text-sm leading-relaxed">
                      Our AI doesn't just look for keywords; it understands the "meaning" of your legal queries to find the most relevant case laws and statutes.
                    </p>
                  </div>
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-none">
                    <div className="flex items-center gap-3 mb-4 text-white">
                      <Shield className="w-5 h-5" />
                      <span className="font-space font-bold text-sm tracking-widest uppercase">Safe Data</span>
                    </div>
                    <p className="text-white/40 text-sm leading-relaxed">
                      All research papers and sensitive legal documents are processed locally to maintain total data sovereignty and privacy.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Interactive Trigger */}
          <div className="lg:col-span-5">
            <Link href="/research-hub">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer relative"
              >
                <div className="absolute inset-0 bg-primary-container/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative p-10 bg-white/[0.03] border border-white/10 group-hover:border-primary-container/50 transition-all">
                  <div className="flex justify-between items-start mb-20">
                    <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center group-hover:bg-primary-container group-hover:text-white transition-all">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div className="text-right">
                       <span className="block font-mono text-[10px] text-white/20 uppercase">PROTOCOL_READY</span>
                       <span className="block font-mono text-[10px] text-primary-container uppercase font-black tracking-widest">LIVE_NOW</span>
                    </div>
                  </div>

                  <h4 className="font-space text-3xl font-black tracking-tighter uppercase mb-4 leading-none">
                    ENTER_<span className="text-primary-container">ANALYTICAL</span><br />
                    VAULT
                  </h4>
                  
                  <p className="text-white/40 text-sm mb-10 leading-relaxed max-w-[280px]">
                    Access the neural search engine and analyze Nyay-Mitra's technical research papers.
                  </p>

                  <div className="flex items-center gap-4 text-primary-container">
                    <span className="font-space text-xs font-black tracking-[0.3em] uppercase">INITIATE_REDIRECT</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                  </div>
                </div>

                {/* Technical HUD Decor */}
                <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-primary-container/20 pointer-events-none" />
                <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-white/10 pointer-events-none" />
              </motion.div>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
