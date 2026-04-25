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
  ArrowLeft
} from "lucide-react";
import { account, ID, databases, NYAY_DB_ID, COLLECTIONS } from "@/lib/appwrite";
import { Permission, Role } from "appwrite";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

type AuthMode = "login" | "signup" | "otp" | "complete-profile";

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captcha, setCaptcha] = useState({ question: "", answer: 0 });
  const [userInputCaptcha, setUserInputCaptcha] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateCaptcha()) {
      setError("Human verification failed. Please try again.");
      generateCaptcha();
      return;
    }

    setLoading(true);
    try {
      await account.createEmailPasswordSession(formData.email, formData.password);
      const user = await account.get();
      onSuccess(user);
      onClose();
      window.location.href = "/profile";
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validateCaptcha()) {
      setError("Human verification failed.");
      generateCaptcha();
      return;
    }

    setLoading(true);
    try {
      // 1. Create user account
      const response = await account.create(
        ID.unique(),
        formData.email,
        formData.password,
        formData.name
      );
      
      const newUserId = response.$id;
      setUserId(newUserId);
      
      // 2. Start session
      await account.createEmailPasswordSession(formData.email, formData.password);
      
      // 3. Create profile document in database (Production Method)
      await databases.createDocument(
        NYAY_DB_ID,
        COLLECTIONS.PROFILES,
        newUserId, // Using User ID as Document ID for optimization
        {
          username: formData.username,
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          dob: formData.dob,
          isProfileComplete: true
        },
        [
          Permission.read(Role.user(newUserId)),
          Permission.update(Role.user(newUserId)),
          Permission.delete(Role.user(newUserId)),
        ]
      );

      // 4. Trigger Email Verification
      await account.createVerification(`${window.location.origin}/verify`);
      setMode("otp");
    } catch (err: any) {
      if (err.code === 409) {
        setError("ACCOUNT_ALREADY_EXISTS: Please login or use a different email.");
      } else {
        setError(err.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Note: Appwrite email verification usually works via a URL token.
      // For a true "OTP" flow in the UI, we'd use account.createEmailToken (Magic URL) 
      // or a custom backend function. Here we simulate success for demonstration.
      const user = await account.get();
      onSuccess(user);
      onClose();
    } catch (err: any) {
      setError("Verification failed. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    account.createOAuth2Session(
      provider,
      `${window.location.origin}/auth-callback`,
      `${window.location.origin}/login`
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-bg-primary border border-border-color shadow-2xl overflow-hidden glass-panel rounded-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-container via-accent-red to-primary-container" />
        
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-tighter text-text-primary uppercase">
                {mode === "login" ? "INITIALIZE_SESSION" : mode === "signup" ? "CREATE_IDENTITY" : "VERIFY_HUMAN"}
              </h2>
              <p className="text-[10px] font-mono text-primary-container tracking-widest mt-1">
                {mode === "login" ? "NYAY-MITRA // AUTH_GATEWAY" : "NYAY-MITRA // REGISTRATION_V4"}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-bg-surface-low rounded-full transition-colors">
              <X className="w-5 h-5 text-text-muted" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === "login" && (
              <motion.form 
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary-container transition-colors" />
                    <input 
                      type="email" 
                      name="email"
                      placeholder="EMAIL_ADDRESS" 
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-bg-surface-low border border-border-color py-4 pl-12 pr-4 font-mono text-[11px] uppercase tracking-widest text-text-primary focus:outline-none focus:border-primary-container transition-all"
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary-container transition-colors" />
                    <input 
                      type="password" 
                      name="password"
                      placeholder="SECURITY_PASSWORD" 
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-bg-surface-low border border-border-color py-4 pl-12 pr-4 font-mono text-[11px] uppercase tracking-widest text-text-primary focus:outline-none focus:border-primary-container transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center p-4 bg-bg-surface-low border border-border-color">
                  <div className="text-[10px] font-bold text-text-muted uppercase">SOLVE: {captcha.question}</div>
                  <input 
                    type="text" 
                    placeholder="RESULT"
                    value={userInputCaptcha}
                    onChange={(e) => setUserInputCaptcha(e.target.value)}
                    className="bg-transparent border-b border-border-color focus:border-primary-container outline-none text-center font-mono"
                  />
                </div>

                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest">{error}</div>}

                <button 
                  disabled={loading}
                  className="w-full btn-industrial py-5 flex items-center justify-center gap-3 group"
                >
                  {loading ? "PROCESSING..." : "ESTABLISH_CONNECTION"} 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex justify-between">
                  <button type="button" className="text-[9px] font-bold text-primary-container uppercase tracking-widest hover:underline">Forgot_Password?</button>
                  <button type="button" onClick={() => setMode("signup")} className="text-[9px] font-bold text-text-muted uppercase tracking-widest hover:text-text-primary transition-colors">Request_New_Identity</button>
                </div>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-color"></div></div>
                  <div className="relative flex justify-center"><span className="bg-bg-primary px-4 font-mono text-[8px] text-text-muted uppercase tracking-[0.3em]">OR_OAUTH_LOGIN</span></div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button type="button" onClick={() => handleOAuth('google')} className="p-4 border border-border-color hover:border-primary-container flex justify-center transition-all bg-bg-surface-low">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  </button>
                  <button type="button" onClick={() => handleOAuth('github')} className="p-4 border border-border-color hover:border-primary-container flex justify-center transition-all bg-bg-surface-low">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                  </button>
                  <button type="button" onClick={() => handleOAuth('microsoft')} className="p-4 border border-border-color hover:border-primary-container flex justify-center transition-all bg-bg-surface-low">
                    <svg viewBox="0 0 23 23" className="w-4 h-4">
                      <path fill="#f25022" d="M0 0h11v11H0z" />
                      <path fill="#7fbb00" d="M12 0h11v11H12z" />
                      <path fill="#00a1f1" d="M0 12h11v11H0z" />
                      <path fill="#ffb900" d="M12 12h11v11H12z" />
                    </svg>
                  </button>
                </div>
              </motion.form>
            )}

            {mode === "signup" && (
              <motion.form 
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSignup}
                className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary-container transition-colors" />
                    <input type="text" name="name" placeholder="FULL_NAME" required value={formData.name} onChange={handleInputChange} className="w-full bg-bg-surface-low border border-border-color py-4 pl-12 pr-4 font-mono text-[10px] uppercase tracking-widest text-text-primary focus:outline-none focus:border-primary-container transition-all" />
                  </div>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary-container transition-colors" />
                    <input type="text" name="username" placeholder="UNIQUE_USERNAME" required value={formData.username} onChange={handleInputChange} className="w-full bg-bg-surface-low border border-border-color py-4 pl-12 pr-4 font-mono text-[10px] uppercase tracking-widest text-text-primary focus:outline-none focus:border-primary-container transition-all" />
                  </div>
                </div>

                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary-container transition-colors" />
                  <input type="email" name="email" placeholder="EMAIL_IDENTITY" required value={formData.email} onChange={handleInputChange} className="w-full bg-bg-surface-low border border-border-color py-4 pl-12 pr-4 font-mono text-[10px] uppercase tracking-widest text-text-primary focus:outline-none focus:border-primary-container transition-all" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary-container transition-colors" />
                    <input type="tel" name="phone" placeholder="PHONE_NO" required value={formData.phone} onChange={handleInputChange} className="w-full bg-bg-surface-low border border-border-color py-4 pl-12 pr-4 font-mono text-[10px] uppercase tracking-widest text-text-primary focus:outline-none focus:border-primary-container transition-all" />
                  </div>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary-container transition-colors" />
                    <input type="date" name="dob" placeholder="DATE_OF_BIRTH" required value={formData.dob} onChange={handleInputChange} className="w-full bg-bg-surface-low border border-border-color py-4 pl-12 pr-4 font-mono text-[10px] uppercase tracking-widest text-text-primary focus:outline-none focus:border-primary-container transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary-container transition-colors" />
                    <input type="password" name="password" placeholder="PASSWORD" required value={formData.password} onChange={handleInputChange} className="w-full bg-bg-surface-low border border-border-color py-4 pl-12 pr-4 font-mono text-[10px] uppercase tracking-widest text-text-primary focus:outline-none focus:border-primary-container transition-all" />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary-container transition-colors" />
                    <input type="password" name="confirmPassword" placeholder="RE_ENTER" required value={formData.confirmPassword} onChange={handleInputChange} className="w-full bg-bg-surface-low border border-border-color py-4 pl-12 pr-4 font-mono text-[10px] uppercase tracking-widest text-text-primary focus:outline-none focus:border-primary-container transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center p-4 bg-bg-surface-low border border-border-color">
                  <div className="text-[10px] font-bold text-text-muted uppercase">SOLVE: {captcha.question}</div>
                  <input type="text" placeholder="RESULT" value={userInputCaptcha} onChange={(e) => setUserInputCaptcha(e.target.value)} className="bg-transparent border-b border-border-color focus:border-primary-container outline-none text-center font-mono" />
                </div>

                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest">{error}</div>}

                <button disabled={loading} className="w-full btn-industrial py-5 flex items-center justify-center gap-3 group">
                  {loading ? "INITIALIZING..." : "REGISTER_NEW_OPERATOR"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex justify-center">
                  <button type="button" onClick={() => setMode("login")} className="flex items-center gap-2 text-[9px] font-bold text-text-muted uppercase tracking-widest hover:text-text-primary transition-colors">
                    <ArrowLeft className="w-3 h-3" /> Back_to_Login
                  </button>
                </div>
              </motion.form>
            )}

            {mode === "otp" && (
              <motion.form 
                key="otp"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onSubmit={handleVerifyOtp}
                className="space-y-6 py-8"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-container/10 border border-primary-container flex items-center justify-center mx-auto rounded-full mb-6">
                    <ShieldCheck className="w-8 h-8 text-primary-container" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-widest mb-2">EMAIL_VERIFICATION</h3>
                  <p className="text-[10px] text-text-muted uppercase tracking-widest px-8">
                    An activation link has been transmitted to your primary terminal at <strong>{formData.email}</strong>. 
                    Please confirm identity to finalize registration.
                  </p>
                </div>

                <div className="space-y-4">
                   <div className="text-[10px] font-mono text-center text-primary-container animate-pulse">AWAITING_SYSTEM_CONFIRMATION...</div>
                   <button onClick={handleVerifyOtp} className="w-full btn-industrial py-5 uppercase tracking-widest">CONTINUE_AFTER_VERIFICATION</button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
