"use client";
import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useTelemetry } from "./TelemetryProvider";

const menuGroups = [
  {
    title: "JUDICIAL_OPERATIONS",
    items: [
      { href: "/nyay-bridge", label: "NYAY_BRIDGE", sub: "IPC ↔ BNS Transition", icon: <Workflow className="w-4 h-4" /> },
      { href: "/nyay-audit", label: "NYAY_AUDIT", sub: "Groundedness Verification", icon: <ShieldCheck className="w-4 h-4" /> },
      { href: "/nyay-discovery", label: "NYAY_DISCOVERY", sub: "Knowledge Graph Exploration", icon: <Database className="w-4 h-4" /> },
      { href: "/nyay-vani", label: "NYAY_VANI", sub: "Voice-First Retrieval", icon: <Mic className="w-4 h-4" /> },
    ]
  },
  {
    title: "THE_ARCHIVE",
    items: [
      { href: "/statutory-vault", label: "STATUTORY_VAULT", sub: "IPC Legacy / BNS Modern", icon: <BookOpen className="w-4 h-4" /> },
      { href: "/precedent-vault", label: "PRECEDENT_VAULT", sub: "Case Law Repository", icon: <Layers className="w-4 h-4" /> },
      { href: "/research-hub", label: "RESEARCH_HUB", sub: "System Abstract & Papers", icon: <Terminal className="w-4 h-4" /> },
    ]
  },
  {
    title: "TELEMETRY",
    items: [
      { href: "/neural-integrity", label: "NEURAL_INTEGRITY", sub: "LLM Benchmarking", icon: <Cpu className="w-4 h-4" /> },
      { href: "/network-logs", label: "NETWORK_LOGS", sub: "API Traffic & Health", icon: <Activity className="w-4 h-4" /> },
    ]
  }
];

