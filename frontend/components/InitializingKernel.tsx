"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InitializingKernel() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 1000); // 1s delay for punchy transition
          return 100;
        }
        return prev + 0.8; // Slower, more intentional loading
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[200] bg-bg-primary flex flex-col items-center justify-center transition-colors"
        >
          <div className="relative mb-12">
            {/* Deterministic Pulse Logo */}
            <motion.svg
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32" viewBox="0 0 40 40" fill="none"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d="M20 5V35M20 5L10 15M20 5L30 15" stroke="var(--primary-container)" strokeWidth="2" strokeLinecap="round"
              />
              <motion.circle
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                cx="10" cy="18" r="4" fill="#FFD700"
              />
              <motion.circle
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }}
                cx="30" cy="18" r="4" fill="#FFD700"
              />
              <path d="M10 22C10 26 14.4772 30 20 30C25.5228 30 30 26 30 22" stroke="#FFD700" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
            </motion.svg>

            {/* Ambient Pulse Glow */}
            <div className="absolute inset-0 bg-primary-container/10 blur-[60px] animate-pulse -z-10" />
          </div>

          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="w-1.5 h-4 bg-primary-container" />
              <h2 className="font-space text-sm font-black tracking-[0.5em] text-white uppercase">INITIALIZING_SYSCALL_KERNEL</h2>
            </div>

            <div className="w-64 h-[1px] bg-white/5 relative overflow-hidden">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-container to-transparent w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="telemetry-label !text-[8px] opacity-40 uppercase tracking-widest">BOOT_PROGRESS: {Math.floor(progress)}%</span>
              <span className="telemetry-label !text-[7px] opacity-20 uppercase">CHECKING_NEO4J_LINK // BHASHINI_BRIDGE_OK</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
