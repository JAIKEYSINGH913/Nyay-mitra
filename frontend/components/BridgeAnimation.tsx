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
      transition: { duration: 1.5, ease: "easeInOut", delay: 0.5 },
    },
  };

  const particleCount = 12;

  return (
    <div className="w-full max-w-2xl mx-auto relative group">
      <svg
        viewBox="0 0 700 280"
        className="w-full h-auto overflow-visible"
      >
        <defs>
          <linearGradient id="bridgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e01e22" />
            <stop offset="100%" stopColor="#0043eb" />
          </linearGradient>
          <filter id="glow-red">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ground Line (Industrial) */}
        <motion.line
          x1="40" y1="240" x2="660" y2="240"
          stroke="rgba(229, 226, 225, 0.1)"
          strokeWidth="1"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Left Module - IPC 1860 */}
        <motion.rect
          x="60" y="60" width="100" height="180"
          fill="#131313"
          stroke="rgba(224, 30, 34, 0.3)"
          strokeWidth="1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group-hover:stroke-[#e01e22] transition-colors"
        />
        <rect x="60" y="60" width="100" height="4" fill="#e01e22" />
        
        <text x="110" y="95" textAnchor="middle" fill="#e01e22" fontSize="12" fontWeight="900" fontFamily="Space Grotesk">IPC_SYSTEM</text>
        <text x="110" y="115" textAnchor="middle" fill="white" fontSize="24" fontWeight="800" fontFamily="Space Grotesk">1860</text>
        
        {/* Telemetry data lines for left module */}
        {[140, 155, 170, 185, 200, 215].map((y, i) => (
          <motion.rect
            key={y}
            x="75" y={y} width={30 + Math.random() * 40} height="2"
            fill="rgba(224, 30, 34, 0.2)"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8 + i * 0.05 }}
          />
        ))}

        {/* Right Module - BNS 2023 */}
        <motion.rect
          x="540" y="60" width="100" height="180"
          fill="#131313"
          stroke="rgba(0, 67, 235, 0.3)"
          strokeWidth="1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group-hover:stroke-[#0043eb] transition-colors"
        />
        <rect x="540" y="60" width="100" height="4" fill="#0043eb" />
        
        <text x="590" y="95" textAnchor="middle" fill="#0043eb" fontSize="12" fontWeight="900" fontFamily="Space Grotesk">BNS_CORE</text>
        <text x="590" y="115" textAnchor="middle" fill="white" fontSize="24" fontWeight="800" fontFamily="Space Grotesk">2023</text>

        {[140, 155, 170, 185, 200, 215].map((y, i) => (
          <motion.rect
            key={y}
            x="555" y={y} width={30 + Math.random() * 40} height="2"
            fill="rgba(0, 67, 235, 0.2)"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1 + i * 0.05 }}
          />
        ))}

        {/* The Bridge (Tectonic Shift Path) */}
        <motion.path
          d="M 160 150 L 540 150"
          fill="none"
          stroke="url(#bridgeGrad)"
          strokeWidth="2"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
        />
        
        {/* Support lines for the bridge */}
        <motion.path
          d="M 160 140 L 540 140"
          stroke="rgba(229, 226, 225, 0.05)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        />
        <motion.path
          d="M 160 160 L 540 160"
          stroke="rgba(229, 226, 225, 0.05)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
        />

        {/* Flowing Data Stream Packets */}
        {Array.from({ length: particleCount }, (_, i) => (
          <motion.rect
            key={i}
            width="8" height="2"
            fill={i % 2 === 0 ? "#e01e22" : "#0043eb"}
            filter="url(#glow-red)"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: [160, 540]
            }}
            transition={{
              duration: 1.5,
              delay: 2 + i * 0.3,
              repeat: Infinity,
              ease: "linear",
            }}
            y={149}
          />
        ))}

        {/* Migration Label */}
        <motion.text
          x="350" y="130"
          textAnchor="middle"
          fill="rgba(229, 226, 225, 0.4)"
          fontSize="10"
          fontFamily="Space Grotesk"
          letterSpacing="0.4em"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          DETERMINISTIC_MIGRATION_PROTOCOL_ACTIVE
        </motion.text>
      </svg>
      
      {/* Absolute floating telemetry details */}
      <div className="absolute top-0 right-0 p-4 border border-border-color bg-[#0e0e0e] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
         <div className="telemetry-label !text-[8px] mb-2">BRIDGE_HEALTH</div>
         <div className="flex gap-1 h-4">
            {[1,1,1,1,1,0,0,1].map((v, i) => (
              <div key={i} className={`w-1 h-full ${v ? 'bg-primary-container' : 'bg-bg-surface-high'}`} />
            ))}
         </div>
      </div>
    </div>
  );
}
