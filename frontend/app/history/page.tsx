"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, 
  Trash2, 
  ChevronRight, 
  Search, 
  Calendar, 
  Clock, 
  Terminal, 
  MessageSquare,
  ArrowLeft,
  X,
  Database,
  Activity,
  Cpu,
  ShieldCheck,
  Zap,
  User
} from "lucide-react";
import { account, databases, NYAY_DB_ID, COLLECTIONS } from "@/lib/appwrite";
import { Query } from "appwrite";
import Link from "next/link";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const [user, setUser] = useState<any>(null);
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const fetchHistory = async (userId: string) => {
    try {
      const response = await databases.listDocuments(
        NYAY_DB_ID,
        COLLECTIONS.CHAT_HISTORY,
        [
          Query.equal("userId", userId),
          Query.orderDesc("createdAt")
        ]
      );
      setHistoryItems(response.documents);
    } catch (err: any) {
      toast.error("Failed to load judicial history.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    setMessagesLoading(true);
    try {
      const response = await databases.listDocuments(
        NYAY_DB_ID,
        COLLECTIONS.MESSAGES,
        [
          Query.equal("chatId", chatId),
          Query.orderAsc("timestamp")
        ]
      );
      setMessages(response.documents);
    } catch (err) {
      toast.error("Could not retrieve log details.");
    } finally {
      setMessagesLoading(false);
    }
  };

  const deleteHistoryItem = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await databases.deleteDocument(NYAY_DB_ID, COLLECTIONS.CHAT_HISTORY, docId);
      setHistoryItems(historyItems.filter(item => item.$id !== docId));
      if (selectedChat?.$id === docId) setSelectedChat(null);
      toast.success("LOG_PURGED: Record deleted.");
    } catch (err) {
      toast.error("Failed to delete record.");
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        fetchHistory(currentUser.$id);
      } catch {
        window.location.href = "/";
      }
    };
    init();
  }, []);

  const handleSelectChat = (chat: any) => {
    setSelectedChat(chat);
    fetchMessages(chat.$id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 md:px-10 font-space overflow-x-hidden relative selection:bg-primary-container selection:text-black">
      
      {/* BACKGROUND TITLE */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none z-0">
        <h1 className="text-[15vw] font-black tracking-tighter uppercase opacity-[0.05] leading-none whitespace-nowrap select-none">
          HISTORY
        </h1>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 pt-64">
        
        {/* HEADER */}
        <div className="mb-16">
          <Link href="/" className="inline-flex items-center gap-4 text-[12px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-primary-container transition-all group mb-8">
            <div className="w-12 h-[1px] bg-white/10 group-hover:bg-primary-container transition-all" />
            <ArrowLeft className="w-4 h-4" /> Command Center
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 leading-tight">
              Judicial <br /> <span className="text-primary-container">Activity Logs</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-32">
          
          {/* LEFT: LIST OF LOGS (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
             <div className="flex items-center gap-3 opacity-30 mb-6">
                <Terminal className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Records</span>
             </div>

             {historyItems.length === 0 ? (
               <div className="p-12 border border-white/5 bg-white/[0.02] rounded-[2rem] text-center space-y-4">
                  <Activity className="w-10 h-10 text-white/10 mx-auto" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20">No judicial records found.</p>
               </div>
             ) : (
               historyItems.map((item) => (
                 <motion.div
                   key={item.$id}
                   whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                   onClick={() => handleSelectChat(item)}
                   className={`p-6 border border-white/5 rounded-2xl flex items-center justify-between cursor-pointer transition-all group ${selectedChat?.$id === item.$id ? "bg-white/[0.05] border-primary-container/30" : "bg-white/[0.01]"}`}
                 >
                    <div className="flex items-center gap-4 overflow-hidden">
                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary-container transition-colors">
                          <MessageSquare className="w-5 h-5" />
                       </div>
                       <div className="overflow-hidden">
                          <h4 className="text-[13px] font-black uppercase tracking-tight truncate w-full group-hover:text-white transition-colors">{item.title}</h4>
                          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                             <Calendar className="w-3 h-3" /> {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                       </div>
                    </div>
                    <button 
                      onClick={(e) => deleteHistoryItem(item.$id, e)}
                      className="p-3 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                       <Trash2 className="w-4 h-4" />
                    </button>
                 </motion.div>
               ))
             )}
          </div>

          {/* RIGHT: LOG DETAILS (7 Cols) */}
          <div className="lg:col-span-7">
             <AnimatePresence mode="wait">
                {selectedChat ? (
                  <motion.div
                    key={selectedChat.$id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="h-full min-h-[600px] border border-white/10 bg-white/[0.02] rounded-[3rem] overflow-hidden flex flex-col backdrop-blur-3xl"
                  >
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                       <div>
                          <h3 className="text-xl font-black uppercase tracking-tighter">{selectedChat.title}</h3>
                          <p className="text-[9px] font-black text-primary-container uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                             <ShieldCheck className="w-3 h-3" /> VERIFIED_SESSION // {selectedChat.$id.slice(0, 8)}
                          </p>
                       </div>
                       <button onClick={() => setSelectedChat(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                          <X className="w-5 h-5 opacity-30" />
                       </button>
                    </div>

                    <div className="flex-1 p-8 overflow-y-auto space-y-8 custom-scrollbar">
                       {messagesLoading ? (
                         <div className="h-full flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
                         </div>
                       ) : (
                         messages.map((msg, i) => (
                           <motion.div
                             key={msg.$id}
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: i * 0.05 }}
                             className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                           >
                              <div className="flex items-center gap-2 mb-2 opacity-30">
                                 {msg.role === "user" ? <User className="w-3 h-3" /> : <Cpu className="w-3 h-3 text-primary-container" />}
                                 <span className="text-[8px] font-black uppercase tracking-widest">{msg.role}</span>
                              </div>
                              <div className={`p-6 rounded-2xl max-w-[90%] text-[13px] leading-relaxed font-medium ${msg.role === "user" ? "bg-white/5 text-white/80" : "bg-primary-container/5 border border-primary-container/20 text-white"}`}>
                                 {msg.content}
                              </div>
                           </motion.div>
                         ))
                       )}
                    </div>

                    <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
                       <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">End of Record Transmission</span>
                       <div className="flex gap-4">
                          <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all">
                             <Zap className="w-3 h-3" /> Re-execute Query
                          </button>
                       </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full min-h-[600px] border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 space-y-6">
                     <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/10">
                        <Database className="w-10 h-10" />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-xl font-black uppercase tracking-tighter opacity-30">Select a Log Entry</h4>
                        <p className="text-[10px] font-black text-white/10 uppercase tracking-widest max-w-[200px]">Choose a record from the left to view detailed judicial processing.</p>
                     </div>
                  </div>
                )}
             </AnimatePresence>
          </div>
        </div>

        {/* SIGNATURE SECTION */}
        <div className="mt-32 pb-20 border-t border-white/5 pt-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-16 relative z-10">
             <div className="font-space text-5xl md:text-[8rem] font-black tracking-tighter leading-none opacity-5 hover:opacity-10 transition-opacity select-none cursor-default">
               NYAY-MITRA
             </div>
             <div className="font-space text-[10px] tracking-widest opacity-30 uppercase font-bold mb-4">
               © 2026 Sovereign_Judicial_Engine
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
