"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { siteConfig } from "@/data/site";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message || "Invalid credentials. Please try again.");
      } else {
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
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline/15 p-8 shadow-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display-lg text-primary text-headline-lg font-bold block mb-1">
            {siteConfig.brand}
          </Link>
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary block">
            Admin Portal Access
          </span>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-error-container text-on-error-container border border-error/20 font-body-md text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@kashvicards.com"
              className="w-full bg-surface border border-outline/20 px-4 py-3 font-body-md text-on-surface focus:border-secondary outline-none"
            />
          </div>

          <div>
            <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-surface border border-outline/20 px-4 py-3 font-body-md text-on-surface focus:border-secondary outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-center justify-center font-label-md text-label-md uppercase tracking-widest"
          >
            {loading ? "Authenticating..." : "Sign In to Admin"}
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
