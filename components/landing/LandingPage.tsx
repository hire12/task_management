"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Kanban,
  Lightning,
  Users,
  ShieldCheck,
  ShareNetwork,
  ChartLineUp,
  ArrowRight,
  Check,
  Sparkle,
  TreeStructure,
  Article,
  Eye,
  Lock,
  Globe,
  Sun,
  Moon,
  FolderSimple,
  CheckSquareOffset,
} from "@phosphor-icons/react";

export const LandingPage: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      setIsDark(false);
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      setIsDark(true);
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <div className="min-h-screen bg-page text-content-primary flex flex-col selection:bg-accent/20">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-surface/70 border-b border-border/80 px-6 lg:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-white shadow-card group-hover:scale-105 transition-transform">
              <Kanban weight="duotone" className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold font-display tracking-tight text-content-primary">
              orbit
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">
              v2.5
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-content-secondary">
            <a href="#features" className="hover:text-content-primary transition-colors">
              Features
            </a>
            <a href="#architecture" className="hover:text-content-primary transition-colors">
              Architecture
            </a>
            <a href="#security" className="hover:text-content-primary transition-colors">
              Security & RBAC
            </a>
            <a href="#client-portal" className="hover:text-content-primary transition-colors">
              Client Portal
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            title="Toggle dark mode"
            className="p-2 rounded-xl border border-border bg-surface text-content-secondary hover:text-content-primary hover:bg-surface-raised transition-colors cursor-pointer"
          >
            {isDark ? (
              <Sun weight="duotone" className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon weight="duotone" className="w-4 h-4 text-content-secondary" />
            )}
          </button>

          <Link
            href="/auth/sign-in"
            className="px-4 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-content-primary hover:bg-surface-raised transition-colors shadow-2xs"
          >
            Log In
          </Link>

          <Link
            href="/auth/sign-up"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover active:scale-95 transition-all shadow-card"
          >
            <span>Get Started for Free</span>
            <ArrowRight weight="bold" className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 px-6 lg:px-12 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-accent/15 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-semibold mb-6 animate-fade-in">
          <Sparkle weight="duotone" className="w-4 h-4" />
          <span>Next-Generation Multi-Tenant Project OS with Better Auth</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-content-primary max-w-4xl leading-[1.15]">
          The Speed-First Operating System for Initiatives & Teams
        </h1>

        <p className="mt-6 text-base sm:text-lg text-content-secondary max-w-2xl leading-relaxed">
          Manage recursive projects, temporal horizons, and live velocity sparklines. 
          Seamlessly transition between private personal spaces and collaborative team organizations.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/auth/sign-up"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover active:scale-95 transition-all shadow-raised"
          >
            <span>Get Started for Free</span>
            <ArrowRight weight="bold" className="w-4 h-4" />
          </Link>

          <Link
            href="/auth/sign-in"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-surface text-content-primary text-sm font-semibold hover:bg-surface-raised transition-colors shadow-card"
          >
            <span>Sign In to Your Workspace</span>
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-6 text-xs text-content-placeholder">
          <span className="flex items-center gap-1.5">
            <Check weight="bold" className="w-3.5 h-3.5 text-accent" />
            <span>No credit card required</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Check weight="bold" className="w-3.5 h-3.5 text-accent" />
            <span>Instant 1-click personal space</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Check weight="bold" className="w-3.5 h-3.5 text-accent" />
            <span>PostgreSQL & Better Auth</span>
          </span>
        </div>

        {/* Live Interactive Board Mockup */}
        <div className="mt-16 w-full max-w-5xl rounded-2xl border border-border/80 bg-surface/80 backdrop-blur-md p-4 sm:p-6 shadow-modal overflow-hidden text-left">
          {/* Mock Window Topbar */}
          <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-danger/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-success/80" />
              </div>
              <div className="h-4 w-[1px] bg-border mx-1" />
              <div className="flex items-center gap-2 text-xs font-semibold text-content-primary">
                <FolderSimple weight="duotone" className="w-4 h-4 text-accent" />
                <span>Orbit Platform 2.5 Architecture</span>
                <span className="px-2 py-0.5 rounded-full bg-success/15 text-success text-[10px] font-bold">
                  ACTIVE SPRINT
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-content-placeholder hidden sm:inline">
                83% Velocity
              </span>
              <div className="w-6 h-6 rounded-full bg-accent/20 text-accent font-bold text-[10px] flex items-center justify-center border border-accent/30">
                HM
              </div>
            </div>
          </div>

          {/* Mock Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: TODO */}
            <div className="rounded-xl border border-border/60 bg-surface-raised/40 p-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-content-secondary px-1">
                <span>To Do</span>
                <span className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono">1</span>
              </div>
              <div className="rounded-lg border border-border bg-surface p-3 shadow-card flex flex-col gap-2">
                <span className="text-xs font-semibold text-content-primary">
                  Build Client Guest Portal for Public Read-Only Kanban Boards
                </span>
                <div className="flex items-center justify-between text-[11px] text-content-placeholder pt-2 border-t border-border/50">
                  <span className="flex items-center gap-1 text-accent">
                    <Globe weight="bold" className="w-3 h-3" />
                    <span>Public View</span>
                  </span>
                  <span className="font-mono">30m</span>
                </div>
              </div>
            </div>

            {/* Column 2: IN PROGRESS */}
            <div className="rounded-xl border border-border/60 bg-surface-raised/40 p-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-content-secondary px-1">
                <span>In Progress</span>
                <span className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono">1</span>
              </div>
              <div className="rounded-lg border border-accent/40 bg-surface p-3 shadow-card flex flex-col gap-2 ring-1 ring-accent/20">
                <span className="text-xs font-semibold text-content-primary">
                  Workspace Switcher and Team Member Invite Modal
                </span>
                <div className="flex items-center gap-1 text-[11px] text-content-secondary">
                  <CheckSquareOffset weight="duotone" className="w-3.5 h-3.5 text-accent" />
                  <span>2/3 subtasks</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-content-placeholder pt-2 border-t border-border/50">
                  <span className="px-1.5 py-0.5 rounded bg-brandWarning/15 text-brandWarning text-[10px] font-bold">
                    URGENT
                  </span>
                  <div className="w-5 h-5 rounded-full bg-accent/20 text-accent font-bold text-[9px] flex items-center justify-center">
                    HM
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: DONE */}
            <div className="rounded-xl border border-border/60 bg-surface-raised/40 p-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-content-secondary px-1">
                <span>Completed</span>
                <span className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono">1</span>
              </div>
              <div className="rounded-lg border border-border bg-surface p-3 shadow-card flex flex-col gap-2 opacity-85">
                <span className="text-xs font-semibold text-content-primary line-through text-content-secondary">
                  Integrate Better Auth Next.js route handler and session provider
                </span>
                <div className="flex items-center justify-between text-[11px] text-success pt-2 border-t border-border/50">
                  <span className="flex items-center gap-1">
                    <Check weight="bold" className="w-3 h-3" />
                    <span>Deployed</span>
                  </span>
                  <span className="font-mono">45m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full border-t border-border/60">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-display tracking-tight text-content-primary">
            Engineered for Maximum Cognitive Clarity
          </h2>
          <p className="mt-3 text-sm text-content-secondary leading-relaxed">
            Eliminate task clutter with spatial horizons, recursive initiatives, and live collaborative feeds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card flex flex-col gap-3 hover:border-accent/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <Lightning weight="duotone" className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-content-primary tracking-tight">
              Temporal Horizons
            </h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              Triage initiatives across Active Sprints (Now), Pipeline (Next), Incubator (Someday), and Shipped Trophy Room.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card flex flex-col gap-3 hover:border-accent/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <Users weight="duotone" className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-content-primary tracking-tight">
              Personal & Team Spaces
            </h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              Maintain private sandboxes alongside organization team spaces with 1-click cryptographic invitation links.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card flex flex-col gap-3 hover:border-accent/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <ShareNetwork weight="duotone" className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-content-primary tracking-tight">
              Guest Client Portals
            </h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              Share live, read-only Kanban previews (<code className="font-mono text-accent">/p/[token]</code>) with clients and external stakeholders without login friction.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card flex flex-col gap-3 hover:border-accent/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <ShieldCheck weight="duotone" className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-content-primary tracking-tight">
              Role-Based Access Control
            </h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              Granular permission matrices across Owner, Admin, Member, and Viewer roles protect critical initiatives.
            </p>
          </div>

          {/* Card 5 */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card flex flex-col gap-3 hover:border-accent/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <ChartLineUp weight="duotone" className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-content-primary tracking-tight">
              D3.js Monotone Splines
            </h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              Interactive micro-sparklines and SVG progress rings render real-time sprint velocity at a glance.
            </p>
          </div>

          {/* Card 6 */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card flex flex-col gap-3 hover:border-accent/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <TreeStructure weight="duotone" className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-content-primary tracking-tight">
              Recursive Sub-Projects
            </h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              Decompose massive master initiatives into modular sub-projects with automatic progress aggregation.
            </p>
          </div>
        </div>
      </section>

      {/* Security & Multi-Tenancy Deep Dive */}
      <section id="security" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full border-t border-border/60">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-semibold w-fit">
              <Lock weight="duotone" className="w-3.5 h-3.5" />
              <span>Strict Data Isolation</span>
            </div>

            <h2 className="text-3xl font-bold font-display tracking-tight text-content-primary">
              Dual-Tier Multi-Tenancy & Zero-Trust Privacy
            </h2>

            <p className="text-sm text-content-secondary leading-relaxed">
              Every account is automatically provisioned with a private Personal Space. 
              Team spaces use Better Auth organization memberships, ensuring that team members only see projects they have explicit clearance to view.
            </p>

            <ul className="flex flex-col gap-3 text-xs text-content-secondary">
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <Check weight="bold" className="w-3 h-3" />
                </div>
                <span>Encrypted session cookies with automated rotation</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <Check weight="bold" className="w-3 h-3" />
                </div>
                <span>Server Action authorization checks preventing IDOR data leaks</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <Check weight="bold" className="w-3 h-3" />
                </div>
                <span>Audit trail logging in ActivityLog for team compliance</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors shadow-card"
              >
                <span>Create Your Private Account</span>
                <ArrowRight weight="bold" className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-modal flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-content-placeholder">
              Permission Hierarchy
            </h4>

            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-raised/50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span className="font-semibold text-content-primary">Owner</span>
                </div>
                <span className="text-content-secondary">Full Workspace Control, Billing, Destroy Space</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-raised/50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-semibold text-content-primary">Admin</span>
                </div>
                <span className="text-content-secondary">Invite Teammates, Manage Roles, Delete Initiatives</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-raised/50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-content-primary">Member</span>
                </div>
                <span className="text-content-secondary">Create Tasks, Edit Cards, Assign Tasks</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-raised/50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-content-placeholder" />
                  <span className="font-semibold text-content-primary">Viewer</span>
                </div>
                <span className="text-content-secondary">Read-Only Specs, Board Inspection, Lightbox Zoom</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 lg:px-12 max-w-5xl mx-auto w-full text-center">
        <div className="rounded-3xl border border-border bg-surface/90 backdrop-blur-md p-10 sm:p-14 shadow-modal flex flex-col items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/15 rounded-full blur-3xl pointer-events-none -z-10" />

          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-content-primary">
            Ready to Supercharge Your Engineering Workflow?
          </h2>

          <p className="text-sm text-content-secondary max-w-xl leading-relaxed">
            Join founders and high-output teams operating with Orbit. Set up your personal workspace in under 30 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/auth/sign-up"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover active:scale-95 transition-all shadow-raised"
            >
              <span>Get Started for Free</span>
              <ArrowRight weight="bold" className="w-4 h-4" />
            </Link>

            <Link
              href="/auth/sign-in"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-surface text-content-primary text-sm font-semibold hover:bg-surface-raised transition-colors shadow-card"
            >
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/80 bg-surface/40 py-8 px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-content-placeholder max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Kanban weight="duotone" className="w-4 h-4 text-accent" />
          <span className="font-semibold text-content-primary">Orbit OS</span>
          <span>· Modern Project & Future OS</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/auth/sign-in" className="hover:text-content-primary transition-colors">
            Sign In
          </Link>
          <Link href="/auth/sign-up" className="hover:text-content-primary transition-colors">
            Sign Up
          </Link>
          <a href="https://github.com/hire12/task_management" target="_blank" rel="noopener noreferrer" className="hover:text-content-primary transition-colors">
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};
