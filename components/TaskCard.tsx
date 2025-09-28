"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  Circle,
  Calendar,
  Clock,
  Trash,
  DotsSixVertical,
} from "@phosphor-icons/react";
import { FullTask } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { toggleTaskStatus, deleteTask, toggleSubtask, addSubtask } from "@/app/actions/tasks";
import { formatRelativeDate, cn } from "@/lib/utils";

interface TaskCardProps {
  task: FullTask;
  showProjectName?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, task: FullTask) => void;
  isDragging?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  showProjectName = false,
  onDragStart,
  isDragging = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const isDone = task.status === "DONE";

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await toggleTaskStatus(task.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Delete this task?")) {
      await deleteTask(task.id);
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    await addSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle("");
  };

  const priorityBadges: Record<string, "neutral" | "warning" | "danger" | "purple"> = {
    LOW: "neutral",
    MEDIUM: "warning",
    HIGH: "danger",
    URGENT: "purple",
  };

  const completedSubtasks = task.subtasks?.filter((s) => s.isCompleted).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={(e) => onDragStart && onDragStart(e, task)}
      className={cn(
        "group relative rounded-xl border border-border/80 bg-surface p-3.5 transition-all duration-200 hover:border-content-placeholder/40 hover:shadow-card cursor-grab active:cursor-grabbing select-none",
        isDone && "bg-surface-muted/30 opacity-70 border-border/40",
        isDragging && "opacity-40 scale-[0.98] border-dashed border-accent"
      )}
    >
      <div className="flex items-start gap-2.5">
        {/* Drag Handle Indicator */}
        <div className="mt-0.5 text-content-placeholder/40 group-hover:text-content-placeholder transition-colors shrink-0">
          <DotsSixVertical weight="bold" className="w-3.5 h-3.5" />
        </div>

        {/* Toggle Checkbox Button */}
        <button
          onClick={handleToggle}
          disabled={loading}
          className="mt-0.5 text-content-placeholder hover:text-accent transition-colors cursor-pointer shrink-0"
        >
          {isDone ? (
            <CheckCircle weight="fill" className="w-4 h-4 text-brandSuccess" />
          ) : (
            <Circle weight="duotone" className="w-4 h-4" />
          )}
        </button>

        {/* Task Core Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4
              className={cn(
                "text-[13.5px] font-medium text-content-primary tracking-tight leading-snug break-words",
                isDone && "line-through text-content-secondary"
              )}
            >
              {task.title}
            </h4>

            <button
              onClick={handleDelete}
              title="Delete Task"
              className="opacity-0 group-hover:opacity-100 text-content-placeholder hover:text-brandDanger transition-opacity p-0.5 cursor-pointer shrink-0"
            >
              <Trash weight="duotone" className="w-3.5 h-3.5" />
            </button>
          </div>

          {task.description && (
            <p className="text-[12.5px] text-content-secondary line-clamp-2 mt-1 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Badges & Metadata */}
          <div className="flex items-center gap-2 flex-wrap mt-2.5 text-[11.5px] text-content-placeholder">
            {showProjectName && task.project && (
              <span className="font-medium text-content-secondary hover:text-content-primary">
                {task.project.title}
              </span>
            )}

            {task.priority !== "MEDIUM" && (
              <Badge variant={priorityBadges[task.priority] || "neutral"} size="sm">
                {task.priority}
              </Badge>
            )}

            {task.dueDate && (
              <span className="flex items-center gap-1 text-content-secondary">
                <Calendar weight="duotone" className="w-3 h-3" />
                <span>{formatRelativeDate(task.dueDate)}</span>
              </span>
            )}

            {task.estimatedMinutes && (
              <span className="flex items-center gap-1">
                <Clock weight="duotone" className="w-3 h-3" />
                <span>{task.estimatedMinutes}m</span>
              </span>
            )}

            {totalSubtasks > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSubtasks(!showSubtasks);
                }}
                className="hover:text-content-primary transition-colors cursor-pointer"
              >
                {completedSubtasks}/{totalSubtasks} steps
              </button>
            )}
          </div>

          {/* Subtasks view */}
          {showSubtasks && (
            <div className="mt-3 pt-2 border-t border-border/40 flex flex-col gap-1.5">
              {task.subtasks?.map((sub) => (
                <div
                  key={sub.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSubtask(sub.id);
                  }}
                  className="flex items-center gap-2 text-[12px] text-content-secondary hover:text-content-primary cursor-pointer"
                >
                  {sub.isCompleted ? (
                    <CheckCircle weight="fill" className="w-3.5 h-3.5 text-brandSuccess shrink-0" />
                  ) : (
                    <Circle weight="duotone" className="w-3.5 h-3.5 text-content-placeholder shrink-0" />
                  )}
                  <span className={cn(sub.isCompleted && "line-through text-content-placeholder")}>
                    {sub.title}
                  </span>
                </div>
              ))}

              <form onSubmit={handleAddSubtask} className="mt-1">
                <input
                  type="text"
                  placeholder="+ Add step..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="w-full text-[12px] bg-transparent text-content-primary placeholder:text-content-placeholder focus:outline-none"
                />
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
