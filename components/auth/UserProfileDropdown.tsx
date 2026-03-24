"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { User, SignOut, Users, CaretDown, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserProfileDropdownProps {
  onOpenTeamModal?: () => void;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ onOpenTeamModal }) => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isPending) {
    return (
      <div className="w-8 h-8 rounded-full bg-surface-raised animate-pulse border border-border" />
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/sign-in"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-semibold text-content-primary hover:bg-surface-raised transition-colors shadow-2xs cursor-pointer"
        >
          <User weight="bold" className="w-3.5 h-3.5 text-accent" />
          <span>Log In</span>
        </Link>
        <Link
          href="/auth/sign-up"
          className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover active:scale-95 transition-all shadow-2xs cursor-pointer"
        >
          <span>Sign Up</span>
          <ArrowRight weight="bold" className="w-3 h-3" />
        </Link>
      </div>
    );
  }

  const user = session.user;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/sign-in");
    router.refresh();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl border border-border bg-surface hover:bg-surface-raised transition-colors shadow-2xs cursor-pointer group"
      >
        <div className="w-6 h-6 rounded-full bg-accent/20 text-accent font-bold text-[10px] flex items-center justify-center border border-accent/30">
          {initials}
        </div>
        <span className="text-xs font-medium text-content-primary max-w-[100px] truncate hidden sm:inline">
          {user.name}
        </span>
        <CaretDown weight="bold" className={`w-3 h-3 text-content-placeholder transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-surface p-2 shadow-modal flex flex-col gap-1 z-50 animate-fade-in">
          {/* User Info Header */}
          <div className="p-2.5 border-b border-border/80 flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-content-primary truncate">
              {user.name}
            </span>
            <span className="text-[11px] text-content-secondary truncate">
              {user.email}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col py-1">
            {onOpenTeamModal && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenTeamModal();
                }}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-content-primary hover:bg-surface-raised transition-colors text-left cursor-pointer"
              >
                <Users weight="duotone" className="w-4 h-4 text-accent" />
                <span>Manage Team & Invites</span>
              </button>
            )}
          </div>

          {/* Sign Out */}
          <div className="pt-1 border-t border-border/80">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-danger hover:bg-danger/10 transition-colors text-left cursor-pointer"
            >
              <SignOut weight="duotone" className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
