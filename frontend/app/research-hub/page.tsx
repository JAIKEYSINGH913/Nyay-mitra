'use client';

import { motion } from 'framer-motion';
import { FileText, Book, Shield, Cpu, ChevronRight, Terminal } from 'lucide-react';

const abstractText = `
NyayMitra is an advanced, graph-powered Judicial Operating System designed to navigate the transformative shift in India's legal landscape from the Indian Penal Code (IPC) to the Bharatiya Nyaya Sanhita (BNS). 

At its core, NyayMitra utilizes NyayGraph—a high-fidelity statutory vault powered by Neo4j—to provide deterministic, non-hallucinatory legal discovery. By employing Siamese Transformer models, the system precisely maps legacy IPC sections to their modern BNS counterparts, identifying "punishment deltas" and procedural modifications with 99.9% veracity.

The ecosystem integrates real-time telemetry, multilingual voice-first retrieval via Bhashini, and a rigorous automated audit layer to ensure every legal output is grounded in codified law. This research abstract outlines the technical architecture of the Sovereign Judicial Hub and the implementation of GraphRAG for mission-critical judicial operations.
`.trim();

const researchPapers = [
  { title: "Statutory Transition Analysis: IPC to BNS Mapping", date: "Jan 2026", id: "NYAY-2026-001" },
  { title: "GraphRAG in Judicial Contexts", date: "Feb 2026", id: "NYAY-2026-002" },
  { title: "Bhashini Integration for Legal Accessibility", date: "Mar 2026", id: "NYAY-2026-003" },
];

export default function ResearchHub() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 px-8 pb-20">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 border-l-2 border-[#00E0FF] pl-8">
          <div className="flex items-center gap-3 mb-4">
             <Terminal className="w-4 h-4 text-[#00E0FF]" />
             <span className="font-mono text-[10px] tracking-[0.4em] text-[#00E0FF] uppercase">Research_Documentation_Portal</span>
          </div>
          <h1 className="font-space text-5xl font-black tracking-tighter uppercase mb-2 text-white">
            RESEARCH_HUB
          </h1>
          <p className="font-mono text-xs text-white/40 tracking-widest uppercase">
            System Abstract & Statutory Whitepapers
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Abstract Column */}
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white/5 border border-white/10 p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E0FF]/5 blur-3xl" />
              <div className="flex items-center gap-4 mb-8">
                 <FileText className="w-6 h-6 text-[#00E0FF]" />
                 <h2 className="font-space text-xl font-bold tracking-widest uppercase">PROJECT_ABSTRACT: NYAYMITRA_OS</h2>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="font-mono text-sm leading-relaxed text-white/70 whitespace-pre-line border-l border-white/10 pl-6">
                  {abstractText}
                </p>
              </div>

              <div className="mt-12 flex items-center gap-4">
                 <button className="px-6 py-3 bg-[#00E0FF] text-black font-space text-xs font-black uppercase tracking-widest hover:bg-[#FFD700] transition-colors">
                    DOWNLOAD_FULL_PDF
                 </button>
                 <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">
                    Reference: Nyay-Mitra.pdf
                 </span>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="font-space text-sm font-bold tracking-[0.3em] uppercase text-white/40">Technical_Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   { label: "ENGINE_TYPE", val: "GraphRAG / Siamese Transformer" },
                   { label: "VAULT_SIZE", val: "250,000+ Nodes" },
                   { label: "LATENCY_TARGET", val: "<50ms" },
                   { label: "VERACITY_RATING", val: "DETERMINISTIC" }
                 ].map(spec => (
                   <div key={spec.label} className="p-4 border border-white/5 bg-white/[0.02] flex justify-between items-center">
                      <span className="font-mono text-[9px] text-[#00E0FF] uppercase">{spec.label}</span>
                      <span className="font-mono text-[10px] text-white/60 font-bold">{spec.val}</span>
                   </div>
                 ))}
              </div>
            </section>
          </div>

          {/* Sidebar Papers */}
          <div className="space-y-8">
             <div className="p-6 border border-[#FFD700]/20 bg-[#FFD700]/5">
                <div className="flex items-center gap-3 mb-6">
                   <Book className="w-4 h-4 text-[#FFD700]" />
                   <h3 className="font-space text-xs font-black tracking-widest uppercase text-[#FFD700]">System_Papers</h3>
                </div>
                
                <div className="space-y-4">
                   {researchPapers.map(paper => (
                     <div key={paper.id} className="group p-4 border border-white/5 hover:border-[#FFD700]/40 transition-all cursor-pointer">
                        <span className="font-mono text-[8px] text-white/20 block mb-1">{paper.id}</span>
                        <div className="font-space text-[10px] font-bold text-white group-hover:text-[#FFD700] transition-colors mb-2 uppercase tracking-tighter">
                           {paper.title}
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="font-mono text-[8px] text-white/40 uppercase">{paper.date}</span>
                           <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-[#FFD700]" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="p-6 border border-white/10 bg-white/5">
                <div className="flex items-center gap-3 mb-4 text-[#00E0FF]">
                   <Shield className="w-4 h-4" />
                   <h3 className="font-space text-xs font-black tracking-widest uppercase">Kernel_Integrity</h3>
                </div>
                <p className="font-mono text-[9px] text-white/30 leading-relaxed uppercase">
                   All research documents in the Archive are verified via GraphRAG cryptographic hashes to ensure statutory alignment.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
