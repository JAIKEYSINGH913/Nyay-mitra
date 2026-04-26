"use client";
import React from "react";
import { motion } from "framer-motion";

export const JusticeLogo = ({ className = "w-12 h-12", color = "var(--primary-container)" }) => (
  <motion.svg
    viewBox="-20 -20 140 140"
    className={className}
    initial="initial"
    animate="animate"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* HEAVY INDUSTRIAL BASE */}
    <motion.path
      d="M20 95H80M35 95L50 82L65 95"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="square"
      fill="none"
      opacity="0.9"
    />

    {/* THICK CENTRAL PILLAR */}
    <motion.path
      d="M50 82V15"
      stroke={color}
      strokeWidth="7"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />

    {/* High-Speed Assembly */}
    <motion.g
      animate={{ rotate: [-8, 8, -8] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      style={{ originX: "50px", originY: "15px" }}
    >
      {/* Heavy Pivot */}
      <circle cx="50" cy="15" r="6" fill={color} />
      
      {/* INDUSTRIAL FLAT BEAM (The Flat Stick) */}
      <motion.rect
        x="5" y="11" width="90" height="8"
        fill={color}
        rx="1"
        filter="url(#logoGlow)"
      />
      
      {/* PAN LEFT */}
      <motion.g style={{ originX: "5px", originY: "15px" }}>
        <path d="M5 15 L-2 55 M5 15 L12 55" stroke={color} strokeWidth="2.5" opacity="0.8" />
        <path d="M-8 55 H18 C 18 68, -8 68, -8 55 Z" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="4" />
      </motion.g>

      {/* PAN RIGHT */}
      <motion.g style={{ originX: "95px", originY: "15px" }}>
        <path d="M95 15 L88 55 M95 15 L102 55" stroke={color} strokeWidth="2.5" opacity="0.8" />
        <path d="M82 55 H108 C 108 68, 82 68, 82 55 Z" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="4" />
      </motion.g>
    </motion.g>

    {/* Tech Accents */}
    <motion.circle
      cx="50" cy="45" r="22"
      stroke={color}
      strokeWidth="2"
      strokeDasharray="5 10"
      animate={{ rotate: 360 }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      opacity="0.2"
    />
  </motion.svg>
);
