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
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import AuthModal from "./AuthModal";
import { account } from "@/lib/appwrite";

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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  const { status, latency, veracity, isDevConsoleOpen, setDevConsoleOpen } = useTelemetry();
  const { theme } = useTheme();

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

  const handleTerminate = async () => {
    try {
      await account.deleteSession("current");
      setCurrentUser(null);
      setProfileOpen(false);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const authUI = mounted ? !!currentUser : false;

  return (
    <>

      <nav
        className="fixed top-0 left-0 right-0 z-[101] h-20 border-b transition-all duration-300 backdrop-blur-2xl"
        style={{
          background: scrolled ? "var(--glass-bg)" : "transparent",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-container/20 to-transparent" />

        <div className="max-w-[1800px] mx-auto px-8 h-full flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center group">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-primary-container shadow-[0_0_8px_var(--primary-container)]" />
                   <span className="font-space text-2xl font-black tracking-tighter text-text-primary uppercase leading-none">
                      NYAY-MITRA
                   </span>
                </div>
                <span className="font-mono font-bold text-[8px] text-accent-yellow opacity-40 mt-1.5 tracking-[0.4em] uppercase">
                   Sovereign Judicial Engine
                </span>
              </div>
            </Link>

            {/* Desktop Navigation with Dropdowns */}
            <div className="hidden lg:flex items-center gap-2">
              {menuGroups.map((group) => (
                <div key={group.title} className="relative group/dropdown">
                  <button className="flex items-center gap-2 px-4 py-2 font-space text-[10px] font-bold tracking-widest text-text-primary hover:text-primary-container transition-colors uppercase">
                    {group.title.replace('_', ' ')}
                    <ChevronDown className="w-3 h-3 transition-transform group-hover/dropdown:rotate-180" />
                  </button>
                  
                  <div className="absolute top-full left-0 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover/dropdown:opacity-100 group-hover/dropdown:translate-y-0 group-hover/dropdown:pointer-events-auto transition-all duration-300">
                    <div className="w-64 bg-bg-surface-low border border-border-color shadow-2xl glass-panel p-2 rounded-xl">
                      {group.items.map((item) => (
                        <Link 
                          key={item.label} 
                          href={item.href}
                          className="flex items-center gap-4 p-3 hover:bg-white/5 transition-all group/item border border-transparent hover:border-primary-container/30"
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-bg-surface-high border border-border-color group-hover/item:border-primary-container transition-colors">
                             <span className="text-primary-container">{item.icon}</span>
                          </div>
                          <div>
                            <div className="font-space text-[10px] font-bold tracking-widest text-text-primary uppercase">{item.label}</div>
                            <div className="font-mono text-[7px] text-text-muted uppercase mt-0.5">{item.sub}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden xl:flex flex-1 max-w-sm mx-10">
            <div className="relative w-full group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted group-focus-within:text-primary-container transition-colors" />
              <input 
                type="text" 
                placeholder="JUDICIAL_DISCOVERY..."
                className="w-full bg-transparent border border-border-color py-2.5 pl-14 pr-6 font-mono text-[9px] uppercase font-bold tracking-widest text-primary-container focus:outline-none focus:border-primary-container transition-all placeholder:text-text-muted glass-panel rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="relative">
              <button 
                onClick={() => {
                  if (authUI) {
                    window.location.href = "/profile";
                  } else {
                    setAuthModalOpen(true);
                  }
                }}
                className={`flex items-center justify-center w-10 h-10 border transition-all rounded-full ${authUI ? 'bg-primary-container/10 border-primary-container' : 'border-border-color hover:border-primary-container'}`}
              >
                <div className="w-7 h-7 flex items-center justify-center bg-transparent rounded-full">
                   {authUI ? <ShieldCheck className="w-4 h-4 text-primary-container" /> : <User className="w-4 h-4 text-text-muted" />}
                </div>
              </button>
            </div>
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
