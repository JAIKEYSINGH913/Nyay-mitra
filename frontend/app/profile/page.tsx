"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  Phone, 
  LogOut, 
  Terminal, 
  ArrowLeft, 
  Key, 
  History, 
  Trash2, 
  Edit3, 
  Save,
  ShieldAlert,
  X,
  Fingerprint,
  Activity,
  UserCheck,
  AlertTriangle
} from "lucide-react";
import { account, databases, NYAY_DB_ID, COLLECTIONS } from "@/lib/appwrite";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Security States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpPurpose, setOtpPurpose] = useState<"delete" | "reset" | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);

  const [editData, setEditData] = useState({
    fullName: "",
    username: "",
    phone: "",
    dob: ""
  });

  const fetchData = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
      
      try {
        const userProfile = await databases.getDocument(NYAY_DB_ID, COLLECTIONS.PROFILES, currentUser.$id);
        setProfile(userProfile);
        setEditData({
          fullName: userProfile.fullName || currentUser.name || "",
          username: userProfile.username || "",
          phone: userProfile.phone || "",
          dob: userProfile.dob || ""
        });
      } catch (e) {
        setEditData({
          fullName: currentUser.name || "",
          username: "",
          phone: "",
          dob: ""
        });
        setEditing(true); 
      }
    } catch (err: any) {
      if (err.code === 401) window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      window.location.href = "/";
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const payload = {
        fullName: editData.fullName,
        username: editData.username,
        phone: editData.phone,
        dob: editData.dob,
        email: user.email,
        isProfileComplete: true
      };

      if (!profile) {
        const newDoc = await databases.createDocument(NYAY_DB_ID, COLLECTIONS.PROFILES, user.$id, payload);
        setProfile(newDoc);
      } else {
        await databases.updateDocument(NYAY_DB_ID, COLLECTIONS.PROFILES, user.$id, payload);
        setProfile({ ...profile, ...payload });
      }
      setEditing(false);
      toast.success("Identity updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const initiateSecurityAction = async (purpose: "delete" | "reset") => {
    setOtpPurpose(purpose);
    setOtpLoading(true);
    try {
      await account.createEmailToken(user.$id, user.email);
      setShowOtpModal(true);
      toast.success("Verification code sent to your email.");
    } catch (err) {
      toast.error("Could not send code.");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifySecurityAction = async () => {
    setOtpLoading(true);
    try {
      await account.createSession(user.$id, otpValue);
      
      if (otpPurpose === "delete") {
        await databases.deleteDocument(NYAY_DB_ID, COLLECTIONS.PROFILES, user.$id);
        await account.deleteSession("current");
        toast.success("Account deleted.");
        window.location.href = "/";
      } else if (otpPurpose === "reset") {
        await account.createRecovery(user.email, `${window.location.origin}/reset-password`);
        toast.success("Reset link sent.");
        setShowOtpModal(false);
      }
    } catch (err) {
      toast.error("Invalid code.");
    } finally {
      setOtpLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-space text-white">
        <div className="w-10 h-10 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-20 px-6 font-space selection:bg-primary-container selection:text-black relative">
      
      {/* BACKGROUND TITLE */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none z-0">
        <h1 className="text-[15vw] font-black tracking-tighter uppercase opacity-[0.05] leading-none select-none">
          PROFILE
        </h1>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* NAV */}
        <div className="pt-[10vw] mb-12">
          <Link href="/" className="inline-flex items-center gap-4 text-[12px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-primary-container transition-all group">
            <div className="w-12 h-[1px] bg-white/10 group-hover:bg-primary-container transition-all" />
            <ArrowLeft className="w-4 h-4" /> RETURN TO HUB
          </Link>
        </div>

        {/* PROFILE CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          {/* TOP SECTION */}
          <div className="p-8 md:p-12 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-primary-container flex items-center justify-center shadow-[0_0_30px_rgba(0,243,255,0.3)]">
                  <User className="w-10 h-10 text-black" />
                </div>
                <div>
                   <h2 className="text-3xl font-black tracking-tighter uppercase mb-1">
                     {profile?.fullName || user?.name || "User"}
                   </h2>
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Standard Identification // {user?.$id.slice(0, 8)}</p>
                </div>
             </div>
             
             <div className="flex gap-3">
                <button 
                  onClick={() => setEditing(!editing)}
                  className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-container hover:text-black transition-all transform hover:scale-105 active:scale-95"
                >
                  {editing ? "Cancel" : "Edit Details"}
                </button>
                <button 
                  onClick={() => setShowLogoutModal(true)}
                  className="px-4 py-3 bg-white/5 border border-white/10 text-white/40 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all transform hover:scale-110 active:scale-90"
                >
                   <LogOut className="w-4 h-4" />
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
             {/* LEFT: INFO */}
             <div className="p-8 md:p-12 space-y-10 border-r border-white/5">
                <div className="space-y-6">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Profile Settings</h3>
                   
                   {editing ? (
                     <div className="space-y-4">
                        <SimpleEditField label="Name" value={editData.fullName} onChange={(v) => setEditData({...editData, fullName: v})} />
                        <SimpleEditField label="Username" value={editData.username} onChange={(v) => setEditData({...editData, username: v})} />
                        <SimpleEditField label="Phone" value={editData.phone} onChange={(v) => setEditData({...editData, phone: v})} />
                        <SimpleEditField label="Birthday" value={editData.dob} onChange={(v) => setEditData({...editData, dob: v})} />
                        
                        <div className="grid grid-cols-2 gap-3 pt-4">
                           <button 
                             onClick={() => setEditing(false)}
                             className="py-4 border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all"
                           >
                             Cancel
                           </button>
                           <button 
                             onClick={handleSaveProfile}
                             disabled={saving}
                             className="py-4 bg-primary-container text-black font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all shadow-lg active:scale-95"
                           >
                             {saving ? "Saving..." : "Save"}
                           </button>
                        </div>
                     </div>
                   ) : (
                     <div className="space-y-4">
                        <SimpleInfo icon={<Mail />} label="Email" value={user?.email} />
                        <SimpleInfo icon={<Phone />} label="Phone" value={profile?.phone || "Not added"} />
                        <SimpleInfo icon={<ShieldCheck />} label="Username" value={profile?.username || "Not added"} />
                        <SimpleInfo icon={<Calendar />} label="Birthday" value={profile?.dob || "Not added"} />
                     </div>
                   )}
                </div>
             </div>

             {/* RIGHT: ACTIONS */}
             <div className="p-8 md:p-12 space-y-10">
                <div className="space-y-6">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Security</h3>
                   
                   <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-white/30">Verification Status</span>
                        <span className={`text-[10px] font-black uppercase ${user?.emailVerification ? "text-green-500" : "text-yellow-500"}`}>
                          {user?.emailVerification ? "Verified" : "Action Required"}
                        </span>
                      </div>

                      <div className="pt-4 space-y-2">
                        <button 
                          onClick={() => initiateSecurityAction("reset")}
                          className="w-full py-4 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-container hover:text-black transition-all"
                        >
                          Reset Password
                        </button>
                        <button 
                          onClick={() => initiateSecurityAction("delete")}
                          className="w-full py-4 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all"
                        >
                          Delete Account
                        </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>

        {/* SIGNATURE SECTION */}
        <div className="mt-32 pb-20">
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

      {/* LOGOUT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLogoutModal(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl"
            >
               <div className="text-center space-y-8">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-black uppercase tracking-tighter text-white">Terminate Session?</h2>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">Are you sure you want to log out of the Nyay-Mitra dashboard?</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-5 border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/5 transition-all">Cancel</button>
                    <button onClick={handleLogout} className="flex-1 py-5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]">Logout</button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VERIFICATION MODAL */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowOtpModal(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm bg-[#050505] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl"
            >
               <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-red-600/10 border border-red-600/30 rounded-full flex items-center justify-center mx-auto">
                    <ShieldAlert className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tighter text-white">Security Check</h2>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Enter the code sent to your email</p>
                  
                  <input 
                    type="text" 
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    placeholder="000000"
                    className="w-full bg-white/5 border border-white/10 py-5 text-center text-3xl font-black tracking-[0.2em] text-red-600 focus:outline-none focus:border-red-600 rounded-2xl"
                  />

                  <div className="flex gap-3">
                    <button onClick={() => setShowOtpModal(false)} className="flex-1 py-4 bg-white/5 text-[10px] font-black uppercase tracking-widest rounded-xl">Abort</button>
                    <button onClick={verifySecurityAction} disabled={otpLoading || otpValue.length < 6} className="flex-1 py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl disabled:opacity-50">Confirm</button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SimpleEditField({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.03] border border-white/10 py-4 px-5 text-[12px] uppercase tracking-widest text-white focus:outline-none focus:border-primary-container rounded-xl transition-all"
      />
    </div>
  );
}

function SimpleInfo({ icon, label, value }: { icon: React.ReactElement, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-primary-container/30 transition-all">
      <div className="text-white/20 group-hover:text-primary-container transition-colors">
        {React.cloneElement(icon as React.ReactElement<any>, { className: "w-4 h-4" })}
      </div>
      <div>
        <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-0.5">{label}</div>
        <div className="text-[11px] font-black text-white/80 uppercase tracking-widest">{value}</div>
      </div>
    </div>
  );
}
