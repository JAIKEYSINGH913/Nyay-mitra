"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  service: string;
  title: string;
  description: string;
  href: string;
  colorClass: string;
  delay: number;
  tags: string[];
}

export default function FeatureCard({
  icon,
  service,
  title,
  description,
  href,
  colorClass,
  delay,
  tags,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className="bg-[#1c1b1b] p-8 border-l border-border-color hover:border-primary-container transition-all duration-500 group flex flex-col justify-between h-full relative overflow-hidden"
    >
      {/* Background sweep animation on hover */}
      <motion.div 
         initial={{ x: "-100%" }}
         whileHover={{ x: "100%" }}
         transition={{ duration: 0.8, ease: "easeInOut" }}
         className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-container/5 to-transparent pointer-events-none"
      />

      <div className="relative z-10">
        {/* Service Header */}
        <div className="flex justify-between items-start mb-10">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-[#0e0e0e] border border-border-color group-hover:border-primary-container group-hover:bg-[#131313] transition-all">
               {icon}
             </div>
             <span className="telemetry-label text-primary-container font-black tracking-[.3em]">{service}</span>
          </div>
          <div className="flex flex-col items-end gap-1 opacity-20">
             <span className="telemetry-label !text-[8px]">REG_ID</span>
             <span className="font-space text-[10px] font-bold">OX_402</span>
          </div>
        </div>

        <h3 className="font-space text-3xl font-bold uppercase mb-6 leading-[0.9] group-hover:text-white transition-colors">
          {title}
        </h3>
        
        <p className="text-[#e7bdb8] opacity-60 text-base leading-relaxed mb-10 font-body group-hover:opacity-80 transition-opacity">
          {description}
        </p>

        {/* Tags - Animated list */}
        <div className="flex flex-wrap gap-2 mb-12">
          {tags.map((tag) => (
            <span
              key={tag}
              className="telemetry-label bg-[#0e0e0e] px-3 py-1.5 border border-border-color group-hover:border-white/10 !text-[9px] transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA - Industrial Button */}
      <Link href={href} className="mt-auto relative z-10">
        <motion.button 
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-5 border border-border-color font-space text-[12px] font-bold uppercase tracking-[0.3em] hover:bg-primary-container hover:text-white group-hover:border-primary-container transition-all flex items-center justify-center gap-3"
        >
          INITIALIZE_MODULE <ArrowUpRight className="w-4 h-4" />
        </motion.button>
      </Link>
    </motion.div>
  );
}
