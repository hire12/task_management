"use client";

import React, { useState } from "react";
import { MagnifyingGlass, Command, Plus, Users } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { UserProfileDropdown } from "@/components/auth/UserProfileDropdown";
import { TeamMembersModal } from "@/components/auth/TeamMembersModal";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onOpenCommand: () => void;
  onOpenNewTask: () => void;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onOpenCommand,
  onOpenNewTask,
  actions,
}) => {
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  return (
    <>
      <header className="h-14 border-b border-border/80 bg-surface/30 backdrop-blur-xs flex items-center justify-between px-6 shrink-0 sticky top-0 z-20">
        {/* Title / Breadcrumb */}
        <div>
          {title && (
            <h1 className="text-[15px] font-semibold text-content-primary tracking-tight leading-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-[12px] text-content-placeholder leading-tight">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search trigger */}
          <button
            onClick={onOpenCommand}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md border border-border bg-surface text-[12.5px] text-content-placeholder hover:text-content-primary hover:border-content-placeholder/40 transition-colors shadow-xs cursor-pointer"
          >
            <MagnifyingGlass weight="bold" className="w-3.5 h-3.5" />
            <span>Quick jump...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-surface-muted px-1.5 py-0.5 text-[10px] font-mono text-content-secondary border border-border/50">
              <Command weight="bold" className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          {actions || (
            <Button size="sm" onClick={onOpenNewTask} className="gap-1 text-[12.5px]">
              <Plus weight="bold" className="w-3 h-3" />
              <span>Task</span>
            </Button>
          )}

          {/* User Profile & Auth Dropdown */}
          <UserProfileDropdown onOpenTeamModal={() => setIsTeamModalOpen(true)} />
        </div>
      </header>

      {/* Team Management Modal */}
      <TeamMembersModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        workspaceName="Workspace"
        organizationId="default"
        currentRole="owner"
      />
    </>
  );
};
