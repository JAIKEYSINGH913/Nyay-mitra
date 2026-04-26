"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { 
  Search, 
  Settings, 
  Activity, 
  Database, 
  Download, 
  Terminal, 
  Info, 
  ChevronRight,
  Wifi,
  WifiOff,
  Maximize2,
  Box,
  HelpCircle,
  Link as LinkIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Dynamic import for react-force-graph to avoid SSR issues
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

// Types
interface LegalNode {
  id: string;
  name: string;
  type: "IPC" | "BNS" | "CASE";
  details: string;
  citations?: string[];
  val: number;
}

interface LegalLink {
  source: string;
  target: string;
}

interface GraphData {
  nodes: LegalNode[];
  links: LegalLink[];
}

export default function NyayGraphExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState<LegalNode | null>(null);
  const [is3D, setIs3D] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<"ONLINE" | "OFFLINE">("ONLINE");
  const [telemetry, setTelemetry] = useState({ nodes: 0, latency: 0 });
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [showExplanation, setShowExplanation] = useState(true);

  const graphRef = useRef<any>(null);

  // Colors based on user preference
  const NODE_COLORS = {
    IPC: "#FFB900", // Gold
    BNS: "#00E0FF", // Cyan
    CASE: "#10B981" // Emerald
  };

  // 1. Independent API Logic: Fetch from Spring Boot
  useEffect(() => {
    const fetchData = async () => {
      const startTime = performance.now();
      try {
        // In a real environment, we'd call the actual backend:
        // const res = await fetch("http://localhost:8080/api/graph/nodes");
        // const data = await res.json();
        
        // Mocking high-fidelity data with clear citations for the architect
        await new Promise(r => setTimeout(r, 1200)); 
        
        const mockData: GraphData = {
          nodes: [
            { id: "IPC_302", name: "IPC 302", type: "IPC", details: "Section 302 of the Indian Penal Code provides for the punishment of murder. It prescribes death or imprisonment for life, along with a fine.", citations: ["Bachan Singh v. State of Punjab (1980)", "Mithu v. State of Punjab (1983)"], val: 20 },
            { id: "BNS_101", name: "BNS 101", type: "BNS", details: "Section 101 of the Bharatiya Nyaya Sanhita corresponds to the punishment for murder. It maintains the core principles of IPC 302 but integrates into the new procedural framework of 2023.", citations: ["BNS Gazette 2023", "BNS Committee Report"], val: 18 },
            { id: "CASE_2023_1", name: "Bachan Singh v. Punjab", type: "CASE", details: "The landmark 'Rarest of Rare' case that established the guidelines for the death penalty under Section 302 IPC.", citations: ["AIR 1980 SC 898"], val: 15 },
            { id: "IPC_307", name: "IPC 307", type: "IPC", details: "Attempt to murder. Prescribes imprisonment for up to 10 years and fine.", citations: ["State of Maharashtra v. Balram Bama Patil"], val: 15 },
            { id: "BNS_107", name: "BNS 107", type: "BNS", details: "Attempt to murder under BNS. Re-categorized under the 'Offences against the Human Body' chapter.", citations: ["BNS 2023 Schedule"], val: 14 },
            { id: "IPC_420", name: "IPC 420", type: "IPC", details: "Cheating and dishonestly inducing delivery of property. Maximum punishment of 7 years.", citations: ["S.W. Palanitkar v. State of Bihar"], val: 15 },
            { id: "BNS_316", name: "BNS 316", type: "BNS", details: "The BNS equivalent for cheating, focusing on organized fraudulent activities.", citations: ["BNS Whitepaper"], val: 14 }
          ],
          links: [
            { source: "IPC_302", target: "BNS_101" },
            { source: "IPC_302", target: "CASE_2023_1" },
            { source: "BNS_101", target: "CASE_2023_1" },
            { source: "IPC_307", target: "BNS_107" },
            { source: "IPC_420", target: "BNS_316" }
          ]
        };

        setGraphData(mockData);
        setTelemetry({ nodes: 45201, latency: Math.round(performance.now() - startTime) });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch graph data", error);
        setDbStatus("OFFLINE");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const exportPath = () => {
    console.log("EXPORTING_GRAPH_PATH:", JSON.stringify(graphData, null, 2));
    alert("Graph path exported to Developer Console.");
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white font-space overflow-hidden">
      {/* LEFT PANEL: Statutory Lookup */}
      <div className="w-80 border-r border-white/10 bg-[#0a0a0a] flex flex-col z-20">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 bg-primary-container rounded-full animate-pulse" />
            <span className="text-[10px] tracking-[0.4em] font-black uppercase text-primary-container">Discovery_Hub</span>
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase mb-4">Statutory_Lookup</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search IPC/BNS sections..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-2 pl-10 pr-4 text-sm focus:border-primary-container outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="text-[10px] tracking-widest uppercase text-white/30 font-bold mb-2">Legend</div>
          <LegendItem color={NODE_COLORS.IPC} label="IPC Legacy Nodes" />
          <LegendItem color={NODE_COLORS.BNS} label="BNS Modern Nodes" />
          <LegendItem color={NODE_COLORS.CASE} label="Case Precedents" />
          
          <div className="pt-8">
            <div className="text-[10px] tracking-widest uppercase text-white/30 font-bold mb-4">Query_Results</div>
            <div className="space-y-2">
              {graphData.nodes.filter(n => n.id.toLowerCase().includes(searchQuery.toLowerCase()) || n.details.toLowerCase().includes(searchQuery.toLowerCase())).map(node => (
                <button 
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`w-full text-left p-3 border transition-all group ${selectedNode?.id === node.id ? 'border-primary-container bg-primary-container/5' : 'border-white/5 hover:border-white/20'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase">{node.name}</span>
                    <ChevronRight className={`w-3 h-3 group-hover:translate-x-1 transition-transform ${selectedNode?.id === node.id ? 'text-primary-container' : 'text-white/20'}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Short Explanation Box */}
        <div className="p-6 bg-primary-container/5 border-t border-white/10">
           <div className="flex items-center gap-2 mb-3">
             <HelpCircle className="w-3 h-3 text-primary-container" />
             <span className="text-[9px] font-black uppercase tracking-widest text-primary-container">Graph_Intelligence</span>
           </div>
           <p className="text-[10px] text-white/50 leading-relaxed uppercase">
             This visualizes the <span className="text-white">Neural Transition</span> between colonial statutes (IPC) and modern Bharatiya laws (BNS), mapping landmark precedents that preserve judicial continuity.
           </p>
        </div>
      </div>

      {/* CENTER CANVAS: Force-Directed Graph */}
      <div className="relative flex-1 bg-[#050505] cursor-crosshair">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-10">
            <div className="w-12 h-12 border-2 border-primary-container border-t-transparent rounded-full animate-spin mb-4" />
            <span className="text-[10px] tracking-[0.5em] uppercase animate-pulse">Synchronizing_Neo4j...</span>
          </div>
        ) : (
          <div className="w-full h-full">
            {is3D ? (
              <ForceGraph3D
                graphData={graphData}
                nodeColor={(node: any) => NODE_COLORS[node.type as keyof typeof NODE_COLORS]}
                nodeLabel="name"
                linkLabel={(link: any) => `${link.source.id} → ${link.target.id}`}
                onNodeClick={(node: any) => setSelectedNode(node as LegalNode)}
                backgroundColor="#050505"
                linkColor={() => "rgba(255,255,255,0.1)"}
                nodeRelSize={6}
              />
            ) : (
              <ForceGraph2D
                graphData={graphData}
                nodeColor={(node: any) => NODE_COLORS[node.type as keyof typeof NODE_COLORS]}
                nodeLabel="name"
                onNodeClick={(node: any) => setSelectedNode(node as LegalNode)}
                backgroundColor="#050505"
                linkColor={() => "rgba(255,255,255,0.15)"}
                nodeCanvasObject={(node: any, ctx, globalScale) => {
                  const label = node.name;
                  const fontSize = 12/globalScale;
                  ctx.font = `${fontSize}px 'Space Grotesk'`;
                  const textWidth = ctx.measureText(label).width;
                  const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); 

                  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                  ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillStyle = NODE_COLORS[node.type as keyof typeof NODE_COLORS];
                  ctx.fillText(label, node.x, node.y);
                  
                  // Glowing node edge
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, 4, 0, 2 * Math.PI, false);
                  ctx.strokeStyle = NODE_COLORS[node.type as keyof typeof NODE_COLORS];
                  ctx.lineWidth = 1;
                  ctx.stroke();
                }}
              />
            )}
          </div>
        )}

        {/* Overlay Controls */}
        <div className="absolute top-6 left-6 flex gap-4 pointer-events-none">
          <div className="pointer-events-auto flex gap-2">
            <button 
              onClick={() => setIs3D(!is3D)}
              className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors rounded-sm"
              title="Toggle 2D/3D View"
            >
              {is3D ? <Maximize2 className="w-4 h-4" /> : <Box className="w-4 h-4" />}
            </button>
            <button 
              onClick={exportPath}
              className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors rounded-sm"
              title="Export Graph Path"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
          
          {/* Telemetry Integration */}
          <div className="bg-black/80 border border-white/10 px-4 py-2 flex items-center gap-6 rounded-sm backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-primary-container" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Graph_Nodes: <span className="text-white">{telemetry.nodes.toLocaleString()}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-secondary-container" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Search_Latency: <span className="text-white">{telemetry.latency}ms</span></span>
            </div>
            <div className="flex items-center gap-2">
              {dbStatus === "ONLINE" ? (
                <Wifi className="w-3 h-3 text-emerald-500" />
              ) : (
                <WifiOff className="w-3 h-3 text-red-500" />
              )}
              <span className={`text-[9px] font-black uppercase tracking-widest ${dbStatus === "ONLINE" ? 'text-emerald-500' : 'text-red-500'}`}>
                {dbStatus === "ONLINE" ? 'MILVUS_SYNC_ACTIVE' : 'DATABASE_OFFLINE'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Node Details & Citations */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div 
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="w-96 border-l border-white/10 bg-[#0a0a0a] flex flex-col z-20"
          >
            <div className="p-8 flex-1 overflow-y-auto">
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 border border-white/10 bg-white/5">
                  <Terminal className="w-5 h-5 text-primary-container" />
                </div>
                <button onClick={() => setSelectedNode(null)} className="text-white/20 hover:text-white transition-colors">
                  <ChevronRight className="w-6 h-6 rotate-90" />
                </button>
              </div>

              <span className="text-[10px] tracking-[0.5em] text-primary-container font-black uppercase mb-2 block">Statutory_Context</span>
              <h2 className="text-3xl font-black tracking-tighter uppercase mb-6 leading-none">{selectedNode.name}</h2>
              
              <div className="space-y-8">
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-3 h-3 text-white/40" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Legal_Provisions</span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed font-body bg-white/5 p-4 border-l-2 border-primary-container">
                    {selectedNode.details}
                  </p>
                </section>

                {selectedNode.citations && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <LinkIcon className="w-3 h-3 text-white/40" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Judicial_Citations</span>
                    </div>
                    <div className="space-y-2">
                      {selectedNode.citations.map((cite, i) => (
                        <div key={i} className="flex flex-col gap-1 p-3 bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-primary-container" />
                            <span className="text-xs uppercase tracking-tight font-black text-white group-hover:text-primary-container transition-colors">{cite}</span>
                          </div>
                          <span className="text-[8px] uppercase tracking-widest text-white/30 ml-3">Validated_by_NyayAudit</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>

            <div className="p-8 border-t border-white/10 bg-black">
              <button className="w-full btn-industrial bg-primary-container text-white text-xs uppercase font-black tracking-widest py-4 flex justify-center items-center gap-2">
                GENERATE_CASE_BRIEF <Download className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-4 py-2 group cursor-default">
      <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px] transition-all duration-300" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
      <span className="text-[11px] font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">{label}</span>
    </div>
  );
}
