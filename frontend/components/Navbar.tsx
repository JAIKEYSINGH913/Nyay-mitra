"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Workflow,
  Database,
  Activity,
  User,
  Layers,
  Menu,
  X,
  Search,
  ChevronDown,
  LogOut,
  Lock,
  ShieldCheck,
  Cpu,
  Mic,
  BookOpen,
  Info,
  History
} from "lucide-react";
import { useTelemetry } from "./TelemetryProvider";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import AuthModal from "./AuthModal";
import { account } from "@/lib/appwrite";
import { JusticeLogo } from "./JusticeLogo";

const JUDICIAL_OPERATIONS = [
  { href: "/nyay-graph", label: "NYAY_GRAPH", sub: "Knowledge Graph Exploration", icon: <Database className="w-5 h-5" /> },
  { href: "/nyay-vani", label: "NYAY_VANI", sub: "Voice-First Retrieval", icon: <Mic className="w-5 h-5" /> },
  { href: "/nyay-audit", label: "NYAY_AUDIT", sub: "Groundedness Verification", icon: <ShieldCheck className="w-5 h-5" /> },
  { href: "/nyay-bridge", label: "NYAY_BRIDGE", sub: "IPC ↔ BNS Transition", icon: <Workflow className="w-5 h-5" /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [opsOpen, setOpsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkSession = async () => {
      try {
        const user = await account.get();
        setCurrentUser(user);
      } catch (err) {
        setCurrentUser(null);
      }
    };
    checkSession();
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleHomeRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("showLoading"));
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  const authUI = mounted ? !!currentUser : false;

  return (
    <>
      <nav
        className={`fixed left-1/2 -translate-x-1/2 z-[101] transition-all duration-700 ease-[0.16, 1, 0.3, 1] ${
          scrolled 
          ? "top-6 w-[95%] max-w-[1300px] h-16 rounded-full border border-white/20 bg-black/60 backdrop-blur-3xl px-12 shadow-2xl" 
          : "top-0 w-full h-24 bg-transparent border-b border-white/5 px-16"
        }`}
      >
         <div className="h-full flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4 sm:gap-8 xl:gap-12">
            <Link href="/" onClick={handleHomeRedirect} className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <JusticeLogo className={`${scrolled ? "w-6 h-6" : "w-8 h-8 sm:w-10 sm:h-10"} transition-all`} />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className={`font-space font-extrabold tracking-tighter text-white uppercase leading-none transition-all ${scrolled ? "text-lg" : "text-xl sm:text-3xl"}`}>
                    NYAY-MITRA
                  </span>
                </div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1 xl:gap-4">
              <div 
                className="relative"
                onMouseEnter={() => setOpsOpen(true)}
                onMouseLeave={() => setOpsOpen(false)}
              >
                <button className="flex items-center gap-1.5 px-2 py-2 font-space text-[12px] xl:text-[14px] font-bold tracking-[0.1em] text-white/80 hover:text-white transition-all uppercase whitespace-nowrap">
                  OPERATIONS
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${opsOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {opsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute top-full left-0 mt-4 w-72 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl border border-white/10 bg-black/80" 
                    >
                      <div className="p-4 grid gap-2">
                        {JUDICIAL_OPERATIONS.map((item) => (
                          <Link 
                            key={item.href} 
                            href={item.href}
                            className="flex items-center gap-4 p-3 rounded-xl transition-all group/item hover:bg-white/5 border border-transparent hover:border-white/10"
                          >
                            <div className="p-2 rounded-lg border border-white/10 bg-white/5 text-white">
                              {React.cloneElement(item.icon as React.ReactElement, { className: "w-4 h-4" })}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-space text-[12px] font-bold tracking-widest uppercase text-white">{item.label}</span>
                              <span className="font-mono text-[9px] uppercase tracking-normal mt-0.5 text-white/40">{item.sub}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/research-hub" className="px-2 py-2 font-space text-[12px] xl:text-[14px] font-bold tracking-[0.1em] text-white/80 hover:text-white transition-all uppercase whitespace-nowrap">RESEARCH</Link>
              <Link href="/history" className="px-2 py-2 font-space text-[12px] xl:text-[14px] font-bold tracking-[0.1em] text-white/80 hover:text-white transition-all uppercase flex items-center gap-1.5 whitespace-nowrap">
                <History className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">HISTORY</span>
              </Link>
              <Link href="/about" className="px-2 py-2 font-space text-[12px] xl:text-[14px] font-bold tracking-[0.1em] text-white/80 hover:text-white transition-all uppercase whitespace-nowrap">ABOUT</Link>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 xl:gap-8">
            <div className="hidden lg:flex w-40 xl:w-64">
              <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 group-focus-within:text-white transition-all duration-300" />
                <input
                  type="text"
                  placeholder="SEARCH..."
                  className="w-full bg-white/5 border border-white/10 py-1.5 pl-9 pr-4 font-mono text-[9px] uppercase font-medium tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-300 rounded-full shadow-sm"
                />
              </div>
            </div>
            <div className="scale-90 sm:scale-100 xl:scale-110"><ThemeToggle /></div>
            <button
              onClick={() => authUI ? window.location.href = "/profile" : setAuthModalOpen(true)}
              className={`flex items-center justify-center transition-all rounded-full border border-white/10 hover:border-white/40 group bg-white/5 ${scrolled ? "w-9 h-9" : "w-10 h-10 sm:w-12 h-12"}`}
            >
              {authUI ? <ShieldCheck className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />}
            </button>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => setCurrentUser(user)}
      />
    </>
  );
}
