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
  const [telemetry, setTelemetry] = useState({
    accuracy: "---",
    rtt: "---",
    engine: "---"
  });

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
      
      // 1. Setup MediaRecorder for backend archival
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        await processAudio(audioBlob);
      };
      mediaRecorder.start();

      // 2. Setup Web Speech API for INSTANT SMART TRANSCRIPTION
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = selectedLang === "hi" ? "hi-IN" : selectedLang === "ta" ? "ta-IN" : "te-IN";
        recognition.continuous = false; // Changed to false for better one-shot accuracy
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) setInputTranscript(currentTranscript);
        };
        
        recognition.onend = () => {
           // Graceful stop handled by stopActualRecording
        };

        recognition.start();
        (window as any)._nyayRecognition = recognition;
      }
      
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
      
      // CRITICAL: Reset transcripts for new session
      setInputTranscript("");
      setNeuralTranslation("");
      setTelemetry({ accuracy: "---", rtt: "---", engine: "---" });
      
      // Delay placeholder to ensure UI re-render
      setTimeout(() => {
        setInputTranscript("सुन रहा हूँ... (Listening...)");
      }, 100);
      
    } catch (err) {
      console.warn("[NYAY-VANI_DEBUG] Microphone access failed:", err);
      toast.error("Mic access denied or hardware error.");
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    setNeuralTranslation("Analyzing neural signal...");
    
    try {
      let transcription = inputTranscript;
      
      // 1. Backend STT Fallback
      if (!transcription || transcription === "" || transcription.includes("Listening")) {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        await new Promise((resolve) => (reader.onloadend = resolve));
        const base64Audio = (reader.result as string).split(',')[1];
        
        try {
          const sttRes = await fetch(`http://localhost:8003/api/vani/stt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              audio_content: base64Audio,
              language_code: selectedLang
            })
          });
          const sttData = await sttRes.json();
          const serverTranscription = sttData.output?.transcription || "";
          
          // Only use server transcript if it's NOT the error message
          if (serverTranscription && !serverTranscription.includes("STT unavailable")) {
            transcription = serverTranscription;
            setInputTranscript(transcription);
            setTelemetry(prev => ({
              ...prev,
              accuracy: (sttData.telemetry?.stt_accuracy * 100).toFixed(1) + "%",
              engine: sttData.telemetry?.stt_engine || "gemini-neural"
            }));
          }
        } catch (e) {
          console.error("Backend STT fetch failed:", e);
        }
      }

      // 2. Mandatory Neural Translation
      // Filter out any leftover error messages or placeholders
      const cleanTranscript = transcription.replace("सुन रहा हूँ... (Listening...)", "").trim();

      if (cleanTranscript && !cleanTranscript.includes("STT unavailable") && cleanTranscript.length > 1) {
        setNeuralTranslation("Analyzing neural signal...");
        const queryRes = await fetch(`http://localhost:8003/api/vani/query`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: cleanTranscript,
            language: selectedLang
          })
        });
        const queryData = await queryRes.json();
        const englishAnswer = queryData.output?.english_answer || "Grounding failed.";
        const nativeAnswer = queryData.output?.native_answer || cleanTranscript;
        
        // Show English Kernel Answer in the UI
        setNeuralTranslation(englishAnswer);
        setTelemetry(prev => ({
          ...prev,
          rtt: queryData.telemetry?.processing_time_ms + "ms",
          engine: "kernel_grounding"
        }));
        setHasRecorded(true);

        // 3. Bidirectional Audio Output (Vani Response in Native Language)
        if (window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(nativeAnswer);
          utterance.lang = selectedLang === "hi" ? "hi-IN" : selectedLang === "ta" ? "ta-IN" : "te-IN";
          utterance.rate = playbackSpeed;
          // Select voice based on voiceType
          const voices = window.speechSynthesis.getVoices();
          const targetVoice = voices.find(v => 
            (v.lang.includes(selectedLang) || v.lang.includes('IN')) && 
            (voiceType === "Male" ? v.name.includes("Male") || v.name.includes("David") : 
             voiceType === "Female" ? v.name.includes("Female") || v.name.includes("Zira") : true)
          );
          if (targetVoice) utterance.voice = targetVoice;
          window.speechSynthesis.speak(utterance);
        }
      } else {
        setNeuralTranslation("No neural signal detected. Please check microphone or try Text-to-Vani.");
        setHasRecorded(true); 
      }
    } catch (err) {
      console.error("[NYAY-VANI_ERROR] Processing failed:", err);
      toast.error("Neural Bridge Offline. Using direct transcript.");
      setNeuralTranslation(inputTranscript || "Processing failed.");
      setHasRecorded(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const sendToBridge = () => {
    setNeuralState({
      activeQuery: neuralTranslation
    });
    toast.success("Context established. Pushing to Nyay-Bridge...");
    router.push("/nyay-bridge");
  };

  const stopActualRecording = () => {
    setIsRecording(false);
    
    // 1. Stop Browser Speech Recognition
    if ((window as any)._nyayRecognition) {
      try {
        (window as any)._nyayRecognition.stop();
        delete (window as any)._nyayRecognition;
      } catch (e) {
        console.error("Error stopping recognition:", e);
      }
    }

    // 2. Cleanup Web Audio resources
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
      const res = await fetch(`http://localhost:8003/api/vani/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: fallbackText,
          language: selectedLang
        })
      });
      const data = await res.json();
      const englishAnswer = data.output?.english_answer || "Grounding failed.";
      const nativeAnswer = data.output?.native_answer || fallbackText;
      
      setNeuralTranslation(englishAnswer);
      setTelemetry({
        accuracy: "100%",
        rtt: data.telemetry?.processing_time_ms + "ms",
        engine: "text_query_grounding"
      });
      setHasRecorded(true);

      // Bidirectional Audio Output for Text Mode
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(nativeAnswer);
        utterance.lang = selectedLang === "hi" ? "hi-IN" : selectedLang === "ta" ? "ta-IN" : "te-IN";
        utterance.rate = playbackSpeed;
        const voices = window.speechSynthesis.getVoices();
        const targetVoice = voices.find(v => 
          (v.lang.includes(selectedLang) || v.lang.includes('IN')) && 
          (voiceType === "Male" ? v.name.includes("Male") || v.name.includes("David") : 
           voiceType === "Female" ? v.name.includes("Female") || v.name.includes("Zira") : true)
        );
        if (targetVoice) utterance.voice = targetVoice;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error("[NYAY-VANI_ERROR] Query failed:", err);
      setNeuralTranslation(fallbackText);
      setHasRecorded(true);
    } finally {
      setIsProcessing(false);
    }
  };



  return (
    <div className="min-h-screen bg-black text-white font-space pt-24 pb-20 px-6 md:px-10 overflow-x-hidden relative selection:bg-primary-container selection:text-black">
      
      {/* 1. HUGE FADED TITLE */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none z-0">
        <h1 className="text-[14vw] font-black tracking-tighter uppercase opacity-[0.02] leading-none select-none">
          NYAY-VANI
        </h1>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10 pt-48">
        
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
                  STT_CONFIDENCE: <span className="text-white">{telemetry.accuracy}</span>
                </span>
              </div>
              <div className="h-4 w-[1px] bg-white/20" />
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-secondary-container" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                  TRANSLATION_RTT: <span className="text-white">{telemetry.rtt}</span>
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              <button 
                onClick={() => setTextMode(!textMode)}
                className={`flex-1 p-3 text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${textMode ? "bg-primary-container text-white border-primary-container shadow-[0_0_15px_rgba(224,30,34,0.2)]" : "bg-white/5 text-white/40 border-white/10 hover:border-white/30"}`}
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
                       className={`w-full p-4 border flex justify-between items-center transition-all ${selectedLang === lang.code ? 'border-primary-container bg-primary-container text-white shadow-[0_0_15px_rgba(224,30,34,0.2)]' : 'border-white/5 bg-black text-white/40 hover:border-white/20'}`}
                     >
                        <span className="text-[11px] font-black uppercase">{lang.name}</span>
                        <span className="text-[11px] opacity-70">{lang.label}</span>
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
                              className={`py-3 text-[9px] font-black uppercase tracking-widest border transition-all ${voiceType === type ? 'border-primary-container bg-primary-container text-white shadow-[0_0_10px_rgba(224,30,34,0.15)]' : 'border-white/5 bg-black text-white/30'}`}
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
                              <button type="submit" className="px-8 py-4 bg-primary-container text-white font-black uppercase tracking-widest text-[11px] flex items-center gap-2">
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
                  {(hasRecorded || neuralTranslation.length > 20) && !isRecording && (
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="border-t border-white/10 bg-primary-container/5 p-6 flex flex-col md:flex-row justify-between items-center gap-4"
                     >
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                             Context Health: <span className="text-emerald-500">Nominal</span>
                          </span>
                          <span className="text-[8px] font-bold uppercase tracking-widest text-white/20">
                            Neural Vector Ready for Bridge Transition
                          </span>
                        </div>
                        <button 
                           onClick={sendToBridge}
                           className="w-full md:w-auto px-8 py-4 bg-primary-container text-white font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-red-700 transition-colors shadow-[0_0_25px_rgba(224,30,34,0.3)]"
                        >
                          <Workflow className="w-4 h-4" /> CONTINUE TO NYAY-BRIDGE [STEP_02]
                        </button>
                     </motion.div>
                  )}
               </AnimatePresence>

            </motion.div>

          </div>

        </div>
       </div>
       
       {/* SPACER FOR CONTENT END */}
       <div className="h-32" />

       {/* SIGNATURE (Same as Landing Page) */}
       <div className="max-w-7xl mx-auto mb-10 px-10">
          <div className="font-space text-5xl md:text-[10rem] font-black tracking-tighter leading-none opacity-5 hover:opacity-10 transition-opacity select-none text-white">
             NYAY-MITRA
          </div>
          <div className="font-space text-[10px] tracking-widest opacity-30 uppercase font-bold mt-4 text-white">
             © 2026 Sovereign_Judicial_Engine
          </div>
       </div>

    </div>
  );
}
