"use client";
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { 
  Search, Activity, Database, Download, Terminal, 
  Wifi, WifiOff, X, Cpu, ShieldCheck, Zap, Layers,
  FileText, ArrowLeft, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNeuralContext } from "@/components/NeuralProvider";
import toast from "react-hot-toast";
import * as THREE from "three";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

interface LegalNode { id: string; name: string; type: string; details: string; citations?: string[]; val: number; }
interface LegalLink { source: string; target: string; }
interface GraphData { nodes: LegalNode[]; links: LegalLink[]; }

const SEARCH_EXAMPLES = [
  { label: "IPC 302", desc: "Murder" },
  { label: "IPC 420", desc: "Cheating" },
  { label: "IPC 307", desc: "Attempt to Murder" },
  { label: "BNS 101", desc: "Murder (New)" },
];

export default function NyayGraphExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState<LegalNode | null>(null);
  const [is3D, setIs3D] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<"ONLINE" | "OFFLINE">("ONLINE");
  const [telemetry, setTelemetry] = useState({ nodes: 0, latency: 0 });
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [advisory, setAdvisory] = useState<any>(null);
  const router = useRouter();
  const { state } = useNeuralContext();

  const NODE_COLORS: Record<string, string> = { IPC: "#FFB900", BNS: "#00F3FF", CASE: "#FF0055" };
  const fgRef = useRef<any>(null);

  useEffect(() => {
    if (is3D && fgRef.current) {
      const scene = fgRef.current.scene();
      const grid = new THREE.GridHelper(1000, 100, 0x00F3FF, 0x111111);
      grid.position.y = -200;
      grid.material.opacity = 0.15;
      grid.material.transparent = true;
      scene.add(grid);
    }
  }, [is3D]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = searchQuery 
          ? `http://localhost:8004/api/graph/search?q=${encodeURIComponent(searchQuery)}`
          : `http://localhost:8004/api/graph/data`;
        const graphRes = await fetch(url);
        const data = await graphRes.json();
        setGraphData(data);
        setTelemetry(prev => ({ ...prev, nodes: data.nodes.length }));
      } catch (error) {
        console.error("Graph fetch error:", error);
      }
      setLoading(false);
    };
    const debounceTimer = setTimeout(fetchData, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const statusRes = await fetch(`http://localhost:8004/api/graph/check`);
        const status = await statusRes.json();
        setDbStatus(status.neo4j?.status === "ONLINE" ? "ONLINE" : "OFFLINE");
      } catch { setDbStatus("OFFLINE"); }
    };
    fetchStatus();
  }, []);

  const fetchAdvisory = async (node: LegalNode) => {
    setSelectedNode(node);
    setAdvisory(null);
    try {
      const res = await fetch(`http://localhost:8004/api/graph/advisory/${node.id}`);
      const data = await res.json();
      setAdvisory(data);
    } catch (e) {
      setAdvisory({
        advisory: `${node.name}: ${node.details}`,
        severity_level: "MODERATE",
        strategic_action: "Cross-verify with Nyay-Audit."
      });
    }
  };

  const generateDossier = () => {
    const dossierContent = `
NYAY-MITRA SOVEREIGN LEGAL DOSSIER
===================================
Generated: ${new Date().toLocaleString('en-IN')}
Session Hash: ${state.provenanceHash || 'STANDALONE'}

1. VOICE QUERY (Nyay-Vani)
   Original Query: ${state.activeQuery || 'Direct Graph Access'}

2. STATUTORY MAPPING (Nyay-Bridge)  
   Mapped BNS: ${state.mappedBNS || 'N/A'}

3. GRAPH DISCOVERY (Nyay-Graph)
   Nodes Discovered: ${graphData.nodes.length}
   Search Query: ${searchQuery || 'Full Network View'}
   
   Discovered Entities:
${graphData.nodes.map(n => `   - [${n.type}] ${n.name}: ${n.details?.substring(0, 100)}...`).join('\n')}

4. SELECTED NODE ADVISORY
   Node: ${selectedNode?.name || 'None selected'}
   Advisory: ${advisory?.advisory || 'N/A'}
   Severity: ${advisory?.severity_level || 'N/A'}
   Action: ${advisory?.strategic_action || 'N/A'}

===================================
DISCLAIMER: This is an AI-generated advisory. 
Consult qualified legal counsel for actionable decisions.
    `.trim();

    const blob = new Blob([dossierContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NyayMitra_Dossier_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Final Dossier exported successfully.");
  };

  return (
    <div className="min-h-screen bg-black text-white font-space pt-24 pb-20 px-6 md:px-10 overflow-x-hidden relative selection:bg-primary-container selection:text-black">
      
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none z-0">
        <h1 className="text-[14vw] font-black tracking-tighter uppercase opacity-[0.03] leading-none select-none">NYAY-GRAPH</h1>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 pt-10">
        
        {/* HEADER & SEARCH */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-10 mb-10 border-b border-white/5 pb-10">
           <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-primary-container/10 border border-primary-container/20"><Layers className="w-4 h-4 text-primary-container" /></div>
                 <span className="text-[10px] font-black text-primary-container uppercase tracking-[0.4em]">NEURAL_NETWORK</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-4">
                 NYAY-<span className="text-primary-container">GRAPH</span>
              </h2>
              <p className="text-white/40 text-[12px] uppercase tracking-widest">STEP 04 OF 04 — 3D Neural Knowledge Discovery</p>
              <p className="text-white/30 text-[11px] mt-2 max-w-xl leading-relaxed">
                Search for any IPC/BNS section or case law. The graph dynamically shows related statutes, precedents, and their connections. Click any node for a full legal advisory and dossier.
              </p>
           </div>

           <div className="w-full lg:w-[450px] space-y-4">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary-container transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search: IPC 302, BNS 101, Murder..."
                  className="w-full bg-white/5 border border-white/10 rounded-none py-5 pl-14 pr-6 text-[12px] font-black uppercase tracking-widest focus:border-primary-container focus:bg-white/[0.08] outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* SEARCH CHIPS */}
              <div className="flex flex-wrap gap-2">
                {SEARCH_EXAMPLES.map((ex) => (
                  <button 
                    key={ex.label}
                    onClick={() => setSearchQuery(ex.label)}
                    className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-all ${searchQuery === ex.label ? 'bg-primary-container text-black border-primary-container' : 'bg-white/5 text-white/50 border-white/10 hover:border-primary-container/50 hover:text-white'}`}
                  >
                    {ex.label} <span className="text-white/30 ml-1">{ex.desc}</span>
                  </button>
                ))}
              </div>
           </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
           
           {/* LEFT: GRAPH (8 Cols) */}
           <div className="lg:col-span-8">
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="relative w-full aspect-[16/10] border border-white/10 bg-black shadow-[0_0_100px_rgba(0,243,255,0.05)] overflow-hidden rounded-none group"
              >
                 {loading ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
                      <div className="w-12 h-12 border-t-2 border-primary-container rounded-full animate-spin mb-6" />
                      <span className="text-[9px] font-black uppercase tracking-[0.6em] animate-pulse">Synchronizing_Neural_Core</span>
                   </div>
                 ) : graphData.nodes.length === 0 ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
                      <Database className="w-10 h-10 text-white/20 mb-4" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-white/30">No results found for "{searchQuery}"</span>
                      <span className="text-[9px] text-white/20 mt-2">Try a different search term or click an example chip above</span>
                   </div>
                 ) : (
                   <div className="w-full h-full relative">
                      {is3D ? (
                        <ForceGraph3D ref={fgRef} graphData={graphData}
                          nodeColor={(node: any) => NODE_COLORS[node.type] || "#888"}
                          nodeLabel="name" onNodeClick={(node: any) => fetchAdvisory(node as LegalNode)}
                          backgroundColor="#000000" linkColor={() => "rgba(255,255,255,0.05)"} nodeRelSize={8} showNavInfo={false}
                        />
                      ) : (
                        <ForceGraph2D graphData={graphData}
                          nodeColor={(node: any) => NODE_COLORS[node.type] || "#888"}
                          nodeLabel="name" onNodeClick={(node: any) => fetchAdvisory(node as LegalNode)}
                          backgroundColor="#000000" linkColor={() => "rgba(255,255,255,0.1)"}
                          nodeCanvasObject={(node: any, ctx, globalScale) => {
                            const label = node.name;
                            const fontSize = 16 / globalScale;
                            ctx.font = `900 ${fontSize}px 'Space Grotesk'`;
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillStyle = NODE_COLORS[node.type] || "#888";
                            ctx.fillText(label, node.x, node.y + 12);
                            ctx.beginPath(); ctx.rect(node.x - 4, node.y - 4, 8, 8); 
                            ctx.shadowBlur = 15; ctx.shadowColor = NODE_COLORS[node.type] || "#888";
                            ctx.fill(); ctx.shadowBlur = 0;
                          }}
                        />
                      )}

                      {/* TOP HUD */}
                      <div className="absolute top-6 left-6 pointer-events-none flex gap-4">
                         <div className="bg-black/60 border border-white/10 px-4 py-2 backdrop-blur-md">
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary-container">{is3D ? "SPATIAL_3D" : "PLANAR_2D"}</span>
                         </div>
                         <div className="bg-black/60 border border-white/10 px-4 py-2 backdrop-blur-md">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">NODES: <span className="text-white">{telemetry.nodes}</span></span>
                         </div>
                      </div>
                   </div>
                 )}
              </motion.div>
           </div>

           {/* RIGHT: CONTROLS & ANALYSIS (4 Cols) */}
           <div className="lg:col-span-4 space-y-6">
              
              {/* 2D/3D TOGGLE */}
              <div className="p-6 border border-white/10 bg-white/[0.02]">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 block mb-4">Discovery_Protocol</span>
                 <div className="relative h-12 bg-white/5 border border-white/5 p-1 flex">
                    <motion.div className="absolute top-1 bottom-1 bg-primary-container z-0" initial={false}
                      animate={{ left: is3D ? "50%" : "4px", right: is3D ? "4px" : "50%" }}
                    />
                    <button onClick={() => setIs3D(false)} className={`relative z-10 flex-1 text-[10px] font-black uppercase tracking-widest ${!is3D ? "text-black" : "text-white/40"}`}>Planar_2D</button>
                    <button onClick={() => setIs3D(true)} className={`relative z-10 flex-1 text-[10px] font-black uppercase tracking-widest ${is3D ? "text-black" : "text-white/40"}`}>Spatial_3D</button>
                 </div>
              </div>

              {/* NODE ANALYSIS / LEGEND */}
              <AnimatePresence mode="wait">
                {selectedNode ? (
                  <motion.div key="analysis" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    className="p-8 border border-white/10 bg-white/[0.04] border-r-[4px] border-r-primary-container"
                  >
                     <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-primary-container text-white"><Terminal className="w-5 h-5" /></div>
                        <button onClick={() => setSelectedNode(null)} className="text-white/20 hover:text-white"><X className="w-5 h-5" /></button>
                     </div>
                     <h3 className="text-2xl font-black tracking-tighter uppercase mb-4 leading-none">{selectedNode.name}</h3>
                     <p className="text-[12px] leading-relaxed text-white/60 mb-6 border-l-2 border-primary-container/30 pl-4">{selectedNode.details}</p>
                     
                     <div className="space-y-4 pt-4 border-t border-white/5">
                        <span className="text-[9px] font-black text-primary-container uppercase tracking-widest">AI_LEGAL_ADVISORY</span>
                        {advisory ? (
                           <div className="space-y-3">
                              <div className="p-4 bg-white/5 border-l-2 border-primary-container">
                                 <p className="text-[11px] leading-relaxed text-white/80 whitespace-pre-line">{advisory.advisory}</p>
                              </div>
                              <div className="flex justify-between items-center bg-primary-container/10 p-3">
                                 <span className="text-[9px] font-black uppercase">Severity: {advisory.severity_level}</span>
                              </div>
                              <div className="p-3 bg-white/5 border border-white/10">
                                 <span className="text-[8px] font-black uppercase text-white/40 block mb-1">STRATEGIC ACTION</span>
                                 <span className="text-[10px] text-primary-container font-bold">{advisory.strategic_action}</span>
                              </div>
                           </div>
                        ) : (
                           <div className="animate-pulse space-y-2 py-1">
                              <div className="h-2 bg-white/10 rounded"></div>
                              <div className="h-2 bg-white/10 rounded w-5/6"></div>
                           </div>
                        )}
                      </div>

                     <button onClick={generateDossier} className="w-full py-4 bg-primary-container text-black font-black uppercase tracking-widest text-[10px] mt-6 hover:bg-cyan-500 transition-all flex items-center justify-center gap-3">
                        <Download className="w-4 h-4" /> Export_Dossier
                     </button>
                  </motion.div>
                ) : (
                  <motion.div key="legend" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="p-8 border border-white/10 bg-white/[0.01] space-y-6"
                  >
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 block">Network_Signal_Legend</span>
                     <LegendItem color={NODE_COLORS.IPC} label="IPC_LEGACY" desc="Colonial Statutes" />
                     <LegendItem color={NODE_COLORS.BNS} label="BNS_MODERN" desc="Bharatiya Sanhita" />
                     <LegendItem color={NODE_COLORS.CASE} label="PRECEDENTS" desc="Verified Precedents" />
                     <div className="pt-4 border-t border-white/5 space-y-3">
                        <div className="flex items-center gap-3 opacity-30">
                           {dbStatus === "ONLINE" ? <Wifi className="w-4 h-4 text-emerald-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
                           <span className="text-[9px] font-black uppercase tracking-widest">NEO4J: {dbStatus}</span>
                        </div>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        {/* DESCRIPTIVE INSIGHTS */}
        {graphData.nodes.length > 0 && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-8 border border-primary-container/20 bg-primary-container/5"
          >
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-primary-container" />
              <span className="text-[11px] font-black uppercase tracking-widest text-primary-container">NEURAL DISCOVERY INSIGHTS</span>
            </div>
            <p className="text-[13px] leading-relaxed text-white/80 font-body">
              <strong className="text-white">Discovery Summary:</strong> The neural engine identified <span className="text-primary-container font-bold">{graphData.nodes.length} legal entities</span> and <span className="text-primary-container font-bold">{graphData.links.length} connections</span>.
              {searchQuery 
                ? ` Results for "${searchQuery}" include ${graphData.nodes.filter(n => n.type === 'IPC').length} IPC statutes, ${graphData.nodes.filter(n => n.type === 'BNS').length} BNS provisions, and ${graphData.nodes.filter(n => n.type === 'CASE').length} judicial precedents.`
                : " Showing the core statutory framework with all mapped IPC↔BNS transitions."
              }
            </p>
            <p className="text-[13px] leading-relaxed text-white/60 font-body mt-3">
              <strong className="text-white">How to use:</strong> Click any node to view its full legal advisory including risks, compliance requirements, and strategic recommendations. Use the Export Dossier button to download the complete analysis.
            </p>
          </motion.div>
        )}

        {/* FINAL DOSSIER GENERATION */}
        <div className="p-10 border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="space-y-2">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">MISSION_COMPLETE</span>
                  <h4 className="text-2xl font-black uppercase tracking-tighter">End of Judicial Analysis Cycle</h4>
                  <p className="text-white/40 text-[11px] leading-relaxed max-w-lg">
                    You have completed all 4 steps: Voice Intake → Statutory Mapping → Veracity Audit → Neural Discovery. Generate your final dossier or start a new analysis cycle.
                  </p>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => { setSearchQuery(""); setSelectedNode(null); setAdvisory(null); }} 
                    className="px-8 py-4 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">New Discovery</button>
                  <button onClick={generateDossier}
                    className="px-8 py-4 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-3">
                    <FileText className="w-4 h-4" /> Generate Final Dossier
                  </button>
               </div>
            </div>
         </div>

        {/* FOOTER */}
        <div className="mt-32 pb-20 border-t border-white/5 pt-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-16">
             <div className="font-space text-5xl md:text-[8rem] font-black tracking-tighter leading-none opacity-5 select-none uppercase">NYAY-MITRA</div>
             <div className="font-space text-[10px] tracking-widest opacity-30 uppercase font-bold mb-4">© 2026 Sovereign_Judicial_Engine</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label, desc }: { color: string, label: string, desc: string }) {
  return (
    <div className="flex items-center gap-6 p-4 bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all">
      <div className="w-3 h-3 shrink-0" style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}` }} />
      <div>
         <div className="text-[12px] font-black uppercase tracking-tight text-white/90">{label}</div>
         <div className="text-[9px] font-black uppercase tracking-widest text-white/20">{desc}</div>
      </div>
    </div>
  );
}
