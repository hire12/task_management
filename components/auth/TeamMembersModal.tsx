"use client";

import React, { useState } from "react";
import { X, Users, EnvelopeSimple, LinkSimple, Check, Trash, ShieldCheck, UserPlus, Sparkle } from "@phosphor-icons/react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  avatar?: string | null;
  joinedAt: string;
}

interface PendingInvite {
  id: string;
  email: string;
  role: string;
  token: string;
  expiresAt: string;
}

interface TeamMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceName: string;
  organizationId: string;
  currentRole: "owner" | "admin" | "member" | "viewer";
  initialMembers?: TeamMember[];
  initialInvites?: PendingInvite[];
  onInviteMember?: (email: string, role: string) => Promise<{ token: string }>;
  onRemoveMember?: (memberId: string) => Promise<void>;
  onRevokeInvite?: (inviteId: string) => Promise<void>;
}

export const TeamMembersModal: React.FC<TeamMembersModalProps> = ({
  isOpen,
  onClose,
  workspaceName,
  organizationId,
  currentRole,
  initialMembers = [],
  initialInvites = [],
  onInviteMember,
  onRemoveMember,
  onRevokeInvite,
}) => {
  const [activeTab, setActiveTab] = useState<"members" | "invite">("members");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!isOpen) return null;

  const canManage = currentRole === "owner" || currentRole === "admin";

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setLoading(true);
    setFeedback(null);

    try {
      if (onInviteMember) {
        const res = await onInviteMember(inviteEmail.trim(), inviteRole);
        const link = `${window.location.origin}/invite/${res.token}`;
        setCopiedLink(link);
        setFeedback({
          type: "success",
          text: `Invite sent to ${inviteEmail}. You can also share the link directly!`,
        });
        setInviteEmail("");
      } else {
        // Fallback simulation
        const dummyToken = Math.random().toString(36).substring(2, 10);
        const link = `${window.location.origin}/invite/${dummyToken}`;
        setCopiedLink(link);
        setFeedback({
          type: "success",
          text: `Invitation link generated successfully!`,
        });
        setInviteEmail("");
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to generate invite." });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (copiedLink) {
      navigator.clipboard.writeText(copiedLink);
      setFeedback({ type: "success", text: "Invitation link copied to clipboard!" });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface shadow-modal flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
              <Users weight="duotone" className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-content-primary">
                {workspaceName} Team Members
              </h2>
              <span className="text-[11px] text-content-secondary">
                Manage access, assign roles, and invite teammates
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-content-placeholder hover:text-content-primary hover:bg-surface-raised transition-colors"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border px-6 pt-2 gap-4">
          <button
            onClick={() => setActiveTab("members")}
            className={`pb-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "members"
                ? "border-accent text-accent"
                : "border-transparent text-content-secondary hover:text-content-primary"
            }`}
          >
            Active Members ({initialMembers.length || 1})
          </button>
          {canManage && (
            <button
              onClick={() => setActiveTab("invite")}
              className={`pb-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === "invite"
                  ? "border-accent text-accent"
                  : "border-transparent text-content-secondary hover:text-content-primary"
              }`}
            >
              + Invite Teammates
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-4 max-h-96 overflow-y-auto">
          {feedback && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                feedback.type === "success"
                  ? "border-success/30 bg-success/10 text-success"
                  : "border-danger/30 bg-danger/10 text-danger"
              }`}
            >
              <span>{feedback.text}</span>
            </div>
          )}

          {activeTab === "members" ? (
            <div className="flex flex-col gap-2">
              {initialMembers.length === 0 ? (
                <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-raised">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 text-accent font-bold text-xs flex items-center justify-center">
                      YOU
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-content-primary">
                        Workspace Owner
                      </span>
                      <span className="text-[11px] text-content-secondary">
                        Full Administrator Access
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/20">
                    Owner
                  </span>
                </div>
              ) : (
                initialMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-raised hover:border-border-hover transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/20 text-accent font-bold text-xs flex items-center justify-center">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-content-primary">
                          {member.name}
                        </span>
                        <span className="text-[11px] text-content-secondary">
                          {member.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface border border-border text-content-primary">
                        {member.role}
                      </span>
                      {canManage && member.role !== "owner" && onRemoveMember && (
                        <button
                          onClick={() => onRemoveMember(member.id)}
                          title="Remove member"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-content-placeholder hover:text-danger hover:bg-danger/10 transition-colors"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <form onSubmit={handleSendInvite} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-content-secondary">
                    Teammate Email Address
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1 flex items-center">
                      <EnvelopeSimple className="w-4 h-4 text-content-placeholder absolute left-3" />
                      <input
                        type="email"
                        required
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@company.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface-raised text-xs text-content-primary placeholder:text-content-placeholder focus:outline-none focus:border-accent"
                      />
                    </div>

                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-border bg-surface-raised text-xs text-content-primary focus:outline-none focus:border-accent cursor-pointer"
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !inviteEmail.trim()}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-accent-fg text-xs font-semibold hover:opacity-90 active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-card"
                >
                  <UserPlus weight="bold" className="w-4 h-4" />
                  <span>{loading ? "Generating..." : "Generate Invitation Link"}</span>
                </button>
              </form>

              {copiedLink && (
                <div className="p-3.5 rounded-xl border border-accent/30 bg-accent/10 flex flex-col gap-2 animate-fade-in">
                  <div className="flex items-center justify-between text-xs font-semibold text-content-primary">
                    <span>Direct Shareable Link</span>
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-1 text-accent hover:underline cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={copiedLink}
                    className="w-full px-3 py-1.5 rounded-lg border border-accent/30 bg-surface text-[11px] text-content-primary font-mono select-all focus:outline-none"
                  />
                  <span className="text-[10px] text-content-secondary">
                    Send this link to your teammate via Slack, WhatsApp, or email. It expires in 7 days.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
