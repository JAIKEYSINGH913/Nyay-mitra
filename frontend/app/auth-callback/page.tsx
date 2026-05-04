"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AuthCallback() {
  const router = useRouter();
  const mounted = useRef(true);

  useEffect(() => {
    const completeAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const urlError = params.get("error");
      const urlErrorMsg = params.get("message");

      if (urlError) {
        toast.error(`AUTH_ERROR: ${urlErrorMsg || urlError}`);
        router.push("/");
        return;
      }

      // 1. Initial Wait
      await new Promise(resolve => setTimeout(resolve, 2500));

      try {
        let success = false;
        let successUser = null;

        // Stage 1: Fast Retries
        for (let i = 0; i < 3; i++) {
           try {
             successUser = await account.get();
             if (successUser) {
               success = true;
               break;
             }
           } catch (e) {
             console.log("Handshake stage 1 waiting...");
             await new Promise(r => setTimeout(r, 2000));
           }
        }
        
        if (success && mounted.current) {
          toast.success("IDENTITY_VERIFIED: Access granted.");
          router.push("/profile");
          return;
        }

        // Stage 2: Deep Retries (Fallback)
        const retryAttempts = [3000, 5000, 8000]; 
        for (let i = 0; i < retryAttempts.length; i++) {
          if (!mounted.current) break;
          try {
            await new Promise(resolve => setTimeout(resolve, retryAttempts[i]));
            const retryUser = await account.get();
            if (retryUser) {
              success = true;
              router.push("/profile");
              break;
            }
          } catch (retryError) {
            console.warn(`Handshake deep retry ${i + 1} failed.`);
          }
        }

        if (!success && mounted.current) {
          toast.error("HANDSHAKE_TIMEOUT: Session synchronization failed.");
          router.push("/");
        }
      } catch (globalError) {
        if (mounted.current) router.push("/");
      }
    };

    completeAuth();
    return () => { mounted.current = false; };
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-container/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 space-y-12"
      >
        <div className="relative inline-block">
          <div className="w-28 h-28 border border-white/10 rounded-full flex items-center justify-center bg-white/[0.02] backdrop-blur-xl">
            <Loader2 className="w-12 h-12 text-primary-container animate-spin" />
          </div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-2 -right-2 bg-primary-container p-3 rounded-full shadow-[0_0_20px_rgba(0,243,255,0.4)]"
          >
             <ShieldCheck className="w-6 h-6 text-black" />
          </motion.div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center gap-2">
             <div className="flex items-center gap-2 px-3 py-1 border border-primary-container/30 bg-primary-container/10 rounded-full">
                <span className="text-[10px] font-black text-primary-container uppercase tracking-[0.2em]">Secure_Handshake</span>
             </div>
             <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
                Finalizing <br /><span className="text-primary-container">Auth</span>
             </h1>
          </div>
          
          <p className="text-white/30 text-[11px] font-bold tracking-[0.1em] uppercase max-w-[320px] mx-auto leading-relaxed italic">
            Synchronizing identity vectors with the sovereign kernel. Please remain on this page.
          </p>
        </div>

        <div className="w-64 h-[2px] bg-white/5 mx-auto relative overflow-hidden rounded-full">
           <motion.div 
             animate={{ x: ["-100%", "100%"] }}
             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-container to-transparent shadow-[0_0_15px_#00F3FF]"
           />
        </div>

        <div className="pt-8 flex items-center justify-center gap-2 text-white/20">
           <AlertCircle className="w-3 h-3" />
           <span className="text-[9px] font-black uppercase tracking-widest">Handshaking with Appwrite Cloud</span>
        </div>
      </motion.div>
    </div>
  );
}
