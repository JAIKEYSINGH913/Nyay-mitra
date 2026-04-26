"use client";
import React from "react";
import { motion } from "framer-motion";
import { Construction, Terminal, Shield, Activity, Clock } from "lucide-react";

interface ServicePendingProps {
  title?: string;
  subtitle?: string;
}

export default function ServicePending({ 
  title = "SERVICE_PENDING", 
  subtitle = "Protocol Initialization in Progress" 
}: ServicePendingProps) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-10 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container/20 to-transparent" />
        <div className="grid grid-cols-10 h-full w-full">
           {Array.from({ length: 100 }).map((_, i) => (
             <div key={i} className="border-[0.5px] border-white/5" />
           ))}
        </div>
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-primary-container/10 border border-primary-container/30 flex items-center justify-center mx-auto mb-10"
        >
          <Construction className="w-10 h-10 text-primary-container animate-pulse" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" />
            <span className="font-space text-[10px] tracking-[0.4em] text-white uppercase font-black">System_Status: Hydrating</span>
          </div>
          
          <h1 className="font-space text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
            {title}
          </h1>
          
          <p className="font-body text-white/50 text-lg md:text-xl mb-12 leading-relaxed">
            {subtitle}. We are currently mapping the neural legal nodes for this module. Sovereignty takes precision.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-40">
             {[
               { icon: <Terminal />, label: "KERNEL" },
               { icon: <Shield />, label: "VAULT" },
               { icon: <Activity />, label: "TELEMETRY" },
               { icon: <Clock />, label: "QUEUE" }
             ].map((item, i) => (
               <div key={i} className="flex flex-col items-center gap-2">
                  <div className="p-3 border border-white/20">{item.icon}</div>
                  <span className="font-space text-[8px] tracking-widest">{item.label}</span>
               </div>
             ))}
          </div>
        </motion.div>

        <motion.button
          onClick={() => window.location.href = "/"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-16 px-10 py-4 bg-white text-black font-space font-black text-xs tracking-[0.3em] uppercase hover:bg-primary-container hover:text-white transition-all"
        >
          RETURN_TO_COCKPIT
        </motion.button>
      </div>
    </div>
  );
}
