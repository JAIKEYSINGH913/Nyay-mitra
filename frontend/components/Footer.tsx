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

export default function Footer() {
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
        <div className="flex items-center gap-10">
           <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-primary-container" />
              <span className="telemetry-label !text-[9px] opacity-50">LATENCY: 0.04MS</span>
           </div>
           <span className="telemetry-label !text-[9px] opacity-50 uppercase tracking-[0.3em]">ENCRYPTION: AES_256_SOVEREIGN</span>
        </div>
      </div>
    </footer>
  );
}
