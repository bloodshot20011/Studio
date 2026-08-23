"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { siteConfig } from "@/data/site";

// 4 Days in seconds
const SESSION_MAX_AGE_4_DAYS = 345600;

// Whitelisted Admin Emails (Only these emails are granted Admin Access)
export const ALLOWED_ADMIN_EMAILS = [
  "kashvicardkota@gmail.com",
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Check Google OAuth callback session on mount
  useEffect(() => {
    const checkGoogleSession = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user?.email) {
          const userEmail = session.user.email.toLowerCase().trim();
          const isAllowed = ALLOWED_ADMIN_EMAILS.some((e) => e.toLowerCase() === userEmail);

          if (isAllowed) {
            document.cookie = `kashvi_admin_auth=authenticated; path=/; max-age=${SESSION_MAX_AGE_4_DAYS}; SameSite=Lax`;
            router.push("/admin");
            router.refresh();
          } else {
            await supabase.auth.signOut();
            setErrorMsg(`Access Denied: ${userEmail} is not authorized for Admin access.`);
          }
        }
      } catch (err) {
        console.warn("OAuth session check notice:", err);
      }
    };

    checkGoogleSession();
  }, [router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/admin/login`,
        },
      });

      if (error) {
        setErrorMsg(error.message || "Failed to initialize Google Sign-In. Make sure Google Provider is enabled in Supabase.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Google OAuth initialization error.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const cleanEmail = email.toLowerCase().trim();
    const isAllowed = ALLOWED_ADMIN_EMAILS.some((e) => e.toLowerCase() === cleanEmail);

    if (!isAllowed) {
      setErrorMsg(`Access Denied: ${cleanEmail} is not in the Whitelisted Admin Emails.`);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message || "Invalid email or password. Please try again.");
      } else {
        document.cookie = `kashvi_admin_auth=authenticated; path=/; max-age=${SESSION_MAX_AGE_4_DAYS}; SameSite=Lax`;
        router.push("/admin");
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline/15 p-8 shadow-xl rounded-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center gap-3 mb-2 group">
            <img
              src="/images/logo.jpg"
              alt={siteConfig.brand}
              className="h-10 w-10 rounded-full object-cover border border-secondary/40 shadow-sm"
            />
            <span className="font-display-lg text-primary text-headline-lg font-bold">
              {siteConfig.brand}
            </span>
          </Link>
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary block">
            Protected Admin Portal
          </span>
          <span className="text-[11px] text-outline block mt-1">
            Email Whitelist Protected • kashvicardkota@gmail.com
          </span>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-error-container text-on-error-container border border-error/20 font-body-md text-sm text-center rounded-xl flex items-center gap-2 justify-center">
            <span className="material-symbols-outlined text-error text-base">error</span>
            {errorMsg}
          </div>
        )}

        {/* 1. Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-label-md text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 shadow-sm transition-all mb-6 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          {loading ? "Connecting to Google..." : "Sign in with Google"}
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-outline/15 w-full"></div>
          <span className="bg-surface-container-lowest px-3 font-label-sm text-[11px] text-outline uppercase tracking-wider">
            OR PASSWORD LOGIN
          </span>
          <div className="border-t border-outline/15 w-full"></div>
        </div>

        {/* 2. Password Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div>
            <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
              Admin Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kashvicardkota@gmail.com"
              className="w-full bg-surface border border-outline/20 px-4 py-3 font-body-md text-on-surface focus:border-secondary outline-none rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-surface border border-outline/20 px-4 py-3 font-body-md text-on-surface focus:border-secondary outline-none rounded-xl text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 text-center justify-center font-label-md text-label-md uppercase tracking-widest rounded-xl cursor-pointer"
          >
            {loading ? "Authenticating..." : "Sign In with Password"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-outline/10 pt-4">
          <Link href="/" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary uppercase tracking-widest">
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
