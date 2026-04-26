"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JusticeLogo } from "./JusticeLogo";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleShowLoading = () => {
      setLoading(true);
      setProgress(0);
      document.body.style.overflow = "hidden";
      
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 5;
        if (currentProgress >= 100) {
          currentProgress = 100;
          setProgress(100);
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            document.body.style.overflow = "auto";
          }, 800);
        } else {
          setProgress(currentProgress);
        }
      }, 50);
    };

    window.addEventListener("showLoading", handleShowLoading);
    
    // Initial load
    document.body.style.overflow = "hidden";
    const initialInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(initialInterval);
          setTimeout(() => {
            setLoading(false);
            document.body.style.overflow = "auto";
          }, 800);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => {
      window.removeEventListener("showLoading", handleShowLoading);
      clearInterval(initialInterval);
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[10000] bg-bg-primary/95 backdrop-blur-2xl flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Intense backdrop blur and grid overlay */}
          <div className="absolute inset-0 z-[-1] bg-bg-primary" />
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
               style={{ backgroundImage: "radial-gradient(var(--primary-container) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          
          <div className="relative flex flex-col items-center max-w-[90vw] text-center">
            {/* The Animated Justice Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <JusticeLogo className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48" color="var(--primary-container)" />
            </motion.div>

            {/* Loading Metrics - Fully Responsive */}
            <div className="mt-8 md:mt-12 flex flex-col items-center gap-4 w-full">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-space text-[10px] sm:text-xs md:text-sm tracking-[0.5em] sm:tracking-[0.6em] text-primary-container font-black uppercase"
                >
                  INITIALIZING_SESSION
                </motion.span>
                <span className="font-mono text-[10px] sm:text-xs text-primary-container/60 opacity-80">
                  [{Math.floor(progress)}%]
                </span>
              </div>

              {/* Responsive Progress Bar */}
              <div className="w-48 sm:w-64 md:w-80 h-[2px] bg-border-color/30 relative overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                  className="absolute top-0 bottom-0 left-0 bg-primary-container shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                />
              </div>

              {/* Data Ratio readout */}
              <div className="font-mono text-[8px] sm:text-[9px] text-text-muted uppercase tracking-[0.2em] opacity-40">
                BOOT_RATIO: {Math.floor(progress * 1.24)}MB / 124MB
              </div>
            </div>

            {/* Responsive Industrial Readout */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 sm:mt-16 text-center"
            >
               <div className="font-mono text-[7px] sm:text-[8px] md:text-[10px] text-text-muted uppercase tracking-widest opacity-30 leading-relaxed max-w-[280px] sm:max-w-none">
                  SYSTEM_DOCKING: ACTIVE // SECTOR_ALPHA_04<br className="sm:hidden" />
                  CORE_INTEGRITY: 100% // NO_HALLUCINATION_DETECTED<br className="sm:hidden" />
                  LATENCY: 0.002MS // AUTH: SOVEREIGN
               </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
