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
  Info
} from "lucide-react";
import { useTelemetry } from "./TelemetryProvider";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import AuthModal from "./AuthModal";
import { account } from "@/lib/appwrite";

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

  const authUI = mounted ? !!currentUser : false;

  return (
    <>
      <nav
        className={`fixed left-1/2 -translate-x-1/2 z-[101] transition-all duration-500 ease-[0.16, 1, 0.3, 1] ${
          scrolled 
          ? "top-6 w-[95%] max-w-[1300px] h-16 rounded-full border bg-bg-primary/80 backdrop-blur-3xl px-12 shadow-2xl border-primary-container/30" 
          : "top-0 w-full h-24 bg-transparent border-b border-border-color px-16"
        }`}
      >
        <div className="h-full flex justify-between items-center relative z-10">
          <div className="flex items-center gap-16">
            <Link href="/" className="flex items-center group">
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-container shadow-[0_0_15px_var(--primary-container)]" />
                  <span className={`font-space font-extrabold tracking-tighter text-text-primary uppercase leading-none transition-all ${scrolled ? "text-2xl" : "text-4xl"}`}>
                    NYAY-MITRA
                  </span>
                </div>
              </div>
            </Link>

            {/* Core Navigation Options */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Judicial Operations Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setOpsOpen(true)}
                onMouseLeave={() => setOpsOpen(false)}
              >
                <button className="flex items-center gap-3 px-5 py-2 font-space text-[15px] font-bold tracking-[0.1em] text-text-primary hover:text-primary-container transition-all uppercase">
                  JUDICIAL_OPERATIONS
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${opsOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {opsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute top-full left-0 mt-4 w-80 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl border border-border-color
                        bg-[#333333]/90 dark:bg-[#CCCCCC]/90" 
                    >
                      <div className="p-5 grid gap-3">
                        {JUDICIAL_OPERATIONS.map((item) => (
                          <Link 
                            key={item.href} 
                            href={item.href}
                            className="flex items-center gap-6 p-4 rounded-xl transition-all group/item
                              hover:bg-primary-container/20 border border-transparent hover:border-white/10 dark:hover:border-black/10"
                          >
                            <div className="p-3 rounded-lg border border-border-color transition-colors
                              bg-white/10 dark:bg-black/10 text-white dark:text-black">
                              {item.icon}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-space text-[14px] font-bold tracking-widest uppercase
                                text-white dark:text-black">{item.label}</span>
                              <span className="font-mono text-[10px] uppercase tracking-normal mt-1
                                text-white/60 dark:text-black/60">{item.sub}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Research Hub Link */}
              <Link 
                href="/research-hub" 
                className="px-5 py-2 font-space text-[15px] font-bold tracking-[0.1em] text-text-primary hover:text-primary-container transition-all uppercase"
              >
                RESEARCH_HUB
              </Link>

              {/* About Us Link */}
              <Link 
                href="/about" 
                className="px-5 py-2 font-space text-[15px] font-bold tracking-[0.1em] text-text-primary hover:text-primary-container transition-all uppercase"
              >
                ABOUT_US
              </Link>
            </div>
          </div>

          {/* Right Section: Refined Search, Mode, Profile */}
          <div className="flex items-center gap-8">
            {/* Refined/Reduced Search Bar */}
            <div className="hidden xl:flex w-72">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary-container transition-all duration-300" />
                <input
                  type="text"
                  placeholder="SEARCH_VAULT..."
                  className="w-full bg-bg-surface-low/60 border border-border-color py-2.5 pl-12 pr-4 font-mono text-[11px] uppercase font-medium tracking-widest text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-primary-container focus:bg-bg-surface-high/80 transition-all duration-300 rounded-full shadow-sm"
                />
              </div>
            </div>

            <div className="scale-125">
              <ThemeToggle />
            </div>

            <button
              onClick={() => authUI ? window.location.href = "/profile" : setAuthModalOpen(true)}
              className={`flex items-center justify-center transition-all rounded-full border border-border-color hover:border-primary-container group ${scrolled ? "w-12 h-12" : "w-14 h-14"}`}
              title="User Profile"
            >
              {authUI ? (
                <ShieldCheck className="w-6 h-6 text-primary-container" />
              ) : (
                <User className="w-6 h-6 text-text-muted group-hover:text-primary-container transition-colors" />
              )}
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
