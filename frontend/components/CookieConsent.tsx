"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, ShieldCheck, X } from "lucide-react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("nyay-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("nyay-cookie-consent", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[1000]"
        >
          {/* 
            THEME LOGIC:
            - Dark Mode: bg-[#E01E22] (Red), text-white
            - Light Mode: bg-[#1a73e8] (Blue), text-white
          */}
          <div className="relative overflow-hidden rounded-[2rem] p-6 shadow-2xl border border-white/20 
            bg-[#1a73e8] dark:bg-[#E01E22] text-white backdrop-blur-xl"
          >
            {/* Ambient Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative flex flex-col gap-5">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Cookie className="w-6 h-6 text-white" />
                </div>
                <button onClick={handleDecline} className="p-2 hover:bg-white/10 rounded-full transition-all">
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                  Privacy Handshake
                </h3>
                <p className="text-sm font-medium leading-relaxed opacity-90">
                  We use encrypted session tokens to maintain your Sovereign OAuth integrity and optimize judicial telemetry. Proceed with secure handshake?
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Button Logic:
                   - Accept: Black Background, White Text
                   - Settings: White Background, Black Text
                */}
                <button
                  onClick={handleAccept}
                  className="flex-1 py-4 bg-black text-white rounded-xl font-black uppercase tracking-widest text-[10px] 
                    hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Accept Handshake
                </button>
                <button
                  onClick={handleDecline}
                  className="px-6 py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest text-[10px] 
                    hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Privacy Specs
                </button>
              </div>
              
              <p className="text-[9px] font-bold opacity-50 uppercase tracking-[0.2em] text-center">
                System Managed by Obsidian Protocol
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
