"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Users, CheckCircle, ArrowRight, Planet, ShieldCheck } from "@phosphor-icons/react";
import Link from "next/link";

export default function InviteLandingPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;
  const { data: session, isPending } = useSession();

  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAcceptInvite = async () => {
    setLoading(true);
    setError(null);

    try {
      // API call to accept invitation
      const res = await fetch("/api/auth/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to join team space.");
      }

      setJoined(true);
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Invalid or expired invitation link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-canvas text-content-primary">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-modal flex flex-col items-center text-center gap-6 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-accent/20 text-accent flex items-center justify-center shadow-card">
          <Users weight="duotone" className="w-8 h-8" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-bold font-display tracking-tight text-content-primary">
            You&apos;ve Been Invited!
          </h1>
          <p className="text-sm text-content-secondary">
            Join the team workspace on Orbit to collaborate on projects, track tasks, and review technical specs.
          </p>
        </div>

        {error && (
          <div className="w-full rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
            {error}
          </div>
        )}

        {joined ? (
          <div className="w-full rounded-xl border border-success/30 bg-success/10 p-4 flex items-center justify-center gap-2 text-success text-sm font-semibold">
            <CheckCircle weight="fill" className="w-5 h-5" />
            <span>Welcome aboard! Redirecting to workspace...</span>
          </div>
        ) : isPending ? (
          <div className="text-xs text-content-placeholder animate-pulse">
            Checking invitation credentials...
          </div>
        ) : session?.user ? (
          <div className="w-full flex flex-col gap-3">
            <div className="p-3 rounded-xl border border-border bg-surface-raised flex items-center justify-between text-xs">
              <span className="text-content-secondary">Signed in as</span>
              <span className="font-semibold text-content-primary truncate max-w-[180px]">
                {session.user.email}
              </span>
            </div>

            <button
              onClick={handleAcceptInvite}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-accent-fg text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 shadow-card cursor-pointer"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-accent-fg border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Accept Invitation & Join</span>
                  <ArrowRight weight="bold" className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-3">
            <Link
              href={`/auth/sign-up?callbackUrl=${encodeURIComponent(`/invite/${token}`)}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-accent-fg text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all shadow-card"
            >
              <span>Create Account to Join</span>
              <ArrowRight weight="bold" className="w-4 h-4" />
            </Link>

            <Link
              href={`/auth/sign-in?callbackUrl=${encodeURIComponent(`/invite/${token}`)}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface text-xs font-semibold text-content-primary hover:bg-surface-raised transition-colors"
            >
              <span>Already have an account? Sign In</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
