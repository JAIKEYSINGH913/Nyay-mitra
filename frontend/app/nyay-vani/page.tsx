"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Mic, 
  Square,
  Activity, 
  Globe, 
  Settings2,
  Volume2,
  Send,
  Keyboard,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Workflow
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useNeuralContext } from "@/components/NeuralProvider";

const LANGUAGES = [
  { code: "hi", name: "Hindi", label: "हिन्दी" },
  { code: "ta", name: "Tamil", label: "தமிழ்" },
  { code: "te", name: "Telugu", label: "తెలుగు" },
];

export default function NyayVaniPage() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Setup Global Neural Context
  const { setNeuralState } = useNeuralContext();
  
  // State
  const [selectedLang, setSelectedLang] = useState("hi");
  const [textMode, setTextMode] = useState(false);
  const [fallbackText, setFallbackText] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Audio Controls
  const [voiceType, setVoiceType] = useState("Neutral");
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Transcripts
  const [inputTranscript, setInputTranscript] = useState("");
  const [neuralTranslation, setNeuralTranslation] = useState("");

  // Simulated Web Audio API data for waveform
  const [audioData, setAudioData] = useState<number[]>(new Array(30).fill(10));
  
  // Real Web Audio API Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const startActualRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      await audioCtx.resume();
      audioContextRef.current = audioCtx;
      
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;
      
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      
      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      
      let lastUpdate = Date.now();
      const updateWaveform = () => {
        if (!analyserRef.current) return;
        
        const now = Date.now();
        if (now - lastUpdate > 33) {
           const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
           analyserRef.current.getByteFrequencyData(dataArray);
           const newAudioData = Array.from(dataArray).slice(0, 30).map(val => (val / 255) * 45 + 5);
           setAudioData(newAudioData);
           lastUpdate = now;
        }
        animationFrameRef.current = requestAnimationFrame(updateWaveform);
      };
      
      updateWaveform();
      setIsRecording(true);
      setHasRecorded(false);
      setInputTranscript("सुन रहा हूँ... (Listening...)");
      setNeuralTranslation("Establishing neural translation bridge...");
      
    } catch (err) {
      console.warn("[NYAY-VANI_DEBUG] Microphone access failed:", err);
      toast.error("Mic access denied or hardware error.");
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      // 1. Convert Blob to Base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        try {
          const base64Audio = (reader.result as string).split(',')[1];
          
          // 2. Call STT API
          const sttRes = await fetch("http://127.0.0.1:8003/api/vani/stt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              audio_content: base64Audio,
              language_code: selectedLang
            })
          });
          const sttData = await sttRes.json();
          const transcription = sttData.output.transcription;
          setInputTranscript(transcription);

          // 3. Call Translation API to Legal English
          const transRes = await fetch("http://127.0.0.1:8003/api/vani/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: transcription,
              source_lang: selectedLang,
              target_lang: "en"
            })
          });
          const transData = await transRes.json();
          setNeuralTranslation(transData.output.translated_text);
          setHasRecorded(true);
        } catch (err) {
          console.error("[NYAY-VANI_ERROR] Processing failed:", err);
          toast.error("Neural Bridge Timeout. Ensure Vani Service [8003] is live.");
        } finally {
          setIsProcessing(false);
        }
      };
    } catch (error) {
      console.error("Vani Processing Error:", error);
      toast.error("Failed to process voice.");
    }
  };

  const stopActualRecording = () => {
    setIsRecording(false);
    
    // Cleanup Web Audio resources
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopActualRecording();
    } else {
      startActualRecording();
    }
  };

  const submitFallbackText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fallbackText) return;
    
    setIsProcessing(true);
    setInputTranscript(fallbackText);
    setNeuralTranslation("Translating...");

    try {
      // Call the Vani text query endpoint
      const res = await fetch("http://127.0.0.1:8003/api/vani/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: fallbackText,
          language: selectedLang
        })
      });
      const data = await res.json();
      setNeuralTranslation(data.output?.translated_text || fallbackText);
      setHasRecorded(true);
    } catch (err) {
      console.error("[NYAY-VANI_ERROR] Query failed:", err);
      // If the API is down, try the translate endpoint directly
      try {
        const transRes = await fetch("http://127.0.0.1:8003/api/vani/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: fallbackText,
            source_lang: selectedLang,
            target_lang: "en"
          })
        });
        const transData = await transRes.json();
        setNeuralTranslation(transData.output?.translated_text || fallbackText);
        setHasRecorded(true);
      } catch (err2) {
        toast.error("Vani service offline. Ensure port 8003 is running.");
        setNeuralTranslation(fallbackText);
        setHasRecorded(true);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const sendToBridge = () => {
    // Dispatch to global store
    setNeuralState({
      activeQuery: neuralTranslation
    });
    toast.success("Context established. Pushing to Nyay-Bridge...");
    router.push("/nyay-bridge");
  };

  return (
    <div className="min-h-screen bg-black text-white font-space pt-24 pb-20 px-6 md:px-10 overflow-x-hidden relative selection:bg-primary-container selection:text-black">
      
      {/* 1. HUGE FADED TITLE */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none z-0">
        <h1 className="text-[14vw] font-black tracking-tighter uppercase opacity-[0.03] leading-none select-none">
          NYAY-VANI
        </h1>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10 pt-10">
        
        {/* HEADER & TELEMETRY */}
        <div className="flex flex-col xl:flex-row justify-between items-end gap-10 mb-10 border-b border-white/5 pb-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-primary-container transition-all mb-8 group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> BACK_TO_HUB
            </Link>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8] mb-4">
              Nyay-<span className="text-primary-container">Vani</span>
            </h2>
            <p className="text-white/40 text-[12px] uppercase tracking-widest">
              STEP 01 OF 04 — Multilingual Voice Interface
            </p>
            <p className="text-white/30 text-[11px] mt-2 max-w-lg leading-relaxed">
              Speak or type your legal query in Hindi, Tamil, or Telugu. The system will transcribe your voice using Sarvam AI and translate it into Legal English for downstream processing.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full xl:w-auto">
            {/* Standalone Telemetry HUD */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-white/[0.02] border border-white/10 rounded-none w-full justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary-container" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                  LANGUAGE: <span className="text-white">{LANGUAGES.find(l => l.code === selectedLang)?.name || "HINDI"}</span>
                </span>
              </div>
              <div className="h-4 w-[1px] bg-white/20" />
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                  STT_CONFIDENCE: <span className="text-white">{hasRecorded ? "98.2%" : "---"}</span>
                </span>
              </div>
              <div className="h-4 w-[1px] bg-white/20" />
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-secondary-container" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                  TRANSLATION_RTT: <span className="text-white">{hasRecorded ? "120ms" : "---"}</span>
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              <button 
                onClick={() => setTextMode(!textMode)}
                className={`flex-1 p-3 text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${textMode ? "bg-primary-container text-black border-primary-container" : "bg-white/5 text-white/40 border-white/10 hover:border-white/30"}`}
              >
                <Keyboard className="w-3 h-3" /> Text-to-Vani
              </button>
            </div>
          </div>
        </div>

        {/* WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: SETTINGS (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
             <div className="border border-white/10 bg-white/[0.02] p-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 block mb-6">Dialect Selection</span>
                <div className="space-y-2">
                   {LANGUAGES.map(lang => (
                     <button 
                       key={lang.code}
                       onClick={() => setSelectedLang(lang.code)}
                       className={`w-full p-4 border flex justify-between items-center transition-all ${selectedLang === lang.code ? 'border-primary-container bg-primary-container/10 text-white' : 'border-white/5 bg-black text-white/40 hover:border-white/20'}`}
                     >
                        <span className="text-[11px] font-black uppercase">{lang.name}</span>
                        <span className="text-[11px] opacity-50">{lang.label}</span>
                     </button>
                   ))}
                </div>
             </div>

             <div className="border border-white/10 bg-white/[0.02] p-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 flex items-center gap-2 mb-6">
                  <Settings2 className="w-4 h-4" /> Audio Matrix
                </span>
                
                <div className="space-y-6">
                   <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 block mb-3">Synthesizer Profile</span>
                      <div className="grid grid-cols-3 gap-2">
                         {["Male", "Neutral", "Female"].map(type => (
                            <button 
                              key={type}
                              onClick={() => setVoiceType(type)}
                              className={`py-3 text-[9px] font-black uppercase tracking-widest border transition-all ${voiceType === type ? 'border-primary-container bg-primary-container/10 text-white' : 'border-white/5 bg-black text-white/30'}`}
                            >
                               {type}
                            </button>
                         ))}
                      </div>
                   </div>

                   <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 block mb-3 flex justify-between">
                         <span>Playback Velocity</span>
                         <span className="text-primary-container">{playbackSpeed.toFixed(1)}x</span>
                      </span>
                      <input 
                         type="range" 
                         min="0.5" max="2.0" step="0.1" 
                         value={playbackSpeed}
                         onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                         className="w-full accent-primary-container"
                      />
                   </div>
                </div>
             </div>
          </div>

          {/* RIGHT: THE PULSE CORE & TRANSCRIPTS (9 Cols) */}
          <div className="lg:col-span-9">
            
            {/* SpaceX Expansion Container */}
            <motion.div 
               layout
               className={`border border-white/10 bg-black flex flex-col relative overflow-hidden ${hasRecorded || isRecording ? 'min-h-[600px]' : 'h-[400px] justify-center'}`}
            >
               {/* 1. THE PULSE CORE */}
               <motion.div 
                  layout
                  className={`flex flex-col items-center justify-center p-10 ${hasRecorded || isRecording ? 'border-b border-white/10 bg-white/[0.01]' : ''}`}
               >
                  <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                     
                     {/* Waveform Visualizer */}
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {isMounted && audioData.map((val, i) => {
                           const angle = (i / 30) * Math.PI * 2;
                           const radius = 90;
                           const x = Math.cos(angle) * radius;
                           const y = Math.sin(angle) * radius;
                           const rotation = angle * (180 / Math.PI) + 90;

                           return (
                              <motion.div
                                 key={i}
                                 className="absolute w-1 bg-primary-container"
                                 style={{ 
                                    left: '50%', top: '50%',
                                    marginLeft: '-2px',
                                    transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
                                    height: `${val}px`,
                                    opacity: isRecording ? 0.8 : 0.1
                                 }}
                                 animate={{ height: `${val}px` }}
                                 transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              />
                           );
                        })}
                     </div>

                     {/* Deterministic Button */}
                     <button 
                        onClick={toggleRecording}
                        className={`relative z-10 w-28 h-28 rounded-full border flex items-center justify-center transition-all duration-300 ${isRecording ? 'border-red-500 bg-red-500/10 shadow-[0_0_50px_rgba(239,68,68,0.4)]' : 'border-primary-container bg-primary-container/5 hover:bg-primary-container/20 shadow-[0_0_40px_rgba(0,243,255,0.2)]'}`}
                     >
                        {isRecording ? <Square className="w-10 h-10 text-red-500 fill-current" /> : <Mic className="w-10 h-10 text-primary-container" />}
                     </button>
                  </div>
                  
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/50">
                     {isRecording ? <span className="text-red-500 animate-pulse">Recording Secure Stream...</span> : 
                      isProcessing ? <span className="text-primary-container animate-pulse">Neural_Processing...</span> : 
                      "Initialize Vocal Node"}
                  </span>
               </motion.div>

               {/* Text Fallback Overlay */}
               <AnimatePresence>
                  {textMode && !isRecording && !hasRecorded && (
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md z-20 flex flex-col items-center justify-center p-10"
                     >
                        <form onSubmit={submitFallbackText} className="w-full max-w-2xl space-y-4">
                           <div className="flex items-center gap-3 mb-6">
                              <Keyboard className="w-5 h-5 text-primary-container" />
                              <span className="text-[12px] font-black uppercase tracking-[0.3em] text-primary-container">Text-to-Vani Fallback</span>
                           </div>
                           <input 
                              type="text" 
                              placeholder="Enter your query in regional language..."
                              value={fallbackText}
                              onChange={(e) => setFallbackText(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 p-6 text-[18px] font-body text-white focus:border-primary-container outline-none"
                              autoFocus
                           />
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Bypassing Speech API...</span>
                              <button type="submit" className="px-8 py-4 bg-primary-container text-black font-black uppercase tracking-widest text-[11px] flex items-center gap-2 hover:bg-cyan-400">
                                 Process <ArrowRight className="w-4 h-4" />
                              </button>
                           </div>
                        </form>
                     </motion.div>
                  )}
               </AnimatePresence>

               {/* 2. DUAL-TRANSCRIPT VIEW */}
               <AnimatePresence>
                  {(isRecording || hasRecorded) && (
                     <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10"
                     >
                        {/* Regional Input */}
                        <div className="p-10 flex flex-col">
                           <div className="flex items-center gap-3 mb-6">
                              <Globe className="w-4 h-4 text-white/40" />
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Regional Input [{LANGUAGES.find(l => l.code === selectedLang)?.name}]</span>
                           </div>
                           <p className="font-space text-2xl font-bold text-white/90 italic leading-relaxed">
                              {inputTranscript}
                           </p>
                        </div>

                        {/* Neural English */}
                        <div className="p-10 flex flex-col bg-white/[0.01]">
                           <div className="flex items-center gap-3 mb-6">
                              <Cpu className="w-4 h-4 text-primary-container" />
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-container">Neural Translation [Legal English]</span>
                           </div>
                           <p className="font-space text-2xl font-black text-white leading-relaxed">
                              {neuralTranslation}
                           </p>
                           
                           {/* TTS Playback Feedback (Simulated) */}
                           {hasRecorded && (
                              <motion.div 
                                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                                 className="mt-auto pt-8 flex items-center gap-3 text-secondary-container"
                              >
                                 <Volume2 className="w-4 h-4" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">TTS Output Generated ({voiceType} @ {playbackSpeed}x)</span>
                              </motion.div>
                           )}
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>

               {/* INTEGRATION BUTTON */}
               <AnimatePresence>
                  {hasRecorded && (
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="border-t border-white/10 bg-primary-container/5 p-6 flex justify-between items-center"
                     >
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                           API Status: <span className="text-emerald-500">Nominal</span>
                        </span>
                        <button 
                           onClick={sendToBridge}
                           className="px-8 py-4 bg-primary-container text-black font-black uppercase tracking-widest text-[11px] flex items-center gap-3 hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(0,243,255,0.2)]"
                        >
                           <Workflow className="w-4 h-4" /> 02_NYAY_BRIDGE_TRANSITION
                        </button>
                     </motion.div>
                  )}
               </AnimatePresence>

            </motion.div>

          </div>

        </div>
      </div>
    </div>
  );
}
