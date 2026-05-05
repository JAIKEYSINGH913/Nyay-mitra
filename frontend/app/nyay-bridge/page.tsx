"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Search, 
  Terminal, 
  Activity, 
  Database, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Code2,
  RefreshCcw,
  GitMerge,
  Send
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNeuralContext } from "@/components/NeuralProvider";
import toast from "react-hot-toast";

// Mock Data for Inference (Multi-Vector Retrieval Top-K=5)
const MOCK_FRAGMENTATION_MAPPING = {
  ipc: "Section 499",
  ipc_text: "Whoever, by words either spoken or intended to be read, or by signs or by visible representations, makes or publishes any imputation concerning any person intending to harm, or knowing or having reason to believe that such imputation will harm, the reputation of such person, is said, except in the cases hereinafter excepted, to defame that person.",
  inference_time: "1.8s",
  reasoning: `<thinking_process>
[LLAMA-3.3-70B] Initializing Siamese Transformer Mapping (Top-K=5)...
> Tokenizing Legacy Input (IPC 499: Defamation)...
> Extracting Semantic Core: [ACTION: "Imputation intending to harm reputation"] -> [EXCEPTIONS: Multiple].
> Querying Milvus Vector Database for nearest BNS neighbors...
> FRAGMENTATION DETECTED: 1:N Mapping found.
> Match 1: BNS Section 356(1) [Primary Definition] - 92.4%
> Match 2: BNS Section 356(2) [Punishment & Exceptions] - 84.2%
> Match 3: BNS Section 356(3) [Community Service Exception] - 81.5%
> Analyzing Statutory Delta for drift...
> Formatting Evolution View for User Interface...
> Inference complete.
</thinking_process>`,
  bns_matches: [
    {
      label: "Primary Match",
      bns: "Section 356(1)",
      bns_text: "Whoever, by words either spoken or intended to be read, or by signs or by visible representations, makes or publishes any imputation concerning any person intending to harm, or knowing or having reason to believe that such imputation will harm, the reputation of such person, is said, except in the cases hereinafter excepted, to defame that person.",
      similarity: 92.4,
      vector_dist: 0.08
    },
    {
      label: "Sub-Clause Alpha",
      bns: "Section 356(2)",
      bns_text: "Whoever defames another shall be punished with simple imprisonment for a term which may extend to two years, or with fine, or with both.",
      similarity: 84.2,
      vector_dist: 0.16
    },
    {
      label: "Related Exception",
      bns: "Section 356(3)",
      bns_text: "Provided that in cases of criminal defamation involving public servants, the court may direct the offender to perform community service as an alternative to imprisonment.",
      similarity: 81.5,
      vector_dist: 0.19
    }
  ],
  deltas: [
    { type: "unchanged", label: "BASE_DEFAMATION", description: "Core definition of defamation via spoken/written imputation remains structurally identical.", impact: "neutral" },
    { type: "new", label: "COMMUNITY_SERVICE", description: "Introduction of community service as a formal alternative punishment for public servants.", impact: "decreased" },
    { type: "increased", label: "FINE_APPLICATION", description: "Fines may now be scaled relative to the economic damage caused by the imputation.", impact: "increased" }
  ],
  telemetry: {
    processing_time_ms: 1800,
    embedding_distance: 0.08,
    model_llm: "Llama-3.3-70B",
    model_embedding: "InLegalBERT",
    auto_lookup: true
  }
};

