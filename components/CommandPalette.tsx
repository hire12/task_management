"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlass,
  FolderSimple,
  CheckCircle,
  Lightning,
  CalendarBlank,
  Trophy,
} from "@phosphor-icons/react";
import { Modal } from "@/components/ui/Modal";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewProject: () => void;
  onOpenNewTask: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenNewProject,
  onOpenNewTask,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: "new-task",
      title: "Create new task",
      icon: CheckCircle,
      action: () => {
        onClose();
        onOpenNewTask();
      },
    },
    {
      id: "new-project",
      title: "Create new project",
      icon: FolderSimple,
      action: () => {
        onClose();
        onOpenNewProject();
      },
    },
    {
      id: "goto-today",
      title: "Open Today's Focus HUD",
      icon: Lightning,
      action: () => {
        onClose();
        router.push("/today");
      },
    },
    {
      id: "goto-active",
      title: "Go to Active Projects",
      icon: CalendarBlank,
      action: () => {
        onClose();
        router.push("/?horizon=ACTIVE");
      },
    },
    {
      id: "goto-shipped",
      title: "Go to Trophy Room (Shipped)",
      icon: Trophy,
      action: () => {
        onClose();
        router.push("/?horizon=SHIPPED");
      },
    },
  ];

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Command Palette" maxWidth="md">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-surface-muted/50">
          <MagnifyingGlass weight="bold" className="w-4 h-4 text-content-placeholder" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or navigate..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[14px] text-content-primary placeholder:text-content-placeholder focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pt-1">
          {filtered.length === 0 ? (
            <p className="text-[13px] text-content-placeholder text-center py-4">
              No matching actions found.
            </p>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-left text-[13.5px] font-medium text-content-primary hover:bg-surface-muted transition-colors cursor-pointer"
                >
                  <Icon weight="duotone" className="w-4 h-4 text-accent" />
                  <span>{item.title}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};
