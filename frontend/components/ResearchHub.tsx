"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const abstract = `NyayMitra proposes a novel Glass-Box Deterministic Legal AI Ecosystem specifically designed for the Indian judicial system, addressing the critical challenge of 51 million pending cases. Unlike opaque Large Language Models, NyayMitra employs a Knowledge Graph-backed GraphRAG architecture using Neo4j, ensuring every AI inference is fully traceable, auditable, and deterministic.

The system comprises four tightly-integrated microservices: (1) Nyay-Graph — a PageRank-optimized legal discovery engine; (2) Nyay-Bridge — a deterministic IPC-to-BNS transition tool; (3) Nyay-Audit — a veracity engine; and (4) Nyay-Vani — a multilingual accessibility layer. Our evaluation demonstrates 94.2% audit accuracy, sub-200ms query latency, and full explainability of every recommendation — establishing a new benchmark for trustworthy AI in critical legal infrastructure.`;

export default function ResearchHub() {
  const [abstractOpen, setAbstractOpen] = useState(false);

  return (
    <section className="py-32 px-6 bg-[#0e0e0e] border-y border-border-color relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 node-network opacity-5" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mb-16"
        >
          <div className="inline-block px-4 py-1.5 bg-[#1c1b1b] border border-border-color mb-8">
            <span className="telemetry-label !text-muted">Research_Publication // RH-402</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Research Paper Hub</h2>
          <div className="h-1 w-20 bg-primary-container mb-6"></div>
          <p className="text-[#e7bdb8] opacity-60 text-lg">Peer-reviewed architectural framework for NyayMitra OS.</p>
        </motion.div>

        {/* Paper Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-bg-primary p-1 border border-border-color shadow-2xl"
        >
          <div className="bg-[#1c1b1b] p-10">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
               <div className="flex-1">
                  <h3 className="text-2xl font-bold uppercase mb-4 leading-tight">
                    NyayMitra: A Proposed GraphRAG Architecture for Deterministic Legal AI
                  </h3>
                  <div className="flex flex-wrap gap-4">
                     <span className="telemetry-label !text-[9px] px-2 py-1 bg-[#0e0e0e] border border-border-color">2026 // STABLE</span>
                     <span className="telemetry-label !text-[9px] px-2 py-1 bg-[#0e0e0e] border border-border-color text-secondary-container">KNOWLEDGE_GRAPH</span>
                     <span className="telemetry-label !text-[9px] px-2 py-1 bg-[#0e0e0e] border border-border-color text-primary-container">DETERMINISTIC</span>
                  </div>
               </div>
               
               <div className="flex flex-col gap-3 w-full md:w-auto">
                  <button className="btn-industrial !text-xs !py-3">
                    DOWNLOAD_PDF [1.2MB]
                  </button>
                  <button className="btn-industrial-outline !text-xs !py-3">
                    OPEN_VIEWER_ONLINE 
                  </button>
               </div>
            </div>

            {/* Abstract Toggle */}
            <div className="pt-8 border-t border-border-color">
              <button 
                onClick={() => setAbstractOpen(!abstractOpen)}
                className="flex items-center gap-3 telemetry-label hover:text-[#e01e22] transition-colors"
              >
                <span className="material-symbols-outlined text-sm">
                  {abstractOpen ? 'remove' : 'add'}
                </span>
                {abstractOpen ? 'COLLAPSE_SUMMARY' : 'INITIALIZE_ABSTRACT_READOUT'}
              </button>

              <AnimatePresence>
                {abstractOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-8 p-8 bg-[#0e0e0e] border-l-2 border-primary-container font-body text-sm leading-relaxed text-[#e7bdb8] opacity-80 whitespace-pre-line">
                      {abstract}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
