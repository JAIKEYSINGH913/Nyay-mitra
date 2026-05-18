"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { JusticeLogo } from "./JusticeLogo";
import { 
  Terminal, 
  Shield, 
  Activity, 
  Cpu, 
  Zap,
  Lock,
  Globe
} from "lucide-react";
import { useTelemetry } from "./TelemetryProvider";
import { useState } from "react";
import SystemReportGenerator from "./SystemReportGenerator";

export default function Footer() {
  const telemetry = useTelemetry();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [visitorCount, setVisitorCount] = useState(12458);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const res = await fetch("https://api.counterapi.dev/v1/nyaymitra/visitor_count");
        const data = await res.json();
        if (data && data.count) {
          setVisitorCount(12450 + data.count);
        }
      } catch (err) {
        console.warn("Visitor counter API fallback:", err);
        const localCount = localStorage.getItem("nyay_visitors");
        const count = localCount ? parseInt(localCount, 10) + 1 : 12459;
        localStorage.setItem("nyay_visitors", count.toString());
        setVisitorCount(count);
      }
    };
    fetchVisitorCount();
  }, []);

  return (
    <footer className="bg-bg-primary py-24 md:py-32 px-10 border-t border-border-color transition-colors relative overflow-hidden">
      {/* Clean Industrial Background */}
      <div className="absolute inset-0 z-0 bg-bg-primary/50 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-20 relative z-10">
        {/* Brand Column */}
        <div className="md:col-span-5">
          <Link href="/" className="flex items-center gap-6 mb-10 group">
            <JusticeLogo className="w-12 h-12 group-hover:rotate-[360deg] transition-all duration-1000" />
            <div className="flex flex-col">
              <span className="font-space text-3xl font-black tracking-tighter text-text-primary uppercase leading-none">
                NYAY-MITRA
              </span>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                <span className="telemetry-label !text-[9px] opacity-60">BUILD_SESSION: 4.02.1_STABLE</span>
              </div>
            </div>
          </Link>
          <p className="text-text-secondary opacity-70 text-lg leading-relaxed max-w-md mb-12 font-medium">
            The next-generation computational environment for Indian Law. Engineered for precision, speed, and data sovereignty in the IPC-BNS transition era.
          </p>
          <div className="flex gap-5">
            {[
              { icon: <Activity className="w-5 h-5" />, label: "ACTIVITY" },
              { icon: <Globe className="w-5 h-5" />, label: "GLOBE" },
              { icon: <Shield className="w-5 h-5" />, label: "SHIELD" }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="w-12 h-12 bg-bg-surface-low border border-border-color flex items-center justify-center hover:bg-primary-container hover:text-white transition-all cursor-pointer rounded-none shadow-sm"
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                {item.icon}
              </motion.div>
            ))}
          </div>
        </div>

        {/* OPERATIONS COLUMN */}
        <div className="md:col-span-2">
          <h5 className="telemetry-label text-primary-container mb-10 font-black flex items-center gap-2">
            <Zap className="w-4 h-4" /> Operations
          </h5>
          <ul className="flex flex-col gap-6">
            {["Nyay-Graph", "Nyay-Vani", "Nyay-Bridge", "Nyay-Audit"].map((link) => (
              <li key={link}>
                <Link href="#" className="font-space text-[12px] font-bold tracking-[0.1em] text-text-secondary hover:text-primary-container transition-all uppercase block">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* PROTOCOLS COLUMN */}
        <div className="md:col-span-2">
          <h5 className="telemetry-label text-secondary-container mb-10 font-black flex items-center gap-2">
            <Lock className="w-4 h-4" /> Protocols
          </h5>
          <ul className="flex flex-col gap-6">
            {["Sovereign_Identity", "Encryption_L3", "API_Terminal", "Node_Sync"].map((link) => (
              <li key={link}>
                <Link href="#" className="font-space text-[12px] font-bold tracking-[0.1em] text-text-secondary hover:text-secondary-container transition-all uppercase block">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* INFRASTRUCTURE COLUMN */}
        <div className="md:col-span-3">
          <h5 className="telemetry-label text-text-primary mb-10 font-black flex items-center gap-2">
            <Globe className="w-4 h-4" /> Infrastructure
          </h5>
          <div className="p-6 bg-bg-surface-low border border-border-color rounded-none">
             <div className="flex items-center justify-between mb-4">
                <span className="telemetry-label !text-[8px]">GRID_STATUS</span>
                <span className="telemetry-label !text-[8px] text-primary-container">OPERATIONAL</span>
             </div>
             <div className="w-full h-1 bg-bg-surface-high mb-6">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "94%" }}
                  className="h-full bg-primary-container"
                />
             </div>
             <div className="font-mono text-[10px] text-text-muted leading-tight">
                UPTIME: 99.998%<br />
                REGION: IN_WEST_ALPHA<br />
                NODES: 1,244,012
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-border-color flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4">
           <span className="telemetry-label !text-[10px] opacity-40 font-black">© 2026 NYAY-MITRA // INDUSTRIAL_COMPUTING</span>
        </div>
        <div className="flex items-center gap-6 md:gap-10 flex-wrap justify-end">
           {/* Live Visitor Counter Widget */}
           <div className="flex items-center gap-2 bg-bg-surface-low border border-border-color px-4 py-2.5 rounded-none shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-space text-[10px] font-bold tracking-[0.2em] text-text-secondary uppercase flex items-center gap-2">
                 PAGE_VISITORS: <span className="text-primary-container font-mono text-xs font-black bg-black/40 px-2 py-0.5 border border-white/10">{visitorCount.toLocaleString()}</span>
              </span>
           </div>

           <div className="relative">
             <button 
               onClick={() => setShowBreakdown(!showBreakdown)}
               className="flex items-center gap-2 hover:bg-white/5 p-2 rounded transition-colors group"
             >
                <Activity className={`w-3 h-3 ${telemetry.trt > 2000 ? 'text-amber-500' : 'text-primary-container'}`} />
                <span className={`telemetry-label !text-[9px] font-bold ${telemetry.trt > 2000 ? 'text-amber-500' : 'text-white/50 group-hover:text-white'}`}>
                  TRT (LATENCY): {telemetry.trt}ms
                </span>
             </button>

             {/* Component Breakdown Popover */}
             {showBreakdown && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="absolute bottom-full right-0 mb-4 w-64 bg-black border border-white/10 shadow-2xl p-4 z-50 pointer-events-none"
               >
                 <span className="text-[9px] font-black uppercase text-white/30 block mb-3 border-b border-white/10 pb-2 tracking-[0.2em]">
                   Telemetry Breakdown
                 </span>
                 <div className="space-y-3">
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] font-mono text-white/70">STT/Translation</span>
                     <span className="text-[10px] font-bold text-white">{telemetry.latencyBreakdown.stt}ms</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] font-mono text-white/70">Graph Query</span>
                     <span className="text-[10px] font-bold text-emerald-400">{telemetry.latencyBreakdown.graph}ms</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] font-mono text-white/70">AI Reasoning</span>
                     <span className="text-[10px] font-bold text-primary-container">{telemetry.latencyBreakdown.ai}ms</span>
                   </div>
                 </div>
               </motion.div>
             )}
           </div>
           <span className="telemetry-label !text-[9px] opacity-50 uppercase tracking-[0.3em] hidden sm:inline">ENCRYPTION: AES_256_SOVEREIGN</span>
        </div>
      </div>
      <SystemReportGenerator />
    </footer>
  );
}
