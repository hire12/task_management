"use client";

import React, { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { Lock, EnvelopeSimple, User, Eye, EyeSlash, ArrowRight, CheckCircle } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export const SignUpForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = calculatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await signUp.email({
        name,
        email,
        password,
        callbackURL: callbackUrl,
      });

      if (res.error) {
        setError(res.error.message || "Failed to create account.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-border bg-surface p-8 shadow-modal flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-2xl font-bold text-content-primary tracking-tight font-display">
          Create your account
        </h1>
        <p className="text-sm text-content-secondary">
          Join Orbit to build, organize, and collaborate with your team
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
            Full Name
          </label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-content-placeholder absolute left-3.5" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Smith"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface-raised text-sm text-content-primary placeholder:text-content-placeholder focus:outline-none focus:border-accent shadow-2xs"
            />
          </div>
        </div>

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
              placeholder="alex@company.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface-raised text-sm text-content-primary placeholder:text-content-placeholder focus:outline-none focus:border-accent shadow-2xs"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-content-secondary uppercase tracking-wider">
            Password
          </label>
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

          {/* Password strength meter */}
          {password.length > 0 && (
            <div className="flex items-center gap-1.5 mt-1">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    step <= strength
                      ? strength <= 1
                        ? "bg-danger"
                        : strength <= 3
                        ? "bg-warning"
                        : "bg-success"
                      : "bg-border"
                  }`}
                />
              ))}
              <span className="text-[10px] text-content-placeholder ml-1">
                {strength <= 1 ? "Weak" : strength <= 3 ? "Good" : "Strong"}
              </span>
            </div>
          )}
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
              <span>Create Account</span>
              <ArrowRight weight="bold" className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 border-t border-border/80 text-center text-xs text-content-secondary">
        Already have an account?{" "}
        <Link href={`/auth/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-accent font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
