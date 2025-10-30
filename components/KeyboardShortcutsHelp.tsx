"use client";

import React, { useState, useEffect } from "react";
import { Command, X, Keyboard } from "@phosphor-icons/react";

export const KeyboardShortcutsHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: "Navigation Chords",
      shortcuts: [
        { keys: ["G", "T"], desc: "Go to Today HUD" },
        { keys: ["G", "P"], desc: "Go to Projects" },
        { keys: ["G", "B"], desc: "Go to Backlog" },
        { keys: ["/"], desc: "Quick Filter / Search" },
      ],
    },
    {
      title: "Task Actions",
      shortcuts: [
        { keys: ["C"], desc: "Create New Task" },
        { keys: ["Cmd", "V"], desc: "Paste Screenshot from Clipboard" },
        { keys: ["Cmd", "Z"], desc: "Undo Last Destructive Action" },
        { keys: ["Esc"], desc: "Close Modals / Deselect" },
      ],
    },
    {
      title: "Media & Canvas",
      shortcuts: [
        { keys: ["+ / -"], desc: "Zoom In / Out on Lightbox" },
        { keys: ["0"], desc: "Reset Zoom to 100%" },
        { keys: ["← / →"], desc: "Cycle Gallery Screenshots" },
        { keys: ["?"], desc: "Toggle this Shortcuts Cheat Sheet" },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-fade-in">
      <div className="relative w-full max-w-xl bg-surface rounded-2xl border border-border shadow-modal p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/80">
          <div className="flex items-center gap-2.5">
            <Keyboard weight="duotone" className="w-5 h-5 text-accent" />
            <h3 className="text-[16px] font-semibold text-content-primary">
              Keyboard Shortcuts & Vim Chords
            </h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-content-placeholder hover:text-content-primary hover:bg-surface-muted transition-colors cursor-pointer"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {shortcutGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-2.5">
              <span className="text-[11.5px] font-semibold uppercase tracking-wider text-content-placeholder">
                {group.title}
              </span>
              <div className="flex flex-col gap-2">
                {group.shortcuts.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[12.5px]">
                    <span className="text-content-secondary">{s.desc}</span>
                    <div className="flex items-center gap-1">
                      {s.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-0.5 rounded bg-surface-muted border border-border font-mono text-[11px] font-medium text-content-primary shadow-2xs"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border/60 text-center text-[11.5px] text-content-placeholder">
          Press <kbd className="font-mono bg-surface-muted px-1.5 py-0.5 rounded border border-border">?</kbd> anywhere to summon this cheat sheet
        </div>
      </div>
    </div>
  );
};
