"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ShieldCheck, Database, HardDrive, Cpu, Layers } from "lucide-react";

export default function TelemetryStrip() {
  const [metrics, setMetrics] = useState({
    status: "CONNECTING",
    veracity: 0,
    latency: "0ms",
    nodes: "0M",
    load: "0%",
  });

  useEffect(() => {
    // Simulate real-time metric updates from backend
    const interval = setInterval(() => {
      const isOnline = Math.random() > 0.05;
      setMetrics({
        status: isOnline ? "OPERATIONAL" : "DEGRADED",
        veracity: isOnline ? 98 + Math.random() * 2 : 0,
        latency: isOnline ? `${(12 + Math.random() * 5).toFixed(3)} MS` : "TIMEOUT",
        nodes: "4.2M_INDEXED",
        load: `${(20 + Math.random() * 10).toFixed(1)}%`,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-10 bg-[#0a0a0a] border-b border-white/5 flex items-center px-8 justify-between relative overflow-hidden font-space">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-2">
           <Activity className={`w-3.5 h-3.5 ${metrics.status === 'OPERATIONAL' ? 'text-primary-container' : 'text-red-500'} transition-colors`} />
           <span className="telemetry-label !text-[8.5px] uppercase flex items-center gap-2">
              STATUS: <span className={metrics.status === 'OPERATIONAL' ? 'text-primary-container' : 'text-red-500'}>{metrics.status}</span>
           </span>
        </div>
        
        <div className="flex items-center gap-2 border-l border-white/5 pl-10 h-full">
           <ShieldCheck className="w-3.5 h-3.5 text-secondary-container" />
           <span className="telemetry-label !text-[8.5px] uppercase">
              VERACITY: <span className="text-secondary-container">{metrics.veracity.toFixed(1)}% GROUNDED</span>
           </span>
        </div>
        
        <div className="flex items-center gap-2 border-l border-white/5 pl-10 h-full">
           <Cpu className="w-3.5 h-3.5 text-white/40" />
           <span className="telemetry-label !text-[8.5px] uppercase">
              SYSCALL_LATENCY: <span className="text-white/80">{metrics.latency}</span>
           </span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
           <Database className="w-3 h-3 text-white/20" />
           <span className="telemetry-label !text-[8.5px] uppercase opacity-40">MASTER_GRAPH_NODES: {metrics.nodes}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-sm border border-white/5">
           <Layers className="w-3 h-3 text-white/40" />
           <span className="telemetry-label !text-[8.5px] uppercase text-white/60">CPU_CORE: {metrics.load}</span>
        </div>
      </div>
      
      {/* Visual pulse indicator */}
      <motion.div 
         animate={{ opacity: [0.1, 0.3, 0.1] }}
         transition={{ duration: 2, repeat: Infinity }}
         className="absolute bottom-0 left-0 h-[1px] bg-primary-container w-[20%]"
      />
    </div>
  );
}
