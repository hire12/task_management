"use client";

import React, { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { Lock, EnvelopeSimple, Eye, EyeSlash, ArrowRight } from "@phosphor-icons/react";
import { GoogleIcon, GitHubIcon } from "./SocialIcons";
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
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);
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

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    setError(null);
    try {
      await signIn.social({
        provider,
        callbackURL: callbackUrl,
      });
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}.`);
      setSocialLoading(null);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-border bg-surface p-8 shadow-modal flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-2xl font-bold text-content-primary tracking-tight font-display">
          Welcome back
        </h1>
        <p className="text-sm text-content-secondary">
          Sign in to your Orbit workspace to manage initiatives
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-xs text-danger flex items-center gap-2 animate-fade-in">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Social Logins */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSocialSignIn("google")}
          disabled={Boolean(socialLoading) || loading}
          className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-raised active:scale-[0.98] transition-all text-xs font-semibold text-content-primary shadow-2xs cursor-pointer disabled:opacity-60"
        >
          <GoogleIcon className="w-4 h-4 shrink-0" />
          <span>{socialLoading === "google" ? "Connecting..." : "Google"}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSocialSignIn("github")}
          disabled={Boolean(socialLoading) || loading}
          className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-raised active:scale-[0.98] transition-all text-xs font-semibold text-content-primary shadow-2xs cursor-pointer disabled:opacity-60"
        >
          <GitHubIcon className="w-4 h-4 shrink-0 text-content-primary" />
          <span>{socialLoading === "github" ? "Connecting..." : "GitHub"}</span>
        </button>
      </div>

      {/* OR Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-border w-full" />
        <span className="bg-surface px-3 text-[11px] font-semibold text-content-placeholder uppercase tracking-wider absolute">
          or continue with email
        </span>
      </div>

      {/* Email & Password Form */}
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
              className="absolute right-3.5 text-content-placeholder hover:text-content-primary transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeSlash className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || Boolean(socialLoading)}
          className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover active:scale-[0.98] transition-all shadow-card cursor-pointer disabled:opacity-50"
        >
          <span>{loading ? "Signing in..." : "Sign In to Workspace"}</span>
          <ArrowRight weight="bold" className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-2 border-t border-border text-center text-xs text-content-secondary">
        Don&apos;t have an account?{" "}
        <Link
          href={`/auth/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="font-semibold text-accent hover:underline"
        >
          Create one for free
        </Link>
      </div>
    </div>
  );
};
