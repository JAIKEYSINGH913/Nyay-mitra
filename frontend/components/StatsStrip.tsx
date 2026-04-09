"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { Activity, BarChart3, Database, Globe } from "lucide-react";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  color: string;
  icon: React.ReactNode;
}

const stats: StatItem[] = [
  { 
    value: 51, 
    suffix: "M+", 
    label: "Pending Cases In India", 
    color: "#e01e22", 
    icon: <Database className="w-4 h-4 text-primary-container" /> 
  },
  { 
    value: 511, 
    suffix: "", 
    label: "IPC→BNS Mappings (SMP-4)", 
    color: "#0043eb", 
    icon: <Activity className="w-4 h-4 text-secondary-container" /> 
  },
  { 
    value: 94.2, 
    suffix: "%", 
    label: "Audit Veracity Accuracy", 
    color: "#e01e22", 
    icon: <BarChart3 className="w-4 h-4 text-primary-container" /> 
  },
  { 
    value: 22, 
    suffix: "+", 
    label: "Multilingual Access Layers", 
    color: "#0043eb", 
    icon: <Globe className="w-4 h-4 text-secondary-container" /> 
  },
];

function CountUp({ to, suffix, duration = 3 }: { to: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = to / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {to % 1 === 0 ? Math.floor(count) : count.toFixed(1)}{suffix}
    </span>
  );
}

export default function StatsStrip() {
  return (
    <section className="bg-[#0e0e0e] border-y border-white/5 py-24 px-6 relative overflow-hidden group">
      {/* Background sweep animation */}
      <motion.div 
         initial={{ x: "-100%" }}
         whileInView={{ x: "100%" }}
         transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
         className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-container/2 to-transparent pointer-events-none"
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      {stat.icon}
                      <span className="telemetry-label !text-muted tracking-widest">{stat.label}</span>
                   </div>
                   <div className="telemetry-label !text-[8px] opacity-20">RT_SCANNER</div>
                </div>

                <div className="h-[2px] w-full bg-[#1c1b1b] relative overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     whileInView={{ width: "100%" }}
                     viewport={{ once: true }}
                     transition={{ duration: 2, delay: i * 0.15 + 0.5, ease: "easeInOut" }}
                     className="h-full relative z-10" 
                     style={{ background: stat.color }}
                   />
                   {/* Scanning micro-accent */}
                   <motion.div 
                     animate={{ x: ["-100%", "400%"] }}
                     transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}
                     className="absolute inset-0 bg-white/40 h-full w-20 z-20 opacity-30" 
                   />
                </div>
              </div>

              <div className="flex items-end gap-3 font-space">
                <div className="text-5xl lg:text-6xl font-bold tracking-tighter leading-none" style={{ color: "var(--text-primary)" }}>
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </div>
                <div className="telemetry-label !text-muted pb-1">MEASURED_STABILITY</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
