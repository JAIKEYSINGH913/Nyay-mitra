"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Info,
  ShieldEllipsis,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { account, ID, databases, NYAY_DB_ID, COLLECTIONS } from "@/lib/appwrite";
import { Permission, Role, Query, OAuthProvider } from "appwrite";
import toast from "react-hot-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

type AuthMode = "login" | "signup" | "otp-verify" | "forgot-password" | "reset-verify" | "new-password";

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captcha, setCaptcha] = useState({ question: "", answer: 0 });
  const [userInputCaptcha, setUserInputCaptcha] = useState("");
  
  // OTP States
  const [otpValue, setOtpValue] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const [userIdForVerification, setUserIdForVerification] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    name: "",
    phone: "",
    dob: "",
  });

  useEffect(() => {
    generateCaptcha();
  }, [mode]);

  useEffect(() => {
    let interval: any;
    if (mode === "otp-verify" || mode === "reset-verify") {
      setTimer(60);
      setCanResend(false);
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode]);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({
      question: `${num1} + ${num2}`,
      answer: num1 + num2
    });
    setUserInputCaptcha("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateCaptcha = () => {
    return parseInt(userInputCaptcha) === captcha.answer;
  };

  const PrimaryButton = ({ children, onClick, disabled, type = "submit" }: any) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition-all duration-300 text-white border border-white/20 bg-red-600 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
    >
      {children}
    </button>
  );

  const checkUniqueness = async () => {
    try {
      const results = await Promise.all([
        databases.listDocuments(NYAY_DB_ID, COLLECTIONS.PROFILES, [Query.equal("username", formData.username)]),
        databases.listDocuments(NYAY_DB_ID, COLLECTIONS.PROFILES, [Query.equal("email", formData.email)]),
        databases.listDocuments(NYAY_DB_ID, COLLECTIONS.PROFILES, [Query.equal("phone", formData.phone)])
      ]);

      if (results[0].total > 0) throw new Error("USERNAME_TAKEN: Identify conflict detected.");
      if (results[1].total > 0) throw new Error("EMAIL_EXISTS: Primary communication line already registered.");
      if (results[2].total > 0) throw new Error("PHONE_EXISTS: Telemetry number already in use.");
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateCaptcha()) {
      setError("CAPTCHA_FAILED: Incorrect result.");
      generateCaptcha();
      return;
    }
    setLoading(true);
    try {
      // Check if it's email or username
      let email = formData.email;
      if (!email.includes("@")) {
          const userDoc = await databases.listDocuments(NYAY_DB_ID, COLLECTIONS.PROFILES, [Query.equal("username", formData.email)]);
          if (userDoc.total > 0) email = userDoc.documents[0].email;
          else throw new Error("IDENTITY_NOT_FOUND: Username unrecognized.");
      }

      await account.createEmailPasswordSession(email, formData.password);
      const user = await account.get();
      toast.success("SYSTEM_ACCESS_GRANTED: Welcome back.");
      onSuccess(user);
      onClose();
      window.location.href = "/profile";
    } catch (err: any) {
      setError(err.message || "AUTHENTICATION_FAILED: Verification mismatch.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError("CIPHER_MISMATCH: Passwords do not align.");
      return;
    }
    setLoading(true);
    
    const isUnique = await checkUniqueness();
    if (!isUnique) {
      setLoading(false);
      return;
    }

    try {
      // Create user first
      const user = await account.create(ID.unique(), formData.email, formData.password, formData.name);
      setUserIdForVerification(user.$id);
      
      // Send OTP (using Appwrite Email Token or verification link)
      // For real OTP we use createEmailToken, but for standard email verify we use createVerification
      // The user asked for "otp", so let's use createEmailToken if possible or simulate for this build
      await account.createEmailToken(user.$id, formData.email);
      
      toast.success("VERIFICATION_DISPATCHED: Check your encrypted inbox.");
      setMode("otp-verify");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await account.createSession(userIdForVerification!, otpValue);
      
      // Successfully verified, now create the profile document
      await databases.createDocument(NYAY_DB_ID, COLLECTIONS.PROFILES, userIdForVerification!, {
        username: formData.username,
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        isProfileComplete: true
      }, [
        Permission.read(Role.user(userIdForVerification!)),
        Permission.update(Role.user(userIdForVerification!)),
      ]);

      toast.success("IDENTITY_SYNCHRONIZED: Account fully operational.");
      const user = await account.get();
      onSuccess(user);
      onClose();
      window.location.href = "/profile";
    } catch (err: any) {
      setError("OTP_INVALID: Verification sequence failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Find user ID by email
      const userList = await databases.listDocuments(NYAY_DB_ID, COLLECTIONS.PROFILES, [Query.equal("email", formData.email)]);
      if (userList.total === 0) throw new Error("TARGET_NOT_FOUND: Email not in system.");
      
      setUserIdForVerification(userList.documents[0].$id);
      await account.createRecovery(formData.email, `${window.location.origin}/reset-password`);
      
      toast.success("RESET_PROTOCOL_INITIATED: Verification link sent.");
      setMode("reset-verify");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: any) => {
    account.createOAuth2Session(provider as OAuthProvider, `${window.location.origin}/auth-callback`, `${window.location.origin}/login`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} 
        className="absolute inset-0 bg-black/20 backdrop-blur-[60px]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden rounded-[2.5rem] backdrop-blur-[40px] bg-white/[0.05] dark:bg-black/[0.05]"
      >
        <div className="p-8 sm:p-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-black text-white leading-tight uppercase tracking-tighter">
                {mode === "login" && "System Login"}
                {mode === "signup" && "Registration"}
                {mode === "otp-verify" && "Verify Identity"}
                {mode === "forgot-password" && "Access Reset"}
                {mode === "reset-verify" && "Reset Handshake"}
              </h2>
            </div>
            <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === "login" && (
              <motion.div key="login" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <button onClick={() => handleOAuth('google')} className="group relative flex items-center justify-center gap-4 py-4 px-6 bg-white/5 border border-white/10 hover:border-white/30 rounded-2xl transition-all hover:bg-white/10">
                      <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                      <span className="text-sm font-bold text-white/90 uppercase tracking-widest">Google Auth</span>
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => handleOAuth('github')} className="flex items-center justify-center gap-3 py-3 border border-white/10 hover:border-white/30 rounded-2xl transition-all bg-white/5 hover:bg-white/10">
                        <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">GitHub</span>
                      </button>
                      <button onClick={() => handleOAuth('microsoft')} className="flex items-center justify-center gap-3 py-3 border border-white/10 hover:border-white/30 rounded-2xl transition-all bg-white/5 hover:bg-white/10">
                        <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Microsoft</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div><div className="relative flex justify-center"><span className="bg-[#0a0a0a] px-4 text-[9px] text-white/20 font-black tracking-[0.2em] uppercase">Manual Gateway</span></div></div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-3">
                    <AuthInput icon={<Mail />} name="email" type="text" placeholder="Access ID / Username" value={formData.email} onChange={handleInputChange} />
                    <AuthInput icon={<Lock />} name="password" type="password" placeholder="Cipher (Password)" value={formData.password} onChange={handleInputChange} />
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="text-[10px] font-black text-white/40 flex items-center gap-2 uppercase tracking-widest"><ShieldEllipsis className="w-4 h-4 text-primary-container" /> Solve: {captcha.question}</div>
                    <input type="text" placeholder="?" value={userInputCaptcha} onChange={(e) => setUserInputCaptcha(e.target.value)} className="flex-1 bg-transparent border-b border-white/20 focus:border-white outline-none text-center text-lg font-bold text-white p-1" />
                  </div>
                  {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl text-center">{error}</div>}
                  <PrimaryButton disabled={loading}>{loading ? "VERIFYING..." : "INITIALIZE SESSION"}</PrimaryButton>
                  <div className="flex justify-between items-center pt-2">
                    <button type="button" onClick={() => setMode("forgot-password")} className="text-[10px] font-black text-white/30 hover:text-white transition-colors uppercase tracking-widest">Lost Key</button>
                    <button type="button" onClick={() => setMode("signup")} className="text-[10px] font-black text-primary-container hover:underline uppercase tracking-widest">Register</button>
                  </div>
                </form>
              </motion.div>
            )}

            {mode === "signup" && (
              <motion.form key="signup" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSignupInitiate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <AuthInput icon={<User />} name="name" type="text" placeholder="Legal Name" value={formData.name} onChange={handleInputChange} />
                   <AuthInput icon={<ShieldCheck />} name="username" type="text" placeholder="Username" value={formData.username} onChange={handleInputChange} />
                </div>
                <AuthInput icon={<Mail />} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} />
                <div className="grid grid-cols-2 gap-4">
                   <AuthInput icon={<Phone />} name="phone" type="tel" placeholder="Phone" value={formData.phone} onChange={handleInputChange} />
                   <AuthInput icon={<Calendar />} name="dob" type="date" placeholder="Birthday" value={formData.dob} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <AuthInput icon={<Lock />} name="password" type="password" placeholder="Cipher" value={formData.password} onChange={handleInputChange} />
                   <AuthInput icon={<Lock />} name="confirmPassword" type="password" placeholder="Verify" value={formData.confirmPassword} onChange={handleInputChange} />
                </div>
                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl text-center">{error}</div>}
                <PrimaryButton disabled={loading}>{loading ? "PROCESSING..." : "REQUEST OTP"}</PrimaryButton>
                <button type="button" onClick={() => setMode("login")} className="w-full text-[10px] font-black text-white/30 hover:text-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to Core</button>
              </motion.form>
            )}

            {mode === "otp-verify" && (
              <motion.form key="otp" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onSubmit={handleVerifyOtp} className="space-y-8 py-4">
                 <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary-container/10 border border-primary-container/30 rounded-full flex items-center justify-center mx-auto">
                        <ShieldCheck className="w-10 h-10 text-primary-container" />
                    </div>
                    <p className="text-[11px] text-white/40 uppercase font-bold tracking-widest">Verification code dispatched to <br/><span className="text-white">{formData.email}</span></p>
                 </div>
                 <div className="relative">
                    <input 
                      type="text" 
                      maxLength={6}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      placeholder="XXXXXX"
                      className="w-full bg-white/5 border-b-2 border-white/10 py-6 text-center text-4xl font-black tracking-[0.5em] text-primary-container focus:outline-none focus:border-primary-container transition-all"
                    />
                 </div>
                 <PrimaryButton disabled={loading || otpValue.length < 6}>
                   {loading ? "VERIFYING..." : "FINALIZE REGISTRATION"}
                 </PrimaryButton>
                 <div className="text-center">
                    {canResend ? (
                      <button type="button" onClick={() => setMode("signup")} className="text-[10px] font-black text-primary-container uppercase tracking-widest">Resend Security Token</button>
                    ) : (
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Resend in {timer}s</span>
                    )}
                 </div>
              </motion.form>
            )}

            {mode === "forgot-password" && (
              <motion.form key="forgot" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleRequestReset} className="space-y-8">
                <p className="text-[11px] text-white/50 uppercase font-bold tracking-widest leading-relaxed">Verification link will be dispatched to your registered email.</p>
                <AuthInput icon={<Mail />} name="email" type="email" placeholder="Registered Email" value={formData.email} onChange={handleInputChange} />
                <PrimaryButton disabled={loading}>{loading ? "DISPATCHING..." : "START RECOVERY"}</PrimaryButton>
                <button type="button" onClick={() => setMode("login")} className="w-full text-[10px] font-black text-white/30 hover:text-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2"><ArrowLeft className="w-4 h-4" /> Core Terminal</button>
              </motion.form>
            )}

            {mode === "reset-verify" && (
              <motion.div key="reset-ok" className="text-center py-10 space-y-6">
                 <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                 </div>
                 <h3 className="text-xl font-black text-white uppercase tracking-tighter">Check Your Email</h3>
                 <p className="text-[11px] text-white/40 uppercase font-bold tracking-widest">A secure reset link has been dispatched. Please verify within 15 minutes.</p>
                 <PrimaryButton onClick={() => setMode("login")}>RETURN TO LOGIN</PrimaryButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function AuthInput({ icon, ...props }: any) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors">
        {React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}
      </div>
      <input 
        {...props}
        className="w-full bg-white/5 border border-white/10 py-4 pl-12 pr-6 text-[12px] font-bold text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-white/10 rounded-2xl uppercase tracking-widest"
      />
    </div>
  );
}
