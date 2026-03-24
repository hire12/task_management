import React, { Suspense } from "react";
import { SignInForm } from "@/components/auth/SignInForm";
import Link from "next/link";
import { Planet } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Sign In · Orbit OS",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-canvas text-content-primary">
      <div className="mb-8 flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-accent text-accent-fg flex items-center justify-center shadow-card">
          <Planet weight="duotone" className="w-6 h-6" />
        </div>
        <span className="text-xl font-bold font-display tracking-tight text-content-primary">
          Orbit
        </span>
      </div>

      <Suspense fallback={<div className="text-sm text-content-secondary">Loading sign in...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
