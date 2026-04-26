"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  FileText, 
  Database, 
  Scale, 
  Activity, 
  Zap, 
  Cpu, 
  Shield, 
  Terminal,
  ChevronRight,
  Download,
  Share2,
  Maximize2
} from "lucide-react";

export default function ResearchHubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsScanning(false);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white pt-32 pb-20 px-6 md:px-10 font-space overflow-hidden selection:bg-primary-container selection:text-white">
      {/* Background Grid Accent */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(224,30,34,0.05),transparent)]" />
        <div className="h-full w-full opacity-10" style={{ 
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px' 
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Telemetry */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              <span className="telemetry-label !text-[10px] tracking-[0.4em] opacity-60">SYSTEM_HUB // ANALYTICAL_VAULT</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              RESEARCH_<span className="text-primary-container">HUB</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-3 bg-white/5 border border-white/10 flex flex-col items-end">
              <span className="telemetry-label !text-[8px] opacity-40">SESSION_ID</span>
              <span className="font-mono text-xs font-bold text-primary-container">NM_402_ALPHA</span>
            </div>
            <div className="px-6 py-3 bg-white/5 border border-white/10 flex flex-col items-end">
              <span className="telemetry-label !text-[8px] opacity-40">ENCRYPTION</span>
              <span className="font-mono text-xs font-bold">AES_256_L3</span>
            </div>
          </div>
        </div>

        {/* Neural Search Engine */}
        <section className="mb-20">
          <motion.div 
            className="p-10 md:p-16 bg-white/[0.02] border border-white/10 relative overflow-hidden group"
            whileHover={{ borderColor: "rgba(224,30,34,0.3)" }}
          >
            {/* Scanning Line Animation */}
            <AnimatePresence>
              {isScanning && (
                <motion.div 
                  initial={{ top: "-10%" }}
                  animate={{ top: "110%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 w-full h-[2px] bg-primary-container/40 z-20 shadow-[0_0_15px_rgba(224,30,34,0.5)]"
                />
              )}
            </AnimatePresence>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-primary-container/10 border border-primary-container/20">
                  <Cpu className="w-6 h-6 text-primary-container" />
                </div>
                <h3 className="font-space text-xl font-black tracking-widest uppercase">NEURAL_SEARCH_ENGINE</h3>
              </div>

              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-primary-container transition-colors" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ANALYSE DOCUMENT: Nyay-Mitra.pdf | QUERY VAULT..."
                  className="w-full bg-black border border-white/10 py-6 pl-16 pr-24 font-mono text-sm md:text-lg uppercase font-medium tracking-widest placeholder:text-white/10 focus:outline-none focus:border-primary-container/50 transition-all"
                />
                <button 
                  type="submit"
                  disabled={isScanning}
                  className="absolute right-4 top-1/2 -translate-y-1/2 px-8 py-3 bg-primary-container text-white font-space font-black text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all disabled:opacity-50"
                >
                  {isScanning ? "SCANNING..." : "INITIATE_SCAN"}
                </button>
              </form>

              <div className="mt-8 flex flex-wrap gap-4">
                 {["Nyay-Mitra.pdf", "Statutory_Analysis", "Legal_Synthesis", "IPC_BNS_Cross"].map((tag) => (
                   <span key={tag} className="px-4 py-1.5 bg-white/5 border border-white/5 font-mono text-[9px] text-white/40 tracking-widest uppercase cursor-pointer hover:border-white/20 hover:text-white transition-all">
                     #{tag}
                   </span>
                 ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Data Grid: Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
           {[
             { 
               title: "KEY_FINDINGS", 
               icon: <FileText className="w-5 h-5" />, 
               desc: "Autonomous synthesis of core legal principles from Nyay-Mitra architecture.",
               value: "244_NODES",
               color: "text-primary-container"
             },
             { 
               title: "STATUTORY_REFS", 
               icon: <Scale className="w-5 h-5" />, 
               desc: "IPC to BNS bridge metrics and mapping consistency across 511 sections.",
               value: "98.2%_SYNC",
               color: "text-white"
             },
             { 
               title: "CASE_PRECEDENTS", 
               icon: <Database className="w-5 h-5" />, 
               desc: "Retrieval of historical judgments aligned with sovereign data protocols.",
               value: "1.2M_RECORDS",
               color: "text-white"
             }
           ].map((card, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="p-8 bg-white/[0.01] border border-white/5 hover:border-primary-container/20 transition-all group cursor-pointer"
             >
               <div className="flex justify-between items-start mb-10">
                 <div className={`p-3 bg-white/5 border border-white/10 ${card.color}`}>
                   {card.icon}
                 </div>
                 <span className="font-mono text-[10px] opacity-20 group-hover:opacity-100 transition-opacity">DATA_NODE: 00{i+1}</span>
               </div>
               <h4 className="font-space text-lg font-black tracking-widest uppercase mb-4 text-white/90">{card.title}</h4>
               <p className="text-white/40 text-sm leading-relaxed mb-8">{card.desc}</p>
               <div className="flex justify-between items-end">
                 <span className={`font-mono text-xl font-black ${card.color}`}>{card.value}</span>
                 <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-primary-container transition-colors" />
               </div>
             </motion.div>
           ))}
        </div>

        {/* Analysis Engine - Progress Widget */}
        <section>
          <div className="p-8 bg-white/[0.02] border border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 flex items-center justify-center border border-primary-container/30">
                    <Activity className="w-5 h-5 text-primary-container animate-pulse" />
                 </div>
                 <div>
                    <h5 className="font-space font-black tracking-widest text-sm uppercase">NEURAL_SYNTHESIS_PROGRESS</h5>
                    <span className="font-mono text-[10px] text-white/30 uppercase">{isScanning ? "SYNTHESIZING_PRECEDENTS..." : "IDLE_PENDING_QUERY"}</span>
                 </div>
              </div>
              <div className="flex items-center gap-10">
                 <div className="text-right">
                    <span className="telemetry-label !text-[8px] opacity-40">PROCESSING_SPEED</span>
                    <div className="font-mono text-sm font-bold">12.4 GB/S</div>
                 </div>
                 <div className="text-right">
                    <span className="telemetry-label !text-[8px] opacity-40">COMPLETION</span>
                    <div className="font-mono text-sm font-bold text-primary-container">{progress}%</div>
                 </div>
              </div>
            </div>
            <div className="w-full h-1.5 bg-white/5 overflow-hidden">
               <motion.div 
                 className="h-full bg-primary-container"
                 initial={{ width: "78%" }}
                 animate={{ width: `${isScanning ? progress : 78}%` }}
                 transition={{ type: "spring", stiffness: 50 }}
               />
            </div>
            <div className="flex justify-between mt-4">
               <div className="flex gap-4">
                  {[1,2,3,4,5,6].map(b => (
                    <div key={b} className={`w-1 h-1 ${progress > b*15 ? "bg-primary-container" : "bg-white/10"}`} />
                  ))}
               </div>
               <span className="telemetry-label !text-[8px] opacity-20 tracking-[0.5em]">ALPHA_CORE_ACTIVE</span>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Action Menu (Industrial) */}
      <div className="fixed bottom-10 right-10 flex flex-col gap-4 z-50">
         {[
           { icon: <Download />, label: "EXPORT" },
           { icon: <Share2 />, label: "SYNC" },
           { icon: <Maximize2 />, label: "EXPAND" }
         ].map((act, i) => (
           <motion.button
             key={i}
             whileHover={{ scale: 1.1, x: -5 }}
             className="w-14 h-14 bg-black border border-white/10 hover:border-primary-container/50 flex items-center justify-center text-white/40 hover:text-primary-container transition-all shadow-2xl"
           >
             {act.icon}
           </motion.button>
         ))}
      </div>
    </div>
  );
}
