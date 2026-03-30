"use client";

import React, { useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { CommandPalette } from "@/components/CommandPalette";
import { NewProjectModal } from "@/components/NewProjectModal";
import { NewTaskModal } from "@/components/NewTaskModal";
import { KeyboardShortcutsHelp } from "@/components/KeyboardShortcutsHelp";
import { Project } from "@prisma/client";

interface ShellProps {
  children: React.ReactNode;
  workspaceId: string;
  projects: Pick<Project, "id" | "title" | "parentId">[];
}

export const Shell: React.FC<ShellProps> = ({
  children,
  workspaceId,
  projects,
}) => {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  // If on public standalone routes, render clean container without dashboard sidebar/header
  const isPublicAuthOrPortal =
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/invite/") ||
    pathname.startsWith("/p/");

  const isPublicLanding = pathname === "/" && !session?.user && !isPending;

  if (isPublicAuthOrPortal || isPublicLanding) {
    return (
      <div className="min-h-screen bg-page text-content-primary">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-page text-content-primary">
      <Suspense fallback={<div className="w-64 border-r border-border bg-surface/50" />}>
        <Sidebar
          onOpenNewProject={() => setIsNewProjectOpen(true)}
          onOpenNewTask={() => setIsNewTaskOpen(true)}
        />
      </Suspense>

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenCommand={() => setIsCommandOpen(true)}
          onOpenNewTask={() => setIsNewTaskOpen(true)}
        />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onOpenNewProject={() => setIsNewProjectOpen(true)}
        onOpenNewTask={() => setIsNewTaskOpen(true)}
      />

      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        workspaceId={workspaceId}
      />

      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        projects={projects}
      />

      <KeyboardShortcutsHelp />
    </div>
  );
};
