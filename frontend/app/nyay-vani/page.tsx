"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, Globe, ShieldCheck, Zap, Languages } from "lucide-react";

const languages = [
  { code: "hi", name: "Hindi", label: "हिन्दी" },
  { code: "bn", name: "Bengali", label: "বাংলা" },
  { code: "ta", name: "Tamil", label: "தமிழ்" },
  { code: "te", name: "Telugu", label: "తెలుగు" },
  { code: "kn", name: "Kannada", label: "ಕನ್ನಡ" },
];

export default function NyayVaniPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLang, setSelectedLang] = useState("hi");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState<any>(null);

  const startRecording = () => {
    setIsRecording(true);
    setTranscript("");
    setResponse(null);
    // Simulate speech-to-text
    setTimeout(() => {
       setIsRecording(false);
       setTranscript(selectedLang === 'hi' ? "हत्या की सजा क्या है?" : "What is the punishment for murder?");
       
       // Simulate Bhashini + Grounded Retrieval
       setTimeout(() => {
          setResponse({
             translated: "What is the punishment for murder?",
             section: "IPC Section 302",
             bns_equivalent: "BNS Section 101",
             answer: "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
             veracity: "100% GROUNDED_ONLY"
          });
       }, 1000);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-bg-surface pt-32 px-10 pb-20 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-container/20 to-transparent" />
      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16 space-y-6">
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="w-16 h-16 bg-bg-surface-lowest border border-border-color flex items-center justify-center relative group"
           >
              <div className="absolute inset-0 bg-primary-container/5 group-hover:bg-primary-container/10 transition-colors" />
              <Mic className={`w-6 h-6 ${isRecording ? 'text-red-500 animate-pulse' : 'text-primary-container'}`} />
           </motion.div>
           
           <h1 className="font-space text-6xl font-black uppercase tracking-tighter">NYAY_VANI</h1>
           <p className="font-body text-[#e7bdb8] opacity-60 max-w-xl text-lg">
              Sovereign Multilingual Layer. Speak your query in any regional language to receive grounded legal responses via Bhashini API.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <div className="lg:col-span-1 space-y-8">
              <div className="bg-bg-surface-lowest border border-border-color p-8 space-y-6">
                 <span className="telemetry-label !text-[10px] opacity-40 uppercase tracking-widest">Select_Language_Core</span>
                 <div className="grid grid-cols-1 gap-2">
                    {languages.map((lang) => (
                      <button 
                         key={lang.code}
                         onClick={() => setSelectedLang(lang.code)}
                         className={`p-4 border text-left font-space flex items-center justify-between transition-all ${selectedLang === lang.code ? 'border-primary-container bg-primary-container/5 text-white' : 'border-border-color text-text-muted hover:border-primary-container/50'}`}
                      >
                         <span className="text-[11px] font-bold uppercase">{lang.name}</span>
                         <span className="text-[12px] opacity-40">{lang.label}</span>
                      </button>
                    ))}
                 </div>
              </div>
              
              <div className="p-8 border border-primary-container/20 bg-primary-container/5 space-y-4">
                 <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary-container" />
                    <span className="font-space text-[10px] font-black uppercase">BHASHINI_STATUS: ACTIVE</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-secondary-container" />
                    <span className="font-space text-[10px] font-black uppercase tracking-tighter">LATENCY: 0.24s</span>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-2 space-y-8">
              <div 
                 className={`h-[400px] bg-bg-surface-lowest border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center p-12 text-center group relative overflow-hidden ${isRecording ? 'border-red-500/40 bg-red-500/5' : 'border-border-color hover:border-primary-container/40'}`}
              >
                 <AnimatePresence mode="wait">
                    {isRecording ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6 flex flex-col items-center"
                      >
                         <div className="flex gap-1 items-end h-12">
                            {[...Array(12)].map((_, i) => (
                               <motion.div 
                                 key={i}
                                 animate={{ height: [10, 40, 10] }}
                                 transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                                 className="w-1.5 bg-red-500/60"
                               />
                            ))}
                         </div>
                         <span className="font-space text-[11px] font-bold text-red-500 uppercase tracking-[0.3em] ml-2">LISTENING_FOR_INPUT...</span>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6 flex flex-col items-center"
                      >
                         <button 
                           onClick={startRecording}
                           className="w-24 h-24 rounded-full bg-primary-container group-hover:scale-105 transition-transform flex items-center justify-center shadow-[0_0_40px_rgba(46,91,255,0.4)]"
                         >
                            <Mic className="w-10 h-10 text-white" />
                         </button>
                         <span className="font-space text-[11px] font-bold text-white uppercase tracking-[0.3em]">INITIALIZE_VOICE_COMMAND</span>
                      </motion.div>
                    )}
                 </AnimatePresence>
                 
                 {transcript && !isRecording && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-10 left-10 right-10 text-center"
                    >
                       <span className="telemetry-label !text-[10px] opacity-30 block mb-2 uppercase italic">TRANSCRIPT</span>
                       <p className="font-space text-2xl font-bold text-white italic">"{transcript}"</p>
                    </motion.div>
                 )}
              </div>

              <AnimatePresence>
                 {response && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="bg-[#0e0e0e] border border-border-color p-10 space-y-10"
                   >
                     <div className="flex justify-between items-start">
                        <div className="space-y-4">
                           <div className="flex items-center gap-3">
                              <Languages className="w-4 h-4 text-primary-container" />
                              <span className="telemetry-label !text-primary-container !font-bold uppercase tracking-widest text-[9px]">BHASHINI_TRANSLATION_CORE</span>
                           </div>
                           <h3 className="font-space text-2xl font-black text-white italic">"{response.translated}"</h3>
                        </div>
                        <div className="flex gap-4">
                           <div className="px-4 py-1.5 bg-bg-surface-high border border-border-color">
                              <span className="font-space text-[10px] font-bold text-secondary-container">{response.section}</span>
                           </div>
                           <div className="px-4 py-1.5 bg-bg-surface-high border border-border-color">
                              <span className="font-space text-[10px] font-bold text-primary-container">{response.bns_equivalent}</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <Volume2 className="w-4 h-4 text-primary-container" />
                           <span className="font-space text-[11px] font-black uppercase text-text-muted tracking-widest">GROUNDED_LEGAL_RESPONSE</span>
                        </div>
                        <p className="font-body text-xl text-[#e7bdb8] leading-relaxed border-l-2 border-primary-container pl-8">{response.answer}</p>
                     </div>

                     <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                           <ShieldCheck className="w-4 h-4 text-secondary-container" />
                           <span className="font-space text-[10px] font-bold text-secondary-container uppercase tracking-tight">VERACITY_INDEX: {response.veracity}</span>
                        </div>
                        <button className="telemetry-label !text-[9px] hover:text-primary-container transition-colors uppercase font-bold tracking-widest cursor-pointer underline underline-offset-8">
                           READ_FULL_PRECEDENT_DATA
                        </button>
                     </div>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}
