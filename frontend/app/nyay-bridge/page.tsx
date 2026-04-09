"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Workflow, Search, ArrowRightLeft, FileText, BarChart, ShieldCheck } from "lucide-react";
import { get_concept_drift } from "@/lib/api-mock"; // I will create this lib

export default function NyayBridgePage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);

  const handleSimulate = async () => {
    if (!query) return;
    setSimulating(true);
    setResult(null);
    
    // Connect to Siamese Transformer logic (mocked)
    setTimeout(() => {
      const data = {
        ipc: query,
        bns: "BNS_101",
        ipc_title: "Murder",
        bns_title: "Punishment for Murder",
        similarity: 0.98542,
        punishment_delta: [
          { label: "IPC_TERM", value: "Death/Life", color: "#e01e22" },
          { label: "BNS_TERM", value: "Death/Life", color: "#00E0FF" },
          { label: "STABILITY", value: "DEVIATION_0%", color: "#10b981" }
        ],
        report: "Statute structure preserved with 98% linguistic alignment. Fine scales updated to 2024 economic benchmarks."
      };
      setResult(data);
      setSimulating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-bg-surface pt-32 px-10 pb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-container/5 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
           <div className="w-1.5 h-6 bg-primary-container" />
           <h2 className="font-space text-sm font-black tracking-[.4em] uppercase text-text-muted">CONCEPT_DRIFT_SIMULATOR (IPC ↔ BNS)</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
           <div className="space-y-10">
              <h1 className="font-space text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-tight">
                 THE NYAY <br /> <span className="text-primary-container">BRIDGE</span>
              </h1>
              <p className="font-body text-lg text-text-secondary leading-relaxed max-w-lg opacity-80">
                 Identify statutory evolution using high-fidelity Siamese Transformer logic. Map legacy nodes to modern BNS architecture with zero-loss semantic grounding.
              </p>
              
              <div className="p-1 bg-border-color/20 backdrop-blur-md max-w-md">
                 <div className="bg-bg-surface-lowest border border-border-color p-8 space-y-6">
                    <span className="telemetry-label !text-[10px] opacity-40 uppercase">INITIALIZE_SCAN</span>
                    <div className="space-y-4">
                       <input 
                         type="text" 
                         placeholder="INPUT_IPC_SECTION (e.g. 302)..."
                         className="w-full bg-[#1c1b1b] border border-border-color p-4 font-space text-[12px] focus:outline-none focus:border-primary-container"
                         value={query}
                         onChange={(e) => setQuery(e.target.value)}
                       />
                       <button 
                         onClick={handleSimulate}
                         disabled={simulating}
                         className="btn-industrial bg-primary-container w-full group py-5"
                       >
                          <span className="flex items-center justify-center gap-3 font-space font-bold tracking-widest text-[11px]">
                             {simulating ? "SIMULATING_MODEL..." : "EXECUTE_DRIFT_ANALYSIS"}
                             {!simulating && <ArrowRightLeft className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />}
                          </span>
                       </button>
                    </div>
                 </div>
              </div>
           </div>

           <div className="relative aspect-square lg:aspect-auto h-[600px] border border-border-color bg-bg-surface-lowest overflow-hidden group">
              <AnimatePresence mode="wait">
                 {result ? (
                   <motion.div 
                     key="result"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="p-10 h-full flex flex-col"
                   >
                     <div className="flex justify-between items-start mb-12">
                        <div className="space-y-1">
                           <span className="telemetry-label !text-primary-container !font-bold uppercase tracking-widest text-[9px]">TRANSITION_SUCCESS</span>
                           <h2 className="font-space text-4xl font-black text-white">{result.ipc} → {result.bns}</h2>
                        </div>
                        <div className="text-right">
                           <span className="telemetry-label !text-[8px] opacity-30 uppercase block mb-1">COSINE_SIMILARITY</span>
                           <span className="font-space text-2xl font-bold text-secondary-container">{result.similarity}</span>
                        </div>
                     </div>

                     <div className="grid grid-cols-3 gap-6 mb-12">
                        {result.punishment_delta.map((delta: any) => (
                           <div key={delta.label} className="p-4 bg-bg-surface-high border-l-2 border-primary-container">
                              <span className="telemetry-label !text-[8px] opacity-40 uppercase block mb-1">{delta.label}</span>
                              <span className="font-space text-[11px] font-bold text-white uppercase">{delta.value}</span>
                           </div>
                        ))}
                     </div>

                     <div className="flex-1 border-t border-border-color pt-8">
                        <div className="flex items-center gap-3 mb-4">
                           <BarChart className="w-4 h-4 text-primary-container" />
                           <span className="font-space text-[11px] font-black uppercase text-text-muted">PUNISHMENT_DELTA_REPORT</span>
                        </div>
                        <p className="font-body text-[#e7bdb8] leading-relaxed opacity-80 mb-8 border-l-2 border-white/5 pl-6">{result.report}</p>
                        
                        <div className="mt-auto flex justify-between items-center bg-primary-container/5 p-4 border border-primary-container/20">
                           <div className="flex items-center gap-3">
                              <ShieldCheck className="w-4 h-4 text-primary-container" />
                              <span className="font-space text-[10px] font-bold text-primary-container uppercase tracking-tighter">VERACITY_INDEX_100%_SECURE</span>
                           </div>
                        </div>
                     </div>
                   </motion.div>
                 ) : (
                   <div className="absolute inset-0 flex flex-col items-center justify-center p-20 text-center space-y-8">
                      <div className="w-32 h-32 border border-border-color flex items-center justify-center relative overflow-hidden group">
                         <div className="absolute inset-0 bg-primary-container/5 group-hover:bg-primary-container/10 transition-colors" />
                         <Workflow className="w-12 h-12 text-primary-container opacity-20" />
                      </div>
                      <div className="space-y-2">
                         <h3 className="font-space text-lg font-bold text-white uppercase tracking-widest">Awaiting Bridge Protocol</h3>
                         <p className="font-body text-xs text-text-muted max-w-xs mx-auto uppercase tracking-tighter">Enter an IPC section number to simulate the Siamese Transformer mapping to BNS 2023.</p>
                      </div>
                   </div>
                 )}
              </AnimatePresence>
              
              {/* Scanline animations */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary-container/20 group-hover:bg-primary-container/40 transition-colors" />
           </div>
        </div>
      </div>
    </div>
  );
}
