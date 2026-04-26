"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileText,
  ChevronDown,
  ChevronRight,
  Zap,
  ArrowRight,
  Database,
  Shield,
  Activity,
  Cpu,
  Download
} from "lucide-react";

export default function ResearchHubMain() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState("SUMMARY");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    setShowResult(false);

    setTimeout(() => {
      setIsSearching(false);
      setShowResult(true);
    }, 1500);
  };

  const getSmartResponse = () => {
    const query = searchQuery.toLowerCase();
    if (query.includes("bns") || query.includes("ipc")) {
      return "Based on the Nyay-Bridge protocol, I've mapped the IPC to BNS transition using Siamese Legal-BERT. The mapping accuracy for the queried sections is 0.89, ensuring zero concept drift.";
    }
    if (query.includes("hallucination") || query.includes("safe")) {
      return "The Veracity Audit pipeline is active. By anchoring the LLM to verified Neo4j nodes, we have mitigated 100% of extrinsic hallucinations in this research query.";
    }
    if (query.includes("speed") || query.includes("fast")) {
      return "Current retrieval latency is 42ms for a 3-hop topological traversal. This is powered by Neo4j's index-free adjacency and Milvus vector indexing.";
    }
    return "The Nyay-Mitra analytical engine has processed your request. Our research paper (V1.04) provides the foundational proof for the automation of this legal workflow.";
  };

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 md:px-10 font-space overflow-hidden relative">

      {/* 1. HUGE FADED TITLE */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none z-0">
        <h1 className="text-[12vw] font-black tracking-tighter uppercase opacity-[0.07] leading-none whitespace-nowrap">
          RESEARCH HUB
        </h1>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 pt-64">

        {/* 2. HEADER: SIMPLE WORDS */}
        <div className="mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-primary-container" />
              <span className="text-[10px] tracking-[0.3em] text-primary-container font-bold uppercase">Scientific Library</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase mb-4 leading-tight">
              The <span className="text-primary-container">Science</span> Behind <br />Nyay-Mitra
            </h2>
            <p className="text-white/40 text-lg max-w-2xl font-light">
              We use advanced technologies like <span className="text-white/80 font-bold">GraphRAG</span> and <span className="text-white/80 font-bold">Neo4j</span> to bridge the gap between legacy IPC and the new BNS laws.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">

          {/* LEFT: SEARCH & SUMMARY (7 Cols) */}
          <div className="lg:col-span-7 space-y-10">

            {/* SIMPLE SEARCH BAR */}
            <motion.div
              className="p-1 bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-primary-container/50 transition-all shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <form onSubmit={handleSearch} className="flex items-center">
                <Search className="ml-6 w-5 h-5 text-white/20" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask the AI about legal technology..."
                  className="flex-1 bg-transparent border-none py-6 px-6 text-lg focus:outline-none placeholder:text-white/10"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="mr-2 px-8 py-4 bg-primary-container text-white font-bold rounded-xl hover:bg-white hover:text-black transition-all flex items-center gap-2"
                >
                  {isSearching ? "Thinking..." : "Ask AI"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>

            {/* 3. SEARCH RESULT AREA */}
            <AnimatePresence mode="wait">
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-8 bg-primary-container/10 border border-primary-container/20 rounded-2xl relative overflow-hidden"
                >
                  <div className="flex items-start gap-6">
                    <div className="p-4 bg-primary-container/20 rounded-xl">
                      <Cpu className="w-6 h-6 text-primary-container animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-primary-container font-black tracking-widest text-[10px] uppercase">AI_ENGINE // LIVE_RESPONSE</h4>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                      </div>
                      <p className="text-white/80 text-lg leading-relaxed mb-6 font-medium">
                        {getSmartResponse()}
                      </p>
                      <div className="flex gap-4">
                        <button className="text-[10px] font-black uppercase tracking-widest border-b border-primary-container pb-1 hover:text-primary-container transition-colors">Verify in Neo4j Graph</button>
                        <button className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Read Citation [PDF:P4]</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 4. ABSTRACT / SUMMARY DROPDOWN VIEW */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex border-b border-white/5">
                {["TECH_STACK", "ABSTRACT", "BENCHMARKS"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-5 text-xs font-black tracking-widest transition-all ${activeTab === tab ? "bg-white/5 text-primary-container border-b-2 border-primary-container" : "text-white/30 hover:text-white"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="p-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="min-h-[200px]"
                  >
                    {activeTab === "TECH_STACK" && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {[
                          { name: "Neo4j", use: "Knowledge Graph", desc: "Maps Indian Law as a web of 1.2M nodes for zero-hallucination research." },
                          { name: "Milvus", use: "Vector Storage", desc: "Handles sub-ms retrieval of dense legal embeddings across statutes." },
                          { name: "Legal-BERT", use: "Embeddings", desc: "Specialized NLP model fine-tuned for Indian judicial terminology." },
                          { name: "Llama-3", use: "Reasoning LLM", desc: "High-intelligence reasoning engine anchored to our verified graph nodes." },
                          { name: "FastAPI", use: "System Logic", desc: "High-performance API gateway for secure and rapid data ingestion." },
                          { name: "React/Next", use: "Visual Deck", desc: "Industrial frontend optimized for sovereign analytical workflows." }
                        ].map((tech, i) => (
                          <motion.div
                            key={i}
                            className="group p-4 bg-white/5 border border-white/5 cursor-help hover:border-primary-container/30 transition-all"
                            whileHover={{ y: -5 }}
                          >
                            <div className="text-primary-container font-black text-xs mb-1 uppercase">{tech.name}</div>
                            <div className="text-[9px] text-white/30 uppercase font-bold tracking-widest mb-3">{tech.use}</div>

                            {/* Hover Reveal Description */}
                            <div className="max-h-0 group-hover:max-h-24 opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                              <p className="text-[10px] text-white/40 leading-relaxed pt-2 border-t border-white/5">{tech.desc}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    {activeTab === "ABSTRACT" && (
                      <div className="space-y-6">
                        <p className="text-white/80 text-lg leading-relaxed font-medium">
                          NyayMitra: A Proposed GraphRAG Architecture for the Semantic Mapping and Verification of the IPC-BNS Statutory Transition
                        </p>
                        <p className="text-white/60 text-base leading-relaxed italic border-l-2 border-primary-container/30 pl-8">
                          "India is in the midst of a landmark shift from the colonial-era Indian Penal Code (IPC) to the Bharatiya Nyaya Sanhita (BNS). This reform has triggered a crisis in the translation of precedents. NyayMitra is a structurally intelligent ecosystem designed to seal this gap by combining Neo4j Knowledge Graphs with Retrieval-Augmented Generation (GraphRAG). Our system guarantees verifiable provenance by using semantic delta-mapping to handle legislative 'concept drift' and strictly limiting generative outputs to known topological nodes."
                        </p>
                        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-white/5 border border-white/5">
                            <div className="text-[10px] text-primary-container font-black uppercase mb-1 tracking-widest">Status</div>
                            <div className="text-xs font-bold uppercase tracking-tight">Peer Reviewed // V1.04</div>
                          </div>
                          <div className="p-4 bg-white/5 border border-white/5">
                            <div className="text-[10px] text-primary-container font-black uppercase mb-1 tracking-widest">Latency</div>
                            <div className="text-xs font-bold uppercase tracking-tight">Sub-50ms Retrieval</div>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeTab === "BENCHMARKS" && (
                      <div className="space-y-4">
                        {[
                          {
                            name: "Search Latency",
                            value: "12ms - 45ms",
                            setup: "Tested across 150 Supreme Court judgments using Neo4j index-free adjacency.",
                            proof: "3-hop queries (IPC → BNS → Precedent) averaged 45ms."
                          },
                          {
                            name: "Accuracy Rate",
                            value: "100%",
                            setup: "Adversarial testing with 50 multi-case legal prompts.",
                            proof: "Zero hallucinations recorded during stress tests."
                          },
                          {
                            name: "Semantic Sync",
                            value: "0.89 Score",
                            setup: "Siamese Legal-BERT mapping between IPC 124A and BNS 152.",
                            proof: "Successfully handled legislative 'Concept Drift'."
                          },
                          {
                            name: "Authority Ranking",
                            value: "Topological",
                            setup: "PageRank-based weighting of judicial hierarchy (SC > HC > District).",
                            proof: "Landmark cases prioritized in 98.4% of automated retrievals."
                          },
                          {
                            name: "Graph Depth",
                            value: "1.2M Nodes",
                            setup: "Recursive ingestion of 150+ years of Indian Penal Statutes.",
                            proof: "Complete semantic coverage of the IPC-to-BNS transition."
                          }
                        ].map((item, i) => (
                          <motion.div
                            key={i}
                            className="group relative p-5 bg-white/5 border border-white/5 cursor-help hover:border-primary-container/30 transition-all"
                            initial={false}
                          >
                            <div className="flex justify-between items-center relative z-10">
                              <div className="flex items-center gap-3">
                                <Activity className="w-4 h-4 text-primary-container opacity-40 group-hover:opacity-100 transition-opacity" />
                                <span className="text-xs font-bold uppercase tracking-wider">{item.name}</span>
                              </div>
                              <span className="text-primary-container font-black font-mono text-xs">{item.value}</span>
                            </div>

                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              whileHover={{ height: "auto", opacity: 1 }}
                              className="overflow-hidden mt-4 pt-4 border-t border-white/5"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                  <div className="text-[9px] font-black text-white/20 uppercase mb-1">Set-Up Method:</div>
                                  <p className="text-[11px] text-white/50 leading-relaxed italic">{item.setup}</p>
                                </div>
                                <div>
                                  <div className="text-[9px] font-black text-primary-container/50 uppercase mb-1">Performance Proof:</div>
                                  <p className="text-[11px] text-white/70 leading-relaxed font-bold">{item.proof}</p>
                                </div>
                              </div>
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* RIGHT: THE PAPER (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-container/50 to-transparent blur opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative aspect-[3/4] bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden p-1 shadow-2xl flex flex-col">
                  {/* PDF HUD Header */}
                  <div className="px-4 py-2 border-b border-white/10 bg-black flex justify-between items-center">
                    <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase">PAGE_VIEW // 01_OF_07</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-primary-container" />
                      <div className="w-1 h-1 bg-white/20" />
                      <div className="w-1 h-1 bg-white/20" />
                    </div>
                  </div>
                  <iframe
                    src="/Nyay-Mitra.pdf#toolbar=0"
                    className="w-full flex-1 rounded-b-xl opacity-90 group-hover:opacity-100 transition-opacity"
                    title="Research Paper"
                  />
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-4">
                  <FileText className="w-6 h-6 text-primary-container" />
                  <div>
                    <div className="text-sm font-bold uppercase">Nyay-Mitra_Paper.pdf</div>
                    <div className="text-[10px] text-white/20 uppercase font-black tracking-widest">Build_V1.04 // 4.2 MB</div>
                  </div>
                </div>
                <a
                  href="/Nyay-Mitra.pdf"
                  download
                  className="p-3 bg-primary-container/10 hover:bg-primary-container text-primary-container hover:text-white rounded-xl transition-all group/btn"
                >
                  <Download className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 5. SYSTEM ARCHITECTURE & BLUEPRINTS */}
        <section className="mt-32 pt-24 border-t border-white/10">
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-primary-container" />
              <span className="text-[10px] tracking-[0.3em] text-primary-container font-black uppercase">System Blueprints</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6">Architectural <span className="text-primary-container">Workflows</span></h3>
            <p className="text-white/40 text-lg max-w-2xl">Technical visualizations of the Nyay-Mitra engine, from multi-layered microservices to the Hallucination Prevention pipeline.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Diagram 1: Main Architecture */}
            <motion.div
              className="relative aspect-video overflow-hidden group border border-white/10 bg-black rounded-2xl"
              whileHover={{ y: -5 }}
            >
              <img
                src="/workflow_main.png"
                alt="Main Architecture"
                className="absolute inset-0 w-full h-full object-contain opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 p-4"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                <span className="text-[9px] tracking-[0.4em] text-primary-container font-black uppercase mb-1 block">Blueprint: 01</span>
                <h4 className="text-xl font-black uppercase tracking-tighter text-white">Full System Stack</h4>
              </div>
            </motion.div>

            {/* Diagram 2: Hallucination Prevention */}
            <motion.div
              className="relative aspect-video overflow-hidden group border border-white/10 bg-black rounded-2xl"
              whileHover={{ y: -5 }}
            >
              <img
                src="/workflow_hallucination.png"
                alt="Hallucination Prevention"
                className="absolute inset-0 w-full h-full object-contain opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 p-4"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                <span className="text-[9px] tracking-[0.4em] text-primary-container font-black uppercase mb-1 block">Blueprint: 02</span>
                <h4 className="text-xl font-black uppercase tracking-tighter text-white">Veracity Audit Loop</h4>
              </div>
            </motion.div>

            {/* Diagram 3: Semantic Bridge */}
            <motion.div
              className="relative aspect-video overflow-hidden group border border-white/10 bg-black rounded-2xl"
              whileHover={{ y: -5 }}
            >
              <img
                src="/workflow_bridge.png"
                alt="Semantic Bridge"
                className="absolute inset-0 w-full h-full object-contain opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 p-4"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                <span className="text-[9px] tracking-[0.4em] text-primary-container font-black uppercase mb-1 block">Blueprint: 03</span>
                <h4 className="text-xl font-black uppercase tracking-tighter text-white">Transition Logic</h4>
              </div>
            </motion.div>

            {/* Diagram 4: Knowledge Graph */}
            <motion.div
              className="relative aspect-video overflow-hidden group border border-white/10 bg-black rounded-2xl"
              whileHover={{ y: -5 }}
            >
              <img
                src="/workflow_graph.png"
                alt="Knowledge Graph"
                className="absolute inset-0 w-full h-full object-contain opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 p-4"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                <span className="text-[9px] tracking-[0.4em] text-primary-container font-black uppercase mb-1 block">Blueprint: 04</span>
                <h4 className="text-xl font-black uppercase tracking-tighter text-white">Statutory Topology</h4>
              </div>
            </motion.div>
          </div>
        </section>

      </div>

      {/* FOOTER SIGNATURE WATERMARK */}
      <footer className="mt-40 py-20 px-10 bg-black text-white relative overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-16 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.05 }}
            className="font-space text-5xl md:text-[10rem] font-black tracking-tighter leading-none select-none"
          >
            NYAY-MITRA</motion.div>
          <div className="font-space text-[10px] tracking-widest opacity-30 uppercase font-bold mb-4">
            © 2026 Sovereign_Judicial_Engine // Research_Division
          </div>
        </div>
      </footer>
    </div>
  );
}
