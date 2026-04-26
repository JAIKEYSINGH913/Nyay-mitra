"use client";
import { motion, useAnimation, Variants } from "framer-motion";
import { useEffect } from "react";

export default function BridgeAnimation() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const pathVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 3, ease: "easeInOut", delay: 0.2 },
    },
  };

  const particleCount = 15;

  return (
    <div className="w-full h-full flex items-center justify-center relative group p-10">
      <svg
        viewBox="0 0 800 400"
        className="w-full h-auto max-w-[600px] overflow-visible"
      >
        <defs>
          <linearGradient id="bridgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary-container)" />
            <stop offset="100%" stopColor="var(--secondary-container)" />
          </linearGradient>
          <filter id="subtleGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* The PARABOLIC Bridge - SLIGHTLY THINNER & MORE FADED */}
        <motion.path
          d="M 150 250 Q 400 80 650 250"
          fill="none"
          stroke="url(#bridgeGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          filter="url(#subtleGlow)"
          opacity="0.6"
        />
        
        {/* Faded Support Path */}
        <motion.path
          d="M 150 260 Q 400 90 650 260"
          fill="none"
          stroke="var(--primary-container)"
          strokeOpacity="0.05"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Flowing Data Stream Packets */}
        {Array.from({ length: particleCount }, (_, i) => (
          <motion.circle
            key={i}
            r="2"
            fill="white"
            filter="url(#subtleGlow)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{
              offsetDistance: ["0%", "100%"],
              opacity: [0, 0.8, 0.8, 0]
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ offsetPath: "path('M 150 250 Q 400 80 650 250')" }}
          />
        ))}

        {/* Minimal Displacement Markers */}
        <motion.circle cx="150" cy="250" r="4" fill="var(--primary-container)" opacity="0.4" />
        <motion.circle cx="650" cy="250" r="4" fill="var(--secondary-container)" opacity="0.4" />
        
        <text x="150" y="285" textAnchor="middle" fill="var(--primary-container)" fontSize="12" fontWeight="900" fontFamily="var(--font-label)" opacity="0.3">IPC</text>
        <text x="650" y="285" textAnchor="middle" fill="var(--secondary-container)" fontSize="12" fontWeight="900" fontFamily="var(--font-label)" opacity="0.3">BNS</text>
      </svg>
    </div>
  );
}