const navLinks = [
  { href: "/", label: "SYSTEM_CORE", icon: <Terminal className="w-3 h-3" /> },
  { href: "/nyay-vani", label: "TELEMETRY", icon: <Activity className="w-3 h-3" /> },
  { href: "/nyay-bridge", label: "NEURAL_NET", icon: <Database className="w-3 h-3" /> },
  { href: "/research-hub", label: "ARCHIVE", icon: <Layers className="w-3 h-3" /> }
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { status, latency, veracity, isDevConsoleOpen, setDevConsoleOpen } = useTelemetry();

  useEffect(() => {
    setMounted(true);
    const auth = localStorage.getItem("nyaymitra_authenticated") === "true";
    setIsLoggedIn(auth);
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleTerminate = () => {
    localStorage.removeItem("nyaymitra_authenticated");
    setIsLoggedIn(false);
    setProfileOpen(false);
  };

  const handleLoginSim = () => {
    localStorage.setItem("nyaymitra_authenticated", "true");
    setIsLoggedIn(true);
    setProfileOpen(false);
  };

  const authUI = mounted ? isLoggedIn : false;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[110] bg-black/95 border-b border-[#00E0FF]/10 px-8 h-8 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-[#00E0FF]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'KERNEL_ERROR' ? 'bg-red-500 animate-ping' : 'bg-[#00FFA3] animate-pulse shadow-[0_0_8px_#00FFA3]'}`} />
            <span className="font-bold">{status === 'KERNEL_ERROR' ? 'KERNEL_ERROR: MISSING CREDENTIALS' : `STATUS: ${status}`}</span>
          </div>
          <div className="flex items-center gap-2 opacity-60">
            <Activity className="w-3 h-3" />
            <span>LATENCY: {latency}ms</span>
          </div>
          <div className="flex items-center gap-2 opacity-60">
            <ShieldCheck className="w-3 h-3 text-[#FFD700]" />
            <span>VERACITY: {veracity.toFixed(1)}%</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setDevConsoleOpen(!isDevConsoleOpen)}
            className={`px-3 py-0.5 border ${isDevConsoleOpen ? 'bg-[#00E0FF] text-black border-[#00E0FF]' : 'border-[#00E0FF]/20 hover:border-[#00E0FF]'} transition-all`}
          >
            {isDevConsoleOpen ? 'CLOSE_CONSOLE' : 'DEV_CONSOLE'}
          </button>
          <span className="opacity-30">JUDICIAL_CORE v4.0.2</span>
        </div>
      </div>

      <nav
        className="fixed top-8 left-0 right-0 z-[101] h-20 border-b transition-all duration-300 backdrop-blur-2xl"
        style={{
          background: scrolled ? "rgba(5, 5, 5, 0.98)" : "transparent",
          borderColor: scrolled ? "rgba(0, 224, 255, 0.2)" : "rgba(255, 255, 255, 0.05)",
        }}
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00E0FF]/20 to-transparent" />

        <div className="max-w-[1800px] mx-auto px-8 h-full flex justify-between items-center relative z-10">
          
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-12 h-12 flex items-center justify-center bg-transparent border border-white/10 hover:border-[#00E0FF] transition-all group relative"
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? <X key="X" className="w-5 h-5 text-[#00E0FF]" /> : <Menu key="Menu" className="w-5 h-5 text-white" />}
              </AnimatePresence>
            </button>
            
            <Link href="/" className="flex items-center group">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-[#00E0FF] shadow-[0_0_8px_#00E0FF]" />
                   <span className="font-space text-2xl font-black tracking-tighter text-white uppercase leading-none">
                      NYAYMITRA_OS
                   </span>
                </div>
                <span className="font-mono font-bold text-[8px] text-[#FFD700] opacity-40 mt-1.5 tracking-[0.4em] uppercase">
                   Sovereign Judicial Engine
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex flex-1 max-w-xl mx-20">
            <div className="relative w-full group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within:text-[#00E0FF] transition-colors" />
              <input 
                type="text" 
                placeholder="PROMPT JUDICIAL_DISCOVERY..."
                className="w-full bg-white/5 border border-white/10 py-3 pl-14 pr-6 font-mono text-[10px] uppercase font-bold tracking-widest text-[#00E0FF] focus:outline-none focus:border-[#00E0FF] transition-all placeholder:text-white/10"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center gap-4 px-4 py-2 border transition-all ${profileOpen ? 'bg-white/5 border-[#00E0FF]' : 'border-white/10 hover:border-[#00E0FF]'}`}
              >
                <div className="w-8 h-8 border border-[#00E0FF]/20 flex items-center justify-center bg-[#00E0FF]/5">
                   {authUI ? <ShieldCheck className="w-4 h-4 text-[#00E0FF]" /> : <User className="w-4 h-4 text-white/40" />}
                </div>
                <ChevronDown className={`w-3 h-3 text-white/40 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-64 bg-[#0a0a0a] border border-[#00E0FF]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[110]"
                  >
                    <div className="p-4 border-b border-white/5 bg-white/5">
                       <span className="font-mono text-[8px] text-[#00E0FF] block mb-1">SYSTEM_AUTH_GATEWAY</span>
                       <span className="font-space text-[11px] font-bold text-white uppercase tracking-widest">{authUI ? "OPERATOR_ADMIN" : "GUEST_USER"}</span>
                    </div>
                    <div className="p-1">
                       {!authUI ? (
                         <Link href="/login" onClick={handleLoginSim}>
                            <button className="w-full text-left p-4 flex items-center gap-3 hover:bg-[#00E0FF]/10 group transition-all">
                               <Lock className="w-4 h-4 text-[#00E0FF]" />
                               <span className="font-space text-[10px] font-bold uppercase tracking-widest">INITIALIZE_SESSION</span>
                            </button>
                         </Link>
                       ) : (
                         <button onClick={handleTerminate} className="w-full text-left p-4 flex items-center gap-3 hover:bg-red-500/10 group transition-all">
                            <LogOut className="w-4 h-4 text-red-500" />
                            <span className="font-space text-[10px] font-bold uppercase tracking-widest text-red-500">TERMINATE_KERNAL</span>
                         </button>
                       )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-full md:w-[450px] z-[200] bg-[#050505] border-r border-[#00E0FF]/10 shadow-[50px_0_100px_rgba(0,0,0,0.9)] overflow-y-auto"
          >
            <div className="p-8 pt-12">
              <div className="flex items-center justify-between mb-16">
                <span className="font-space text-xl font-black text-white italic tracking-tighter">NYAY_OS</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-white/5 transition-colors">
                  <X className="w-6 h-6 text-white/40" />
                </button>
              </div>

              <div className="space-y-12">
                {menuGroups.map((group, idx) => (
                  <div key={group.title} className="space-y-4">
                    <div className="flex items-center gap-3 opacity-30">
                       <div className="w-8 h-[1px] bg-white" />
                       <h3 className="font-mono text-[9px] font-bold tracking-[0.4em] uppercase text-white">{group.title}</h3>
                    </div>
                    
                    <div className="grid gap-2">
                       {group.items.map((item) => (
                          <Link 
                            key={item.label} 
                            href={item.href} 
                            onClick={() => setMobileOpen(false)}
                            className="group flex items-center gap-5 p-4 bg-white/5 border border-transparent hover:border-[#00E0FF]/30 transition-all"
                          >
                             <div className="w-10 h-10 border border-white/5 flex items-center justify-center bg-white/5 group-hover:border-[#00E0FF]/50 transition-colors">
                                <span className="text-[#00E0FF] group-hover:scale-110 transition-transform">{item.icon}</span>
                             </div>
                             <div>
                                <div className="font-space text-xs font-bold tracking-widest text-white group-hover:text-[#00E0FF] transition-colors uppercase">
                                   {item.label}
                                </div>
                                <div className="font-mono text-[81x] text-white/30 uppercase mt-1 tracking-widest">{item.sub}</div>
                             </div>
                          </Link>
                       ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="absolute bottom-8 left-8 right-8">
               <div className="p-4 border border-white/5 bg-white/5 rounded-sm">
                  <div className="flex items-center gap-3 mb-2">
                     <Cpu className="w-3 h-3 text-[#FFD700]" />
                     <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest">System_Integrity</span>
                  </div>
                  <div className="h-1 bg-white/5 overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '88%' }}
                        className="h-full bg-gradient-to-r from-[#00E0FF] to-[#FFD700]"
                     />
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
