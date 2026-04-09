'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#050505]">
      {/* Backdrop Blur Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,224,255,0.05),transparent_70%)]" />
      
      <div className="relative flex flex-col items-center">
        {/* Deterministic Pulse Logo (Cyan/Gold Scales) */}
        <div className="relative w-32 h-32 mb-12">
          {/* Outer Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border border-[#00E0FF]/20 rounded-full"
          />
          
          {/* Main Logo scales */}
          <svg className="w-full h-full p-4" viewBox="0 0 40 40" fill="none">
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              d="M20 5V35M20 5L10 15M20 5L30 15" 
              stroke="#00E0FF" 
              strokeWidth="1.5" 
              strokeLinecap="round"
            />
            <motion.path 
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              d="M10 22C10 26 14.4772 30 20 30C25.5228 30 30 26 30 22" 
              stroke="#FFD700" 
              strokeWidth="1" 
              strokeLinecap="round"
            />
          </svg>

          {/* Core Pulse */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-4 h-4 bg-[#00E0FF] blur-xl" />
          </motion.div>
        </div>

        <div className="space-y-4 text-center">
          <h2 className="font-space text-sm font-black tracking-[0.5em] text-white uppercase">
            INITIALIZING_KERNEL
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="w-48 h-1 bg-white/5 relative overflow-hidden">
              <motion.div 
                initial={{ left: '-100%' }}
                animate={{ left: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-[#00E0FF] to-transparent"
              />
            </div>
          </div>
          <p className="font-mono text-[8px] text-white/30 uppercase tracking-widest mt-4">
            Establishing Secure Handshake with Statutory_Vault...
          </p>
        </div>
      </div>
    </div>
  );
}
