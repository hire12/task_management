"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createTask } from "@/app/actions/tasks";
import { PriorityLevel, TaskStatus, Project } from "@prisma/client";

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Pick<Project, "id" | "title" | "parentId">[];
  defaultProjectId?: string;
  defaultStatus?: TaskStatus;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  projects,
  defaultProjectId,
  defaultStatus = TaskStatus.TODO,
}) => {
  const [projectId, setProjectId] = useState(defaultProjectId || projects[0]?.id || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>(PriorityLevel.MEDIUM);
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [dueDate, setDueDate] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    setLoading(true);
    try {
      await createTask({
        projectId,
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes, 10) : undefined,
      });

      setTitle("");
      setDescription("");
      setDueDate("");
      setEstimatedMinutes("");
      onClose();
    } catch (err) {
      console.error("Failed to create task", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      description="Add an actionable unit of work to a project."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-[12.5px] font-medium text-content-secondary mb-1">
            Project
          </label>
          <select
            required
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-1.5 text-[13.5px] text-content-primary focus:outline-none focus:border-accent"
          >
            {projects.length === 0 ? (
              <option value="">No projects available (Create one first)</option>
            ) : (
              projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.parentId ? "↳ " : ""}
                  {p.title}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="block text-[12.5px] font-medium text-content-secondary mb-1">
            Task Title
          </label>
          <Input
            autoFocus
            required
            placeholder="e.g. Implement refresh token rotation"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[12.5px] font-medium text-content-secondary mb-1">
            Details & Notes
          </label>
          <Textarea
            placeholder="Context, specs, or acceptance criteria..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12.5px] font-medium text-content-secondary mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full rounded-md border border-border bg-surface px-3 py-1.5 text-[13.5px] text-content-primary focus:outline-none focus:border-accent"
            >
              <option value="BACKLOG">Backlog</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">In Review</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-content-secondary mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              className="w-full rounded-md border border-border bg-surface px-3 py-1.5 text-[13.5px] text-content-primary focus:outline-none focus:border-accent"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12.5px] font-medium text-content-secondary mb-1">
              Due Date
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-content-secondary mb-1">
              Est. Minutes
            </label>
            <Input
              type="number"
              placeholder="e.g. 45"
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !title.trim() || !projectId}>
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
