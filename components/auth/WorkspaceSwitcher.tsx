"use client";

import React, { useState, useRef, useEffect } from "react";
import { Planet, Users, Plus, Check, CaretUpDown, Sparkle, UserCircle } from "@phosphor-icons/react";
import { UserWorkspace } from "@/lib/workspace";

interface WorkspaceSwitcherProps {
  workspaces: UserWorkspace[];
  activeWorkspaceId?: string;
  onSelectWorkspace: (workspaceId: string) => void;
  onCreateTeamSpace: (name: string) => Promise<void>;
}

export const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = ({
  workspaces,
  activeWorkspaceId,
  onSelectWorkspace,
  onCreateTeamSpace,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    setLoading(true);
    try {
      await onCreateTeamSpace(newTeamName.trim());
      setNewTeamName("");
      setIsCreating(false);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-raised transition-colors shadow-2xs cursor-pointer group"
      >
        <div
          className="w-5 h-5 rounded-lg flex items-center justify-center text-[10px] text-white font-bold shadow-xs"
          style={{ backgroundColor: activeWorkspace?.color || "#4F6B58" }}
        >
          {activeWorkspace?.type === "PERSONAL" ? (
            <UserCircle weight="fill" className="w-3.5 h-3.5" />
          ) : (
            <Users weight="fill" className="w-3.5 h-3.5" />
          )}
        </div>

        <div className="flex flex-col items-start leading-tight">
          <span className="text-xs font-semibold text-content-primary max-w-[120px] truncate">
            {activeWorkspace?.name || "Personal Space"}
          </span>
        </div>

        <CaretUpDown weight="bold" className="w-3 h-3 text-content-placeholder group-hover:text-content-primary transition-colors" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-border bg-surface p-2 shadow-modal flex flex-col gap-2 z-50 animate-fade-in">
          <div className="px-2 py-1 text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
            Your Spaces
          </div>

          <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
            {workspaces.map((ws) => {
              const isSelected = ws.id === activeWorkspace?.id;
              return (
                <button
                  key={ws.id}
                  onClick={() => {
                    onSelectWorkspace(ws.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected ? "bg-accent/15 border border-accent/30" : "hover:bg-surface-raised"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs shrink-0 shadow-xs"
                      style={{ backgroundColor: ws.color }}
                    >
                      {ws.type === "PERSONAL" ? (
                        <UserCircle weight="fill" className="w-3.5 h-3.5" />
                      ) : (
                        <Users weight="fill" className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-content-primary truncate">
                        {ws.name}
                      </span>
                      <span className="text-[10px] text-content-placeholder">
                        {ws.type === "PERSONAL" ? "Private" : `${ws.memberCount} members`}
                      </span>
                    </div>
                  </div>

                  {isSelected && <Check weight="bold" className="w-3.5 h-3.5 text-accent shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="pt-1.5 border-t border-border/80">
            {!isCreating ? (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-accent hover:bg-accent/10 transition-colors text-left cursor-pointer"
              >
                <Plus weight="bold" className="w-3.5 h-3.5" />
                <span>Create New Team Space</span>
              </button>
            ) : (
              <form onSubmit={handleCreateSubmit} className="flex flex-col gap-2 p-1">
                <input
                  type="text"
                  autoFocus
                  required
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Team / Company Name"
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface-raised text-xs text-content-primary placeholder:text-content-placeholder focus:outline-none focus:border-accent"
                />
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-content-secondary hover:bg-surface-raised"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !newTeamName.trim()}
                    className="px-3 py-1 rounded-lg bg-accent text-accent-fg text-[11px] font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
