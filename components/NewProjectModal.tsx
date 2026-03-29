"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createProject } from "@/app/actions/projects";
import { TemporalHorizon } from "@prisma/client";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  defaultParentId?: string | null;
  defaultHorizon?: TemporalHorizon;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  workspaceId,
  defaultParentId,
  defaultHorizon = TemporalHorizon.ACTIVE,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [horizon, setHorizon] = useState<TemporalHorizon>(defaultHorizon);
  const [targetDate, setTargetDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await createProject({
        workspaceId,
        parentId: defaultParentId || null,
        title: title.trim(),
        description: description.trim() || undefined,
        temporalHorizon: horizon,
        targetDate: targetDate ? new Date(targetDate) : undefined,
      });

      setTitle("");
      setDescription("");
      onClose();
    } catch (err) {
      console.error("Failed to create project", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={defaultParentId ? "Create Sub-Project" : "Create New Project"}
      description={
        defaultParentId
          ? "Add a modular sub-project to break down this master initiative."
          : "Define a project and place it in the appropriate temporal horizon."
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-[12.5px] font-medium text-content-secondary mb-1">
            Project Title
          </label>
          <Input
            autoFocus
            required
            placeholder="e.g. Next.js Architecture Rebuild"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[12.5px] font-medium text-content-secondary mb-1">
            Description
          </label>
          <Textarea
            placeholder="Brief scope or goal..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12.5px] font-medium text-content-secondary mb-1">
              Temporal Horizon
            </label>
            <select
              value={horizon}
              onChange={(e) => setHorizon(e.target.value as TemporalHorizon)}
              className="w-full rounded-md border border-border bg-surface px-3 py-1.5 text-[13.5px] text-content-primary focus:outline-none focus:border-accent"
            >
              <option value="ACTIVE">⚡ Active (Now)</option>
              <option value="FUTURE">📅 Pipeline (Next)</option>
              <option value="IDEA">💡 Incubator (Someday)</option>
              <option value="SHIPPED">🏆 Shipped (Archive)</option>
            </select>
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-content-secondary mb-1">
              Target Deadline
            </label>
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !title.trim()}>
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
