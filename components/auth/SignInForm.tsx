"use client";

import React, { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { Lock, EnvelopeSimple, Eye, EyeSlash, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export const SignInForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await signIn.email({
        email,
        password,
        callbackURL: callbackUrl,
      });

      if (res.error) {
        setError(res.error.message || "Invalid email or password.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-border bg-surface p-8 shadow-modal flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-2xl font-bold text-content-primary tracking-tight font-display">
          Welcome back
        </h1>
        <p className="text-sm text-content-secondary">
          Sign in to your Orbit workspace to manage projects
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-xs text-danger flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-content-secondary uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative flex items-center">
            <EnvelopeSimple className="w-4 h-4 text-content-placeholder absolute left-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface-raised text-sm text-content-primary placeholder:text-content-placeholder focus:outline-none focus:border-accent shadow-2xs"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-content-secondary uppercase tracking-wider">
              Password
            </label>
          </div>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-content-placeholder absolute left-3.5" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-border bg-surface-raised text-sm text-content-primary placeholder:text-content-placeholder focus:outline-none focus:border-accent shadow-2xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-content-placeholder hover:text-content-primary transition-colors"
            >
              {showPassword ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-accent-fg text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 shadow-card cursor-pointer"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-accent-fg border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight weight="bold" className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 border-t border-border/80 text-center text-xs text-content-secondary">
        Don&apos;t have an account?{" "}
        <Link href={`/auth/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-accent font-semibold hover:underline">
          Create an account
        </Link>
      </div>
    </div>
  );
};