export default function NyayBridgePage() {
  const [ipcInput, setIpcInput] = useState("");
  const [ipcText, setIpcText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<typeof MOCK_FRAGMENTATION_MAPPING | null>(null);
  
  // Terminal State
  const [terminalText, setTerminalText] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Toggles
  const [cachedMode, setCachedMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  const { state, setNeuralState } = useNeuralContext();
  const router = useRouter();

  // Auto-fill from Vani if context exists
  useEffect(() => {
    if (state.activeQuery && !ipcInput) {
      setIpcInput(state.activeQuery);
      // For demo purposes, pretend it maps to IPC 302 if it's the specific mock query
      if (state.activeQuery.includes("murder")) {
        setIpcInput("IPC 302");
      }
    }
  }, [state.activeQuery]);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalText]);

  const runInference = async () => {
    if (!ipcInput.trim()) return;
    
    setIsProcessing(true);
    setResult(null);
    setTerminalText("");

    const sectionMatch = ipcInput.match(/(?:IPC|BNS)?\s*(\d+)/i);
    const sectionNum = sectionMatch ? sectionMatch[1] : ipcInput;

    try {
      const response = await fetch(`https://nyay-python-gateway.fly.dev/api/bridge/map`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ipc_section: sectionNum,
          bns_section: "UNKNOWN", 
          ipc_text: ipcText || `Section ${sectionNum} of IPC`, 
          bns_text: "",
          show_reasoning: true
        })
      });

      const data = await response.json();
      
      if (data.reasoning) {
        // Stream the reasoning to terminal
        let i = 0;
        const interval = setInterval(() => {
          setTerminalText((prev) => prev + data.reasoning.charAt(i));
          i++;
          if (i >= data.reasoning.length) {
            clearInterval(interval);
            setResult(data);
            setIsProcessing(false);
          }
        }, 10);
      } else {
        setResult(data);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Bridge API Error:", error);
      setIsProcessing(false);
      setTerminalText("ERROR: FAILED_TO_CONNECT_TO_BRIDGE_SERVICE [8002]");
    }
  };

  const fillExample = () => {
    setIpcInput("IPC 499");
    setIpcText(MOCK_FRAGMENTATION_MAPPING.ipc_text);
  };

  const sendToAudit = () => {
    // Forward context to Nyay-Audit
    if (result) {
      setNeuralState({
        activeQuery: ipcInput,
        mappedBNS: result.bns_matches?.[0]?.bns || "UNKNOWN",
        provenanceHash: `BRIDGE_${Date.now()}`
      });
    }
    toast.success("Bridge results forwarded. Redirecting to Nyay-Audit...");
    router.push("/nyay-audit");
  };

  return (
    <div className="min-h-screen bg-black text-white font-space pt-24 pb-20 px-6 md:px-10 overflow-x-hidden relative selection:bg-primary-container selection:text-black">
      
      {/* 1. HUGE FADED TITLE */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none z-0">
        <h1 className="text-[14vw] font-black tracking-tighter uppercase opacity-[0.03] leading-none select-none">
          NYAY-BRIDGE
        </h1>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10 pt-10">
        
        {/* HEADER & TELEMETRY */}
        <div className="flex flex-col xl:flex-row justify-between items-end gap-10 mb-10 border-b border-white/5 pb-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-primary-container transition-all mb-8 group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> BACK_TO_HUB
            </Link>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8] mb-4">
              Nyay-<span className="text-primary-container">Bridge</span>
            </h2>
            <p className="text-white/40 text-[12px] uppercase tracking-widest">
              STEP 02 OF 04 — Legacy to Modern Statutory Mapping
            </p>
            <p className="text-white/30 text-[11px] mt-2 max-w-lg leading-relaxed">
              Type an IPC section number (e.g., 302 for Murder, 420 for Cheating, 499 for Defamation). The system maps it to the corresponding BNS provision, identifies punishment deltas, and saves the link in the Knowledge Graph.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full xl:w-auto">
            {/* Standalone Telemetry HUD */}
            <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/10 rounded-none w-full justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary-container" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                  MODEL: <span className="text-white">LLAMA-3.3-70B</span>
                </span>
              </div>
              <div className="h-4 w-[1px] bg-white/20" />
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-secondary-container" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                  VECTOR_DIST: <span className="text-white">{result ? (result.telemetry?.embedding_distance?.toFixed(3) || result.bns_matches?.[0]?.vector_dist || "---") : "---"}</span>
                </span>
              </div>
              <div className="h-4 w-[1px] bg-white/20" />
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                  INFERENCE: <span className="text-white">{result ? `${result.telemetry?.processing_time_ms?.toFixed(0) || "---"}ms` : "---"}</span>
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              <button 
                onClick={() => setCachedMode(!cachedMode)}
                className={`flex-1 p-3 text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${cachedMode ? "bg-primary-container text-black border-primary-container" : "bg-white/5 text-white/40 border-white/10 hover:border-white/30"}`}
              >
                <Database className="w-3 h-3" /> Cached Mode
              </button>
              <button 
                onClick={() => setDebugMode(!debugMode)}
                className={`flex-1 p-3 text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${debugMode ? "bg-secondary-container text-black border-secondary-container" : "bg-white/5 text-white/40 border-white/10 hover:border-white/30"}`}
              >
                <Code2 className="w-3 h-3" /> Debug Log
              </button>
            </div>
          </div>
        </div>

        {/* WORKSPACE: DUAL PANE EDITOR */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 mb-10 items-stretch">
          
          {/* LEFT: LEGACY PANEL */}
          <div className="flex flex-col border border-white/10 bg-white/[0.02] border-t-[4px] border-t-white/20 p-8 relative overflow-hidden group">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[12px] font-black uppercase tracking-[0.3em] text-white/50">Legacy Input</span>
              <button onClick={fillExample} className="text-[9px] font-bold uppercase tracking-widest text-primary-container hover:underline">
                [Load Sample]
              </button>
            </div>
            
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="text" 
                placeholder="Search IPC Section (e.g., 302)..."
                value={ipcInput}
                onChange={(e) => setIpcInput(e.target.value)}
                className="w-full bg-black border border-white/10 p-4 pl-12 text-[13px] font-medium font-body focus:border-primary-container outline-none transition-all"
              />
            </div>

            <textarea 
              className="flex-1 w-full bg-transparent resize-none outline-none text-[14px] leading-relaxed font-body text-white/80 placeholder:text-white/20 custom-scrollbar"
              placeholder="Or paste full raw text here..."
              value={ipcText}
              onChange={(e) => setIpcText(e.target.value)}
            />

            <button 
              onClick={runInference}
              disabled={isProcessing || !ipcInput}
              className="mt-6 w-full py-4 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-[11px] font-black uppercase tracking-widest transition-all"
            >
              Initialize Transition
            </button>
          </div>

          {/* CENTER: TRANSITION HUB */}
          <div className="flex flex-col items-center justify-center py-10 px-4">
             {/* Deterministic Pulse Logo */}
             <div className="relative w-24 h-24 flex items-center justify-center mb-8">
                <AnimatePresence>
                  {isProcessing && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1.5 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                      className="absolute inset-0 border border-primary-container rounded-full"
                    />
                  )}
                </AnimatePresence>
                <div className={`w-16 h-16 rounded-none flex items-center justify-center z-10 transition-colors duration-500 border ${isProcessing ? 'border-primary-container bg-primary-container/10 shadow-[0_0_30px_rgba(0,243,255,0.3)]' : 'border-white/20 bg-black'}`}>
                   <RefreshCcw className={`w-6 h-6 ${isProcessing ? 'text-primary-container animate-spin' : 'text-white/40'}`} />
                </div>
             </div>

             {/* Connection Bar */}
             <div className="w-[2px] h-32 bg-white/10 relative overflow-hidden mb-6">
                <AnimatePresence>
                   {isProcessing && (
                     <motion.div 
                       initial={{ top: "-10%" }}
                       animate={{ top: "110%" }}
                       transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                       className="absolute left-0 w-full h-1/3 bg-gradient-to-b from-transparent via-primary-container to-transparent"
                     />
                   )}
                </AnimatePresence>
             </div>

             <div className="text-center">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2">Primary_Similarity_Score</span>
                <div className="text-3xl font-black text-primary-container">
                   {result ? `${result.bns_matches[0].similarity}%` : "---%"}
                </div>
             </div>
          </div>

          {/* RIGHT: MODERN PANEL */}
          <div className="flex flex-col border border-white/10 bg-white/[0.02] border-t-[4px] border-t-primary-container p-8 relative overflow-hidden group">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[12px] font-black uppercase tracking-[0.3em] text-primary-container">Modern Output</span>
              {result && (
                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" /> Grounded
                </span>
              )}
            </div>

            <div className="flex-1 bg-black border border-white/5 p-4 overflow-y-auto custom-scrollbar relative flex flex-col">
               {!result ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
                    <Database className="w-10 h-10 mb-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Mapping Protocol</span>
                 </div>
               ) : (
                 <div className="flex flex-col h-full gap-4">
                    {result.bns_matches.length > 1 && (
                      <div className="px-4 py-2 bg-primary-container/10 border border-primary-container/30 text-primary-container flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <GitMerge className="w-4 h-4" /> STATUTORY FRAGMENTATION DETECTED
                        </span>
                        <span className="text-[10px] font-mono">1:N SPLIT</span>
                      </div>
                    )}
                    
                    <div className="space-y-4 flex-1">
                      {result.bns_matches.map((match, idx) => (
                        <div key={idx} className={`p-5 border ${idx === 0 ? 'border-primary-container/50 bg-primary-container/5' : 'border-white/10 bg-white/[0.02]'}`}>
                          <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-3">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${idx === 0 ? 'text-primary-container' : 'text-white/50'}`}>
                              {match.label}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-white/80">SIMILARITY: {match.similarity}%</span>
                          </div>
                          
                          {/* Semantic Drift Warning */}
                          {match.similarity >= 70 && match.similarity <= 85 && (
                            <div className="mb-4 px-3 py-2 bg-amber-500/10 border-l-2 border-amber-500 flex items-start gap-2">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                              <span className="text-[9px] font-mono uppercase text-amber-400">
                                ⚠️ CONTEXTUAL DRIFT: Legal definition has shifted significantly between regimes. Proceed with caution.
                              </span>
                            </div>
                          )}

                          <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">{match.bns}</h3>
                          <p className="text-[13px] leading-relaxed font-body text-white/80 whitespace-pre-wrap">
                            {match.bns_text}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <button 
                           onClick={sendToAudit}
                           className="w-full py-4 bg-primary-container text-black font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(0,243,255,0.2)]"
                        >
                           <Send className="w-4 h-4" /> PROCEED TO 03_NYAY_AUDIT →
                        </button>
                    </div>
                 </div>
               )}
            </div>
          </div>

        </div>

        {/* DESCRIPTIVE ADVISORY */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 p-8 border border-emerald-500/20 bg-emerald-500/5"
            >
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-500">LEGAL ADVISORY — TRANSITION ANALYSIS</span>
              </div>
              <p className="text-[13px] leading-relaxed text-white/80 font-body">
                <strong className="text-white">Summary:</strong> The statutory mapping for <span className="text-primary-container font-bold">{ipcInput}</span> has been completed.
                {result.bns_matches?.length > 1 
                  ? ` A 1:N fragmentation was detected — the original IPC provision has been split into ${result.bns_matches.length} BNS sub-sections. This is common in the 2023 reform where complex provisions were disaggregated for procedural clarity.`
                  : " A direct 1:1 mapping was established between the legacy and modern provisions."
                }
              </p>
              <p className="text-[13px] leading-relaxed text-white/60 font-body mt-3">
                <strong className="text-white">Recommended Next Step:</strong> Proceed to <span className="text-emerald-400 font-bold">Nyay-Audit (Step 03)</span> to verify the groundedness of any legal drafts or AI-generated advice citing these provisions. The Audit engine will cross-reference citations against the Knowledge Graph and flag hallucinations or overruled precedents.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM SECTION: REASONING & DELTA REPORT */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
           
           {/* REASONING TERMINAL */}
           <div className="border border-white/10 bg-black flex flex-col">
              <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/[0.02]">
                 <Terminal className="w-4 h-4 text-white/40" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Reasoning Terminal [thinking_process]</span>
              </div>
              <div className="p-6 h-[300px] overflow-y-auto font-mono text-[12px] leading-relaxed text-emerald-400 whitespace-pre-wrap custom-scrollbar">
                 {terminalText || <span className="opacity-30">Waiting for inference execution...</span>}
                 {isProcessing && <span className="animate-pulse">_</span>}
                 <div ref={terminalEndRef} />
              </div>
           </div>

           {/* PUNISHMENT DELTA REPORT */}
           <div className="border border-white/10 bg-white/[0.02] flex flex-col">
              <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/[0.02]">
                 <Activity className="w-4 h-4 text-white/40" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Punishment Delta Report</span>
              </div>
              <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                 {!result ? (
                   <div className="h-full flex items-center justify-center opacity-20">
                      <span className="text-[10px] font-black uppercase tracking-widest">No Delta Detected</span>
                   </div>
                 ) : (
                   <div className="space-y-4">
                      {result.deltas.map((delta, i) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          key={i} 
                          className={`p-5 border-l-[4px] bg-black/50 border ${delta.type === 'new' ? 'border-l-primary-container border-white/5' : delta.type === 'increased' ? 'border-l-red-500 border-white/5' : 'border-l-white/20 border-white/5'}`}
                        >
                           <div className="flex items-center gap-3 mb-2">
                              {delta.type === 'new' && <Code2 className="w-4 h-4 text-primary-container" />}
                              {delta.type === 'increased' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                              {delta.type === 'unchanged' && <CheckCircle2 className="w-4 h-4 text-white/40" />}
                              <span className={`text-[11px] font-black uppercase tracking-widest ${delta.type === 'new' ? 'text-primary-container' : delta.type === 'increased' ? 'text-red-500' : 'text-white/60'}`}>
                                {delta.label}
                              </span>
                           </div>
                           <p className="text-[13px] text-white/70 font-medium font-body leading-relaxed pl-7">
                              {delta.description}
                           </p>
                        </motion.div>
                      ))}
                   </div>
                 )}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
