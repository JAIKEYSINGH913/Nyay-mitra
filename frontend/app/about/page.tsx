"use client";
import React from "react";
import dynamic from "next/dynamic";
import AboutSection from "@/components/AboutSection";

const DynamicBackground = dynamic(() => import("@/components/DynamicBackground"), { ssr: false });

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg-primary overflow-x-hidden">
      <DynamicBackground />
      
      <div className="pt-24">
        <AboutSection />
      </div>

      {/* FOOTER WATERMARK */}
      <footer className="py-20 px-10 bg-black text-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-16 relative z-10">
            <div className="font-space text-5xl md:text-[10rem] font-black tracking-tighter leading-none opacity-5 hover:opacity-10 transition-opacity select-none">NYAY-MITRA</div>
            <div className="font-space text-[10px] tracking-widest opacity-30 uppercase font-bold mb-4">© 2026 Sovereign_Judicial_Engine</div>
         </div>
      </footer>
    </main>
  );
}
