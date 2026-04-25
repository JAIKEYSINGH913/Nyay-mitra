"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account, databases, NYAY_DB_ID, COLLECTIONS } from "@/lib/appwrite";
import { Permission, Role } from "appwrite";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const user = await account.get();
        
        // Check if profile exists
        try {
          await databases.getDocument(NYAY_DB_ID, COLLECTIONS.PROFILES, user.$id);
        } catch (dbErr: any) {
          // If 404, create the profile document
          if (dbErr.code === 404) {
            await databases.createDocument(
              NYAY_DB_ID,
              COLLECTIONS.PROFILES,
              user.$id,
              {
                username: user.email.split('@')[0], // Default username from email
                fullName: user.name,
                email: user.email,
                isProfileComplete: false // Mark as incomplete for OAuth users
              },
              [
                Permission.read(Role.user(user.$id)),
                Permission.update(Role.user(user.$id)),
                Permission.delete(Role.user(user.$id)),
              ]
            );
          }
        }
        
        router.push("/profile");
      } catch (err: any) {
        console.error("OAuth Callback Error:", err);
        setError(err.message || "Authentication failed");
        setTimeout(() => router.push("/"), 3000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel p-8 text-center border border-border-color">
        {!error ? (
          <>
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-primary-container/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
              <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-primary-container animate-pulse" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-text-primary uppercase mb-2">
              SYNCHRONIZING_IDENTITY
            </h1>
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.3em] animate-pulse">
              FINALIZING_SECURE_HANDSHAKE...
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto rounded-full mb-6">
              <span className="text-red-500 text-3xl">!</span>
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-red-500 uppercase mb-2">
              AUTHENTICATION_FAILED
            </h1>
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.3em] mb-6">
              {error}
            </p>
            <button 
              onClick={() => router.push("/")}
              className="btn-industrial py-3 px-6 text-[10px] uppercase tracking-widest"
            >
              RETURN_TO_BASE
            </button>
          </>
        )}
      </div>
    </div>
  );
}
