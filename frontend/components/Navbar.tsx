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
  History,
  AlertTriangle,
  UserCircle,
  Mail,
  Phone
} from "lucide-react";
import { useTelemetry } from "./TelemetryProvider";
import { useNeuralContext } from "./NeuralProvider";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import AuthModal from "./AuthModal";
import { account } from "@/lib/appwrite";
import { JusticeLogo } from "./JusticeLogo";
import toast from "react-hot-toast";

const JUDICIAL_OPERATIONS = [
  { href: "/nyay-vani", label: "01_NYAY_VANI", sub: "Multilingual Voice Intake", icon: <Mic className="w-5 h-5" /> },
  { href: "/nyay-bridge", label: "02_NYAY_BRIDGE", sub: "IPC ↔ BNS Transition", icon: <Workflow className="w-5 h-5" /> },
  { href: "/nyay-audit", label: "03_NYAY_AUDIT", sub: "Groundedness Verification", icon: <ShieldCheck className="w-5 h-5" /> },
  { href: "/nyay-graph", label: "04_NYAY_GRAPH", sub: "3D Neural Knowledge Graph", icon: <Database className="w-5 h-5" /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [opsOpen, setOpsOpen] = useState(false);
  const telemetry = useTelemetry();
  
  // Try to use Neural Context, handle gracefully if missing during initial render
  let neuralState = null;
  try {
    const context = useNeuralContext();
    neuralState = context.state;
  } catch (e) {
    // Context not ready
  }

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

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setCurrentUser(null);
      setLogoutConfirmOpen(false);
      setProfileOpen(false);
      toast.success("TERMINATED: Judicial session closed.");
      window.location.href = "/";
    } catch (err) {
      toast.error("ERROR: Failed to terminate session.");
    }
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
                              {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-4 h-4" })}
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
              <Link href="/help" className="px-2 py-2 font-space text-[12px] xl:text-[14px] font-bold tracking-[0.1em] text-white/80 hover:text-white transition-all uppercase whitespace-nowrap flex items-center gap-1.5">
                HELP
              </Link>
            </div>
          </div>

          {mounted && neuralState?.provenanceHash ? (
            <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
               <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
               <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-widest">
                 Hash: {neuralState.provenanceHash.substring(0, 8)}...
               </span>
            </div>
          ) : (
            <div className="hidden xl:flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
               <Database className="w-3.5 h-3.5 text-white/40" />
               <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest">
                 SYNC: {telemetry.lastSyncTimestamp}
               </span>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 xl:gap-8">

            <div className="scale-90 sm:scale-100 xl:scale-110"><ThemeToggle /></div>
            
            {/* PROFILE DROPDOWN / AUTH BUTTON */}
            <div className="relative">
              <button
                onClick={() => authUI ? setProfileOpen(!profileOpen) : setAuthModalOpen(true)}
                className={`flex items-center justify-center transition-all rounded-full border border-white/10 hover:border-primary-container group bg-white/5 ${scrolled ? "w-9 h-9" : "w-10 h-10 sm:w-12 h-12"}`}
              >
                {authUI ? (
                  <ShieldCheck className={`w-5 h-5 transition-colors ${profileOpen ? "text-primary-container" : "text-white"}`} />
                ) : (
                  <User className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                )}
              </button>

              <AnimatePresence>
                {authUI && profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-4 w-56 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl border border-white/10 bg-black/80"
                  >
                    <div className="p-3 grid gap-1">
                       <Link 
                         href="/profile" 
                         onClick={() => setProfileOpen(false)}
                         className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5 text-white/60 hover:text-white group/drop"
                       >
                         <UserCircle className="w-4 h-4 text-primary-container" />
                         <span className="font-space text-[11px] font-bold tracking-widest uppercase">Identity Hub</span>
                       </Link>
                       <button 
                         onClick={() => setLogoutConfirmOpen(true)}
                         className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-red-500/10 text-white/60 hover:text-red-500 group/drop"
                       >
                         <LogOut className="w-4 h-4" />
                         <span className="font-space text-[11px] font-bold tracking-widest uppercase">Terminate</span>
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => setCurrentUser(user)}
      />

      {/* GLOBAL LOGOUT CONFIRMATION */}
      <AnimatePresence>
        {logoutConfirmOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setLogoutConfirmOpen(false)} 
              className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl"
            >
               <div className="text-center space-y-8">
                  <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-black uppercase tracking-tighter text-white">End Session?</h2>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">Are you sure you want to terminate the current judicial session?</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setLogoutConfirmOpen(false)} className="flex-1 py-5 border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/5 transition-all">Abort</button>
                    <button onClick={handleLogout} className="flex-1 py-5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]">Terminate</button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
