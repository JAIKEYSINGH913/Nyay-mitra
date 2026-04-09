"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Database, Search, Gavel, ShieldCheck, Fingerprint } from "lucide-react";

export default function StatutePage() {
  const { statute } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const isLegacy = statute === "IPC_1860_LEGACY";

  useEffect(() => {
    // Simulated backend call to Neo4j statutory_vault
    const fetchData = async () => {
      setLoading(true);
      // Actual fetch would be: fetch(`/api/graph/vault?type=${statute}`)
      setTimeout(() => {
        if (isLegacy) {
          setData([
            { chapter: "CHAPTER I - INTRODUCTION", sections: ["1", "2", "3", "4", "5"] },
            { chapter: "CHAPTER II - GENERAL EXPLANATIONS", sections: ["6", "7", "8", "9", "10", "11"] },
            { chapter: "CHAPTER IV - GENERAL EXCEPTIONS", sections: ["76", "77", "78", "79", "80"] },
            { chapter: "CHAPTER XVI - OFFENCES AFFECTING THE HUMAN BODY", sections: ["299", "300", "301", "302", "303", "304"] },
          ]);
        }
        setLoading(false);
      }, 1000);
    };
    fetchData();
  }, [statute]);

  return (
    <div className="min-h-screen bg-bg-surface pt-32 px-10 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
           <Gavel className="w-5 h-5 text-primary-container" />
           <span className="telemetry-label tracking-[0.3em] font-bold uppercase text-primary-container">
              STATUTORY_VAULT // {statute}
           </span>
        </div>
        
        <h1 className="font-space text-5xl font-black uppercase tracking-tighter mb-12">
           {isLegacy ? "IPC_1860_LEGACY_REPOSITORY" : "MODERN_BNS_PROTOCOL"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
           <div className="lg:col-span-1 border-r border-border-color pr-8 space-y-8">
              <div className="space-y-4">
                 <span className="telemetry-label !text-[10px] opacity-40 uppercase">VAULT_SEARCH_INDEX</span>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                    <input 
                       type="text" 
                       placeholder="SECTION_ID_SCAN..."
                       className="w-full bg-[#1c1b1b] border border-border-color p-3 pl-10 font-space text-[10px] focus:outline-none focus:border-primary-container text-white"
                       onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </div>
              </div>
              
              <div className="p-6 bg-bg-surface-lowest border border-border-color space-y-4">
                 <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-secondary-container" />
                    <span className="font-space text-[11px] font-bold">KNOWLEDGE_GRAPH_STATUS</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-space text-[9px] uppercase tracking-widest text-[#10b981]">NEO4J_LINK_ESTABLISHED</span>
                 </div>
                 <p className="text-[10px] text-text-muted leading-relaxed font-body">STATUTORY_VAULT is connected to the master Neo4j schema (Shukla et al., 2025).</p>
              </div>
           </div>

           <div className="lg:col-span-3">
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                   <div className="w-12 h-12 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-12">
                   {data?.map((group: any) => (
                     <div key={group.chapter} className="space-y-6">
                        <div className="flex items-center gap-4">
                           <div className="h-[1px] flex-1 bg-border-color opacity-20" />
                           <h3 className="font-space text-[11px] font-bold tracking-widest text-text-muted flex-none uppercase">
                             {group.chapter}
                           </h3>
                           <div className="h-[1px] flex-1 bg-border-color opacity-20" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                           {group.sections.map((sec: string) => (
                             <motion.div 
                                whileHover={{ scale: 1.05 }}
                                key={sec}
                                className="p-6 bg-bg-surface-high border border-border-color hover:border-primary-container cursor-pointer transition-all group"
                             >
                                <span className="telemetry-label !text-[8px] opacity-30 block mb-2 uppercase">§SECTION</span>
                                <span className="font-space text-lg font-bold text-white group-hover:text-primary-container">{sec}</span>
                             </motion.div>
                           ))}
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
