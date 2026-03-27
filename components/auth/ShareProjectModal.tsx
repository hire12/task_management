"use client";

import React, { useState } from "react";
import { X, ShareNetwork, LinkSimple, Check, Globe, Lock, Eye, Copy } from "@phosphor-icons/react";

interface ShareProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  projectId: string;
  isPublic?: boolean;
  shareToken?: string | null;
  onTogglePublic?: (isPublic: boolean) => Promise<{ shareToken: string }>;
}

export const ShareProjectModal: React.FC<ShareProjectModalProps> = ({
  isOpen,
  onClose,
  projectTitle,
  projectId,
  isPublic = false,
  shareToken,
  onTogglePublic,
}) => {
  const [publicActive, setPublicActive] = useState(isPublic);
  const [token, setToken] = useState(shareToken || projectId.slice(0, 12));
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/p/${token}`;

  const handleToggle = async () => {
    const nextState = !publicActive;
    setPublicActive(nextState);
    setLoading(true);

    try {
      if (onTogglePublic) {
        const res = await onTogglePublic(nextState);
        setToken(res.shareToken);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface shadow-modal flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
              <ShareNetwork weight="duotone" className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-content-primary">
                Share &quot;{projectTitle}&quot;
              </h2>
              <span className="text-[11px] text-content-secondary">
                Invite clients or create read-only public board links
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-content-placeholder hover:text-content-primary hover:bg-surface-raised transition-colors cursor-pointer"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          {/* Public Link Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface-raised">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${publicActive ? "bg-success/20 text-success" : "bg-border text-content-placeholder"}`}>
                {publicActive ? <Globe weight="duotone" className="w-4 h-4" /> : <Lock weight="duotone" className="w-4 h-4" />}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-content-primary">
                  Client & Guest Live Preview
                </span>
                <span className="text-[11px] text-content-secondary">
                  Anyone with the link can view this Kanban board in read-only mode
                </span>
              </div>
            </div>

            <button
              onClick={handleToggle}
              disabled={loading}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                publicActive ? "bg-accent justify-end" : "bg-border justify-start"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {/* Share Link Box */}
          {publicActive && (
            <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-accent/30 bg-accent/10 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-semibold text-content-primary">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-accent" />
                  <span>Public Client View URL</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-accent hover:underline cursor-pointer"
                >
                  {copied ? <Check weight="bold" className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy URL"}</span>
                </button>
              </div>

              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full px-3 py-1.5 rounded-lg border border-accent/30 bg-surface text-[11px] text-content-primary font-mono select-all focus:outline-none"
              />

              <p className="text-[10px] text-content-secondary">
                Clients can view task progress, checklists, and screenshots without signing in or editing board cards.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
