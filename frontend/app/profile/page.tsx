"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, ShieldCheck, Calendar, Phone, LogOut, Terminal, ArrowLeft, Key, History, Trash2, Edit3, Save } from "lucide-react";
import { account, databases, NYAY_DB_ID, COLLECTIONS } from "@/lib/appwrite";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const [editData, setEditData] = useState({
    fullName: "",
    username: "",
    phone: "",
    dob: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        
        // Fetch from database using the same ID
        const userProfile = await databases.getDocument(NYAY_DB_ID, COLLECTIONS.PROFILES, currentUser.$id);
        setProfile(userProfile);
        setEditData({
          fullName: userProfile.fullName,
          username: userProfile.username,
          phone: userProfile.phone || "",
          dob: userProfile.dob || ""
        });
      } catch (err) {
        console.error("Profile Fetch Error:", err);
        // If profile document doesn't exist but user does, it might be an old user
        // We'll handle this by showing placeholders or redirecting
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await databases.updateDocument(NYAY_DB_ID, COLLECTIONS.PROFILES, user.$id, {
        fullName: editData.fullName,
        username: editData.username,
        phone: editData.phone,
        dob: editData.dob
      });
      setProfile({ ...profile, ...editData });
      setEditing(false);
      setMessage({ type: "success", text: "IDENTITY_UPDATED: Profile parameters synchronized." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "SYNC_FAILED: Could not update profile." });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await account.createRecovery(user.email, `${window.location.origin}/reset-password`);
      setMessage({ type: "success", text: "RESET_LINK_SENT: Check your primary email for verification OTP." });
    } catch (err: any) {
      setMessage({ type: "error", text: "DISPATCH_FAILED: Could not send reset link." });
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("CRITICAL_ACTION: This will permanently purge your identity from Nyay-Mitra. Proceed?")) {
      try {
        // Appwrite account delete is usually for Admin SDK, 
        // but we can delete the profile and log out.
        await databases.deleteDocument(NYAY_DB_ID, COLLECTIONS.PROFILES, user.$id);
        await account.deleteSession("current");
        window.location.href = "/";
      } catch (err) {
        setMessage({ type: "error", text: "PURGE_FAILED: Could not delete account records." });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono text-primary-container">
        INITIALIZING_PROFILE_TERMINAL...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest hover:text-primary-container transition-colors">
            <ArrowLeft className="w-3 h-3" /> Return_to_Core
          </Link>
          {message && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border ${message.type === "success" ? "bg-green-500/10 border-green-500/50 text-green-500" : "bg-red-500/10 border-red-500/50 text-red-500"}`}
            >
              {message.text}
            </motion.div>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel border border-border-color overflow-hidden rounded-2xl"
        >
          {/* Header */}
          <div className="p-8 border-b border-border-color bg-bg-surface-low flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full border-2 border-primary-container flex items-center justify-center bg-primary-container/10">
                <User className="w-10 h-10 text-primary-container" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tighter text-text-primary uppercase">{profile?.fullName || user?.name || "ANONYMOUS_OPERATOR"}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-2 py-0.5 bg-primary-container/20 text-primary-container text-[8px] font-bold uppercase tracking-widest border border-primary-container/30">LEVEL_1_VERIFIED</span>
                  <span className="text-[10px] font-mono text-text-muted">UID: {user?.$id}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setEditing(!editing)}
                className="px-6 py-3 border border-border-color text-text-primary text-[10px] font-bold uppercase tracking-widest hover:border-primary-container transition-all flex items-center gap-2"
              >
                {editing ? <><ArrowLeft className="w-4 h-4" /> Cancel</> : <><Edit3 className="w-4 h-4" /> Edit_Identity</>}
              </button>
              <button 
                onClick={handleLogout}
                className="px-6 py-3 border border-red-500/50 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Terminate_Session
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Identity Column */}
            <div className="space-y-6">
               <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                 <Terminal className="w-4 h-4 text-primary-container" /> Identity_Details
               </h3>
               
               <div className="space-y-4">
                 {editing ? (
                   <div className="space-y-4">
                     <EditField label="FULL_NAME" value={editData.fullName} onChange={(v) => setEditData({...editData, fullName: v})} />
                     <EditField label="USERNAME" value={editData.username} onChange={(v) => setEditData({...editData, username: v})} />
                     <EditField label="PHONE" value={editData.phone} onChange={(v) => setEditData({...editData, phone: v})} />
                     <EditField label="DATE_OF_BIRTH" value={editData.dob} onChange={(v) => setEditData({...editData, dob: v})} />
                     <button 
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="w-full btn-industrial py-4 flex items-center justify-center gap-2"
                     >
                       <Save className="w-4 h-4" /> {saving ? "SYNCHRONIZING..." : "SAVE_PARAMETERS"}
                     </button>
                   </div>
                 ) : (
                   <>
                     <InfoField icon={<Mail className="w-4 h-4" />} label="Email_Identity" value={user?.email} />
                     <InfoField icon={<Phone className="w-4 h-4" />} label="Communication_Line" value={profile?.phone || "NOT_ASSIGNED"} />
                     <InfoField icon={<ShieldCheck className="w-4 h-4" />} label="System_Alias" value={profile?.username || "GUEST"} />
                     <InfoField icon={<Calendar className="w-4 h-4" />} label="Temporal_Origin" value={profile?.dob || "UNKNOWN"} />
                   </>
                 )}
               </div>
            </div>

            {/* Security & History Column */}
            <div className="space-y-8">
               <div className="space-y-6">
                 <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4 text-accent-red" /> Security_Protocol
                 </h3>
                 
                 <div className="p-6 border border-border-color bg-bg-surface-low rounded-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase text-text-muted">Account_Verification</span>
                      <span className={user?.emailVerification ? "text-[10px] font-bold uppercase text-green-500" : "text-[10px] font-bold uppercase text-yellow-500"}>
                        {user?.emailVerification ? "VERIFIED" : "PENDING"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border-color">
                      <button 
                        onClick={handlePasswordReset}
                        className="py-3 bg-bg-surface-high border border-border-color text-[9px] font-bold uppercase tracking-widest hover:border-primary-container transition-all flex items-center justify-center gap-2"
                      >
                        <Key className="w-3 h-3" /> Reset_Password
                      </button>
                      <button 
                        onClick={handleDeleteAccount}
                        className="py-3 bg-red-500/5 border border-red-500/20 text-red-500 text-[9px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-3 h-3" /> Purge_Identity
                      </button>
                    </div>
                 </div>
               </div>

               <div className="space-y-6">
                 <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                   <History className="w-4 h-4 text-blue-500" /> Operational_History
                 </h3>
                 
                 <div className="p-6 border border-border-color bg-bg-surface-low rounded-xl space-y-4">
                    <p className="text-[10px] text-text-muted uppercase italic">No active logs found in current sector.</p>
                    <button className="w-full py-3 bg-bg-surface-high border border-border-color text-[9px] font-bold uppercase tracking-widest hover:border-blue-500 transition-all flex items-center justify-center gap-2">
                      <History className="w-3 h-3" /> Clear_Session_Logs
                    </button>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function EditField({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-[8px] font-bold text-text-muted uppercase tracking-widest pl-1">{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-bg-surface-low border border-border-color py-3 px-4 font-mono text-[11px] uppercase tracking-widest text-text-primary focus:outline-none focus:border-primary-container transition-all"
      />
    </div>
  );
}

function InfoField({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 border border-border-color bg-bg-surface-high/10 rounded-lg">
      <div className="text-text-muted">{icon}</div>
      <div>
        <div className="text-[8px] font-bold text-text-muted uppercase tracking-widest mb-1">{label}</div>
        <div className="text-[11px] font-mono text-text-primary uppercase">{value}</div>
      </div>
    </div>
  );
}
