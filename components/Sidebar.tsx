"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  Lightning,
  CalendarBlank,
  Lightbulb,
  Trophy,
  CheckCircle,
  FolderSimple,
  Plus,
  Moon,
  Sun,
  Kanban,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { WorkspaceSwitcher } from "@/components/auth/WorkspaceSwitcher";
import { getUserWorkspacesAction, createTeamWorkspaceAction } from "@/app/actions/workspace";
import { UserWorkspace } from "@/lib/workspace";

interface SidebarProps {
  onOpenNewProject: () => void;
  onOpenNewTask: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenNewProject,
  onOpenNewTask,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentHorizon = searchParams.get("horizon") || "ACTIVE";
  const currentWorkspaceId = searchParams.get("workspaceId") || undefined;
  const [isDark, setIsDark] = useState(false);
  const [workspaces, setWorkspaces] = useState<UserWorkspace[]>([]);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    getUserWorkspacesAction().then((data) => {
      if (data && data.length > 0) {
        setWorkspaces(data);
      }
    });
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

  const handleSelectWorkspace = (workspaceId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("workspaceId", workspaceId);
    router.push(`/?${params.toString()}`);
  };

  const handleCreateTeamSpace = async (name: string) => {
    await createTeamWorkspaceAction(name);
    const updated = await getUserWorkspacesAction();
    if (updated) setWorkspaces(updated);
    router.refresh();
  };

  const navItems = [
    {
      label: "Today's Focus",
      href: "/today",
      icon: CheckCircle,
      isActive: pathname === "/today",
      badge: "HUD",
    },
    {
      label: "Active (Now)",
      href: `/?horizon=ACTIVE${currentWorkspaceId ? `&workspaceId=${currentWorkspaceId}` : ""}`,
      icon: Lightning,
      isActive: pathname === "/" && currentHorizon === "ACTIVE",
    },
    {
      label: "Pipeline (Next)",
      href: `/?horizon=FUTURE${currentWorkspaceId ? `&workspaceId=${currentWorkspaceId}` : ""}`,
      icon: CalendarBlank,
      isActive: pathname === "/" && currentHorizon === "FUTURE",
    },
    {
      label: "Incubator (Someday)",
      href: `/?horizon=IDEA${currentWorkspaceId ? `&workspaceId=${currentWorkspaceId}` : ""}`,
      icon: Lightbulb,
      isActive: pathname === "/" && currentHorizon === "IDEA",
    },
    {
      label: "Trophy Room (Shipped)",
      href: `/?horizon=SHIPPED${currentWorkspaceId ? `&workspaceId=${currentWorkspaceId}` : ""}`,
      icon: Trophy,
      isActive: pathname === "/" && currentHorizon === "SHIPPED",
    },
  ];

  return (
    <aside className="w-64 border-r border-border/80 bg-surface/50 backdrop-blur-sm flex flex-col justify-between p-4 shrink-0 min-h-screen select-none">
      <div className="flex flex-col gap-5">
        {/* Brand Wordmark & Theme Switcher */}
        <div className="flex items-center justify-between px-2 pt-1">
          <Link
            href="/"
            className="flex items-center gap-2.5 group transition-opacity hover:opacity-80"
          >
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white shadow-xs">
              <Kanban weight="duotone" className="w-4 h-4" />
            </div>
            <span className="text-[16px] font-semibold tracking-tight text-content-primary">
              orbit
            </span>
          </Link>

          <button
            onClick={toggleDarkMode}
            title="Toggle theme"
            className="p-1.5 rounded-md text-content-placeholder hover:text-content-primary hover:bg-surface-muted transition-colors cursor-pointer"
          >
            {isDark ? (
              <Sun weight="duotone" className="w-4 h-4 text-brandWarning" />
            ) : (
              <Moon weight="duotone" className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Workspace & Team Space Switcher */}
        {workspaces.length > 0 && (
          <div className="px-1">
            <WorkspaceSwitcher
              workspaces={workspaces}
              activeWorkspaceId={currentWorkspaceId || workspaces[0]?.id}
              onSelectWorkspace={handleSelectWorkspace}
              onCreateTeamSpace={handleCreateTeamSpace}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 px-1">
          <button
            onClick={onOpenNewTask}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md bg-accent text-white text-[13px] font-medium shadow-xs hover:bg-accent-hover active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus weight="bold" className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
          <button
            onClick={onOpenNewProject}
            title="Create Project"
            className="p-2 rounded-md border border-border bg-surface text-content-secondary hover:text-content-primary hover:bg-surface-muted active:scale-[0.98] transition-all cursor-pointer"
          >
            <FolderSimple weight="duotone" className="w-4 h-4" />
          </button>
        </div>

        {/* Temporal Navigation */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-content-placeholder uppercase tracking-wider px-2.5 mb-1">
            Horizons
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-2.5 py-2 rounded-md text-[13.5px] font-medium transition-colors",
                  item.isActive
                    ? "bg-surface-muted text-content-primary font-semibold shadow-xs"
                    : "text-content-secondary hover:text-content-primary hover:bg-surface-muted/60"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    weight="duotone"
                    className={cn(
                      "w-4 h-4",
                      item.isActive ? "text-accent" : "text-content-placeholder"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-accent/15 text-accent">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-2 pt-4 border-t border-border/60 text-[12px] text-content-placeholder flex items-center justify-between">
        <span>Project & Future OS</span>
        <span className="font-mono text-[11px]">v2.5</span>
      </div>
    </aside>
  );
};
