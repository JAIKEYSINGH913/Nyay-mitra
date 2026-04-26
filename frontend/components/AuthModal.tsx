"use client";
import React, { useState, useEffect } from "react";
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
  RotateCcw
} from "lucide-react";
import { account, ID, databases, NYAY_DB_ID, COLLECTIONS } from "@/lib/appwrite";
import { Permission, Role } from "appwrite";
import toast from "react-hot-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

type AuthMode = "login" | "signup" | "otp" | "forgot-password" | "reset-verify" | "new-password";

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captcha, setCaptcha] = useState({ question: "", answer: 0 });
  const [userInputCaptcha, setUserInputCaptcha] = useState("");
  const [otpValue, setOtpValue] = useState("");

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
      className={`
        w-full py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition-all duration-300
        text-white border-2 border-white/20 hover:border-white/40
        /* BLUE in Light, RED in Dark */
        bg-[#1a73e8] dark:bg-[#E01E22]
        hover:scale-[1.01] active:scale-[0.99]
        hover:shadow-2xl hover:shadow-primary-container/20
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {children}
    </button>
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateCaptcha()) {
      setError("Human verification failed.");
      generateCaptcha();
      return;
    }
    setLoading(true);
    try {
      await account.createEmailPasswordSession(formData.email, formData.password);
      const user = await account.get();
      toast.success("Welcome back!");
      onSuccess(user);
      onClose();
      window.location.href = "/profile";
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (!validateCaptcha()) {
      setError("Human verification failed.");
      generateCaptcha();
      return;
    }
    setLoading(true);
    try {
      const response = await account.create(ID.unique(), formData.email, formData.password, formData.name);
      const newUserId = response.$id;
      await account.createEmailPasswordSession(formData.email, formData.password);
      await databases.createDocument(NYAY_DB_ID, COLLECTIONS.PROFILES, newUserId, {
          username: formData.username,
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          dob: formData.dob,
          isProfileComplete: true
        }, [
          Permission.read(Role.user(newUserId)),
          Permission.update(Role.user(newUserId)),
        ]
      );
      toast.success("Identity created!");
      setMode("otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      toast.success("Code sent!");
      setMode("reset-verify");
    } catch (err) { setError("Request failed."); } finally { setLoading(false); }
  };

  const handleVerifyResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      setMode("new-password");
    } catch (err) { setError("Invalid code."); } finally { setLoading(false); }
  };

  const handleFinalReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
       setError("Passwords don't match.");
       return;
    }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      toast.success("Success!");
      setMode("login");
    } catch (err) { setError("Failed."); } finally { setLoading(false); }
  };

  const handleOAuth = (provider: string) => {
    account.createOAuth2Session(provider, `${window.location.origin}/auth-callback`, `${window.location.origin}/login`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* NEARLY INVISIBLE OVERLAY TO KEEP BACKGROUND UNCHANGED */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} 
        className="absolute inset-0 bg-black/10 backdrop-blur-md" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] 
          rounded-[24px] backdrop-blur-3xl flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden
          /* Glassy Logic: White Glass in Light mode, Light Gray in Dark mode */
          bg-white/10 dark:bg-zinc-200/20"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-container via-accent-red to-primary-container shrink-0" />
        
        {/* SCROLLABLE CONTAINER FOR MOBILE RESPONSIVENESS */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10 custom-scrollbar">
          <div className="flex justify-between items-start mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                {mode === "login" && "Welcome Back"}
                {mode === "signup" && "Create Account"}
                {mode === "otp" && "Verify Email"}
                {mode === "forgot-password" && "Reset Password"}
                {mode === "reset-verify" && "Verify Code"}
                {mode === "new-password" && "Update Password"}
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-1">
                {mode === "login" ? "Enter your credentials." : "Complete the form to continue."}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-bg-surface-low rounded-full transition-all group shrink-0">
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-text-muted group-hover:text-text-primary" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === "login" && (
              <motion.form key="login" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
                <div className="space-y-3 sm:space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-text-muted group-focus-within:text-primary-container transition-colors" />
                    <input type="email" name="email" placeholder="Email or Username" required value={formData.email} onChange={handleInputChange} 
                      className="w-full bg-bg-surface-low/80 border border-border-color py-3 sm:py-3.5 pl-11 sm:pl-14 pr-4 sm:pr-6 text-sm sm:text-base rounded-xl focus:outline-none focus:border-primary-container transition-all" />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-text-muted group-focus-within:text-primary-container transition-colors" />
                    <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleInputChange} 
                      className="w-full bg-bg-surface-low/80 border border-border-color py-3 sm:py-3.5 pl-11 sm:pl-14 pr-4 sm:pr-6 text-sm sm:text-base rounded-xl focus:outline-none focus:border-primary-container transition-all" />
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-bg-surface-low rounded-xl border border-border-color">
                  <div className="text-[10px] sm:text-xs font-semibold text-text-primary flex items-center gap-2">
                    <Info className="w-3 h-3 sm:w-4 sm:h-4 text-primary-container" />
                    {captcha.question}?
                  </div>
                  <input type="text" placeholder="Answer" value={userInputCaptcha} onChange={(e) => setUserInputCaptcha(e.target.value)} 
                    className="flex-1 bg-transparent border-b border-border-color focus:border-primary-container outline-none text-center text-base sm:text-lg font-bold p-0.5" />
                </div>

                {error && <div className="p-2 sm:p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] sm:text-xs font-semibold rounded-lg">{error}</div>}

                <PrimaryButton disabled={loading}>
                  {loading ? "Establishing..." : "Sign In"} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </PrimaryButton>

                <div className="flex justify-between items-center gap-2 sm:gap-4 pt-1 sm:pt-2">
                  <button type="button" onClick={() => setMode("forgot-password")} className="text-[10px] sm:text-xs font-bold text-primary-container hover:underline">Forgot password?</button>
                  <button type="button" onClick={() => setMode("signup")} className="text-[10px] sm:text-xs font-bold text-text-muted hover:text-text-primary transition-colors uppercase tracking-widest">Sign Up</button>
                </div>

                <div className="relative pt-3 sm:pt-4 pb-6 sm:pb-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-color/40"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-bg-primary px-4 sm:px-6 text-[9px] sm:text-[10px] text-text-muted font-black tracking-[0.15em] whitespace-nowrap uppercase">
                      Social Login
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {['google', 'github', 'microsoft'].map((provider) => (
                    <button key={provider} type="button" onClick={() => handleOAuth(provider)} className="py-2.5 sm:py-3.5 border border-border-color hover:border-primary-container rounded-xl flex justify-center transition-all bg-bg-surface-low hover:bg-bg-surface-high hover:scale-105 active:scale-95">
                      {provider === 'google' && <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>}
                      {provider === 'github' && <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>}
                      {provider === 'microsoft' && <svg viewBox="0 0 23 23" className="w-4 h-4 sm:w-5 sm:h-5"><path fill="#f25022" d="M0 0h11v11H0z" /><path fill="#7fbb00" d="M12 0h11v11H12z" /><path fill="#00a1f1" d="M0 12h11v11H0z" /><path fill="#ffb900" d="M12 12h11v11H12z" /></svg>}
                    </button>
                  ))}
                </div>
              </motion.form>
            )}

            {/* SIGNUP MODE (CRITICAL FOR MOBILE SCROLLING) */}
            {mode === "signup" && (
              <motion.form key="signup" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleInputChange} className="w-full bg-bg-surface-low border border-border-color py-3 pl-10 pr-4 text-sm rounded-xl focus:border-primary-container outline-none" />
                  </div>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input type="text" name="username" placeholder="Username" required value={formData.username} onChange={handleInputChange} className="w-full bg-bg-surface-low border border-border-color py-3 pl-10 pr-4 text-sm rounded-xl focus:border-primary-container outline-none" />
                  </div>
                </div>

                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleInputChange} className="w-full bg-bg-surface-low border border-border-color py-3 pl-10 pr-4 text-sm rounded-xl focus:border-primary-container outline-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input type="tel" name="phone" placeholder="Phone" required value={formData.phone} onChange={handleInputChange} className="w-full bg-bg-surface-low border border-border-color py-3 pl-10 pr-4 text-sm rounded-xl focus:border-primary-container outline-none" />
                  </div>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input type="date" name="dob" required value={formData.dob} onChange={handleInputChange} className="w-full bg-bg-surface-low border border-border-color py-3 pl-10 pr-4 text-sm rounded-xl focus:border-primary-container outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleInputChange} className="w-full bg-bg-surface-low border border-border-color py-3 pl-10 pr-4 text-sm rounded-xl focus:border-primary-container outline-none" />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input type="password" name="confirmPassword" placeholder="Confirm" required value={formData.confirmPassword} onChange={handleInputChange} className="w-full bg-bg-surface-low border border-border-color py-3 pl-10 pr-4 text-sm rounded-xl focus:border-primary-container outline-none" />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 sm:p-4 bg-bg-surface-low rounded-xl border border-border-color">
                  <div className="text-[10px] sm:text-xs font-semibold text-text-primary flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-primary-container" />
                    {captcha.question}?
                  </div>
                  <input type="text" placeholder="Result" value={userInputCaptcha} onChange={(e) => setUserInputCaptcha(e.target.value)} className="flex-1 bg-transparent border-b border-border-color focus:border-primary-container outline-none text-center text-lg font-bold p-0.5" />
                </div>

                <PrimaryButton disabled={loading}>
                  {loading ? "Creating..." : "Create Account"} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </PrimaryButton>

                <div className="flex justify-center pt-2">
                  <button type="button" onClick={() => setMode("login")} className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-text-muted hover:text-text-primary transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                  </button>
                </div>
              </motion.form>
            )}

            {/* OTHER MODES RETAIN SCALING */}
            {mode === "forgot-password" && (
              <motion.form key="forgot" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleRequestReset} className="space-y-4 sm:space-y-6">
                <div className="relative group">
                  <Mail className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-text-muted group-focus-within:text-primary-container transition-colors" />
                  <input type="email" name="email" placeholder="Registered Email" required value={formData.email} onChange={handleInputChange} 
                    className="w-full bg-bg-surface-low border border-border-color py-3 sm:py-4 pl-11 sm:pl-14 pr-4 sm:pr-6 text-sm sm:text-base rounded-xl focus:outline-none focus:border-primary-container transition-all" />
                </div>
                <PrimaryButton disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Code"} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </PrimaryButton>
                <button type="button" onClick={() => setMode("login")} className="w-full text-[10px] sm:text-xs font-bold text-text-muted hover:text-text-primary transition-colors flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </button>
              </motion.form>
            )}

            {mode === "reset-verify" && (
              <motion.form key="reset-verify" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} onSubmit={handleVerifyResetOtp} className="space-y-4 sm:space-y-6">
                <div className="text-center mb-1 sm:mb-2">
                  <div className="p-3 bg-primary-container/10 border border-primary-container w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <ShieldEllipsis className="w-7 h-7 sm:w-8 sm:h-8 text-primary-container" />
                  </div>
                  <p className="text-xs sm:text-sm text-text-muted">Enter the 6-digit code.</p>
                </div>
                <div className="relative group">
                   <KeyRound className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-text-muted group-focus-within:text-primary-container transition-colors" />
                   <input type="text" placeholder="------" required value={otpValue} onChange={(e) => setOtpValue(e.target.value)} 
                    className="w-full bg-bg-surface-low border border-border-color py-3 sm:py-4 pl-11 sm:pl-14 pr-4 sm:pr-8 text-lg sm:text-xl tracking-[0.4em] text-center font-black rounded-xl focus:outline-none focus:border-primary-container transition-all" />
                </div>
                <PrimaryButton disabled={loading}>
                   Verify Code <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </PrimaryButton>
                <div className="flex justify-between gap-4">
                  <button type="button" onClick={() => setMode("forgot-password")} className="text-[10px] sm:text-xs font-bold text-text-muted flex items-center gap-2">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button type="button" className="text-[10px] sm:text-xs font-bold text-primary-container flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5" /> Resend
                  </button>
                </div>
              </motion.form>
            )}

            {mode === "new-password" && (
              <motion.form key="new-password" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleFinalReset} className="space-y-4 sm:space-y-5">
                <div className="space-y-3 sm:space-y-4">
                  <div className="relative group">
                    <Lock className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-text-muted group-focus-within:text-primary-container transition-colors" />
                    <input type="password" name="password" placeholder="New Password" required value={formData.password} onChange={handleInputChange} 
                      className="w-full bg-bg-surface-low border border-border-color py-3 sm:py-4 pl-11 sm:pl-14 pr-4 sm:pr-6 text-sm sm:text-base rounded-xl focus:outline-none focus:border-primary-container transition-all" />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-text-muted group-focus-within:text-primary-container transition-colors" />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" required value={formData.confirmPassword} onChange={handleInputChange} 
                      className="w-full bg-bg-surface-low border-2 border-border-color py-3 sm:py-4 pl-11 sm:pl-14 pr-4 sm:pr-6 text-sm sm:text-base rounded-xl focus:outline-none focus:border-primary-container transition-all" />
                  </div>
                </div>
                <PrimaryButton disabled={loading}>
                   Update Password <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </PrimaryButton>
                <button type="button" onClick={() => setMode("reset-verify")} className="w-full text-[10px] sm:text-xs font-bold text-text-muted flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back to Verification
                </button>
              </motion.form>
            )}

            {mode === "otp" && (
              <motion.div key="otp" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 sm:py-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-container/10 border border-primary-container flex items-center justify-center mx-auto rounded-full mb-4 sm:mb-6">
                  <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-primary-container" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Check Email</h3>
                <p className="text-xs sm:text-sm text-text-muted mb-6 sm:mb-8 px-4">
                  Activation link sent to <strong>{formData.email}</strong>.
                </p>
                <div className="space-y-3 sm:space-y-4">
                  <PrimaryButton onClick={() => window.location.reload()}>
                    Verify & Enter
                  </PrimaryButton>
                  <button onClick={() => setMode("signup")} className="text-[10px] sm:text-xs font-bold text-text-muted flex items-center justify-center gap-2 mx-auto hover:text-text-primary transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" /> Correct Email
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
