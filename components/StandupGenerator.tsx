"use client";

import React, { useState } from "react";
import { Sparkle, Copy, Check, X, ChatText } from "@phosphor-icons/react";
import { FullTask } from "@/lib/types";

interface StandupGeneratorProps {
  tasks: FullTask[];
}

export const StandupGenerator: React.FC<StandupGeneratorProps> = ({ tasks }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const doneTasks = tasks.filter((t) => t.status === "DONE").slice(0, 5);
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").slice(0, 5);
  const blockedTasks = tasks.filter((t) => t.priority === "URGENT" && t.status !== "DONE").slice(0, 3);

  const generateStandupText = () => {
    let text = "🚀 **Daily Standup Report**\n\n";
    text += "✅ **Completed:**\n";
    if (doneTasks.length > 0) {
      doneTasks.forEach((t) => (text += `- ${t.title}\n`));
    } else {
      text += "- Wrapping up active sprint tasks\n";
    }

    text += "\n🔨 **Working On Today:**\n";
    if (inProgressTasks.length > 0) {
      inProgressTasks.forEach((t) => (text += `- ${t.title}\n`));
    } else {
      text += "- Picking up next backlog items\n";
    }

    text += "\n🚧 **Blockers / Impediments:**\n";
    if (blockedTasks.length > 0) {
      blockedTasks.forEach((t) => (text += `- Blocked on: ${t.title}\n`));
    } else {
      text += "- No blockers. All systems green!\n";
    }

    return text;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateStandupText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent/40 bg-accent/10 text-accent text-[12px] font-medium hover:bg-accent hover:text-white transition-colors cursor-pointer shadow-2xs"
      >
        <Sparkle weight="duotone" className="w-3.5 h-3.5" />
        <span>Standup AI</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-fade-in">
          <div className="relative w-full max-w-lg bg-surface rounded-2xl border border-border shadow-modal p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/80">
              <div className="flex items-center gap-2">
                <ChatText weight="duotone" className="w-5 h-5 text-accent" />
                <h3 className="text-[15px] font-semibold text-content-primary">
                  1-Click Daily Standup Generator
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-content-placeholder hover:text-content-primary hover:bg-surface-muted transition-colors cursor-pointer"
              >
                <X weight="bold" className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-surface-muted/30 border border-border font-mono text-[12px] leading-relaxed text-content-primary whitespace-pre-wrap max-h-72 overflow-y-auto">
              {generateStandupText()}
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-border text-content-secondary text-[12px] hover:bg-surface-muted transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-accent text-white text-[12px] font-medium hover:bg-accent/90 transition-colors cursor-pointer shadow-xs"
              >
                {copied ? (
                  <>
                    <Check weight="bold" className="w-3.5 h-3.5 text-brandSuccess" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy weight="bold" className="w-3.5 h-3.5" />
                    <span>Copy for Slack / Discord</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
