"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  Circle,
  Calendar,
  Clock,
  Trash,
  DotsSixVertical,
  ArrowRight,
  Paperclip,
  Star,
} from "@phosphor-icons/react";
import { FullTask } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { CardCover } from "@/components/CardCover";
import { toggleTaskStatus, deleteTask, toggleSubtask, addSubtask, updateTask } from "@/app/actions/tasks";
import { toggleTaskCover } from "@/app/actions/attachments";
import { formatRelativeDate, cn } from "@/lib/utils";
import { TaskStatus } from "@prisma/client";

interface TaskCardProps {
  task: FullTask;
  showProjectName?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, task: FullTask) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onClick?: (task: FullTask) => void;
  isDragging?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  showProjectName = false,
  onDragStart,
  onDragEnd,
  onStatusChange,
  onClick,
  isDragging = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
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

  const handleQuickMove = async (e: React.MouseEvent, nextStatus: TaskStatus) => {
    e.stopPropagation();
    setShowStatusPicker(false);
    if (onStatusChange) {
      onStatusChange(task.id, nextStatus);
    } else {
      await updateTask(task.id, { status: nextStatus });
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

  const completedSubtasks = task.subtasks?.filter((s) => s.isDone).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  const nextStatuses: Record<TaskStatus, { status: TaskStatus; label: string }[]> = {
    BACKLOG: [
      { status: TaskStatus.TODO, label: "To Do" },
      { status: TaskStatus.IN_PROGRESS, label: "In Progress" },
    ],
    TODO: [
      { status: TaskStatus.IN_PROGRESS, label: "In Progress" },
      { status: TaskStatus.DONE, label: "Done" },
    ],
    IN_PROGRESS: [
      { status: TaskStatus.REVIEW, label: "Review" },
      { status: TaskStatus.DONE, label: "Done" },
      { status: TaskStatus.TODO, label: "To Do" },
    ],
    REVIEW: [
      { status: TaskStatus.DONE, label: "Done" },
      { status: TaskStatus.IN_PROGRESS, label: "In Progress" },
    ],
    DONE: [
      { status: TaskStatus.TODO, label: "Re-open" },
    ],
  };

  const coverAttachment = task.attachments?.find((a) => a.isCover);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id);
        e.dataTransfer.effectAllowed = "move";
        if (typeof window !== "undefined") {
          (window as any).__ORBIT_DRAGGED_TASK_ID = task.id;
        }
        onDragStart?.(e, task);
      }}
      onDragEnd={(e) => {
        if (typeof window !== "undefined") {
          delete (window as any).__ORBIT_DRAGGED_TASK_ID;
        }
        onDragEnd?.(e);
      }}
      onClick={() => onClick?.(task)}
      className={cn(
        "group relative rounded-xl border border-border/80 bg-surface p-3.5 transition-all duration-200 hover:border-content-placeholder/50 hover:shadow-card cursor-pointer select-none overflow-hidden",
        isDone && "bg-surface-muted/30 opacity-70 border-border/40",
        isDragging && "opacity-30 scale-[0.97] border-dashed border-accent shadow-raised"
      )}
    >
      {/* Optional Card Cover Banner */}
      {coverAttachment && (
        <CardCover
          url={coverAttachment.url}
          alt={`Cover preview for task: ${task.title}`}
          aspectRatio="wide"
          className="-mx-3.5 -mt-3.5 mb-3 w-[calc(100%+28px)] rounded-t-[11px] border-b border-border/60"
        />
      )}

      <div className="flex items-start gap-2.5">
        {/* Drag Grip Handle */}
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

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowStatusPicker(!showStatusPicker);
                }}
                title="Move Task Status"
                className="text-content-placeholder hover:text-content-primary p-0.5 rounded hover:bg-surface-muted transition-colors cursor-pointer"
              >
                <ArrowRight weight="bold" className="w-3 h-3" />
              </button>

              {task.attachments && task.attachments.length > 0 && (
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    const targetAtt = coverAttachment || task.attachments![0];
                    if (targetAtt) {
                      await toggleTaskCover(targetAtt.id, task.id);
                    }
                  }}
                  title={coverAttachment ? "Remove card cover" : "Set image as cover"}
                  className={cn(
                    "text-content-placeholder hover:text-brandWarning p-0.5 rounded hover:bg-surface-muted transition-colors cursor-pointer",
                    coverAttachment && "text-brandWarning"
                  )}
                >
                  <Star weight={coverAttachment ? "fill" : "duotone"} className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={handleDelete}
                title="Delete Task"
                className="text-content-placeholder hover:text-brandDanger p-0.5 rounded hover:bg-surface-muted transition-colors cursor-pointer"
              >
                <Trash weight="duotone" className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Move Status Popover */}
          {showStatusPicker && (
            <div className="mt-2 p-1.5 rounded-lg border border-border bg-surface-elevated shadow-modal flex items-center gap-1.5 flex-wrap z-10 animate-fade-in">
              <span className="text-[10.5px] font-semibold text-content-placeholder uppercase px-1">
                Move to:
              </span>
              {nextStatuses[task.status]?.map((item) => (
                <button
                  key={item.status}
                  onClick={(e) => handleQuickMove(e, item.status)}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface text-content-primary border border-border/80 hover:bg-accent hover:text-white transition-colors cursor-pointer shadow-xs"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

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

            {task.duration && (
              <span className="flex items-center gap-1">
                <Clock weight="duotone" className="w-3 h-3" />
                <span>{task.duration}m</span>
              </span>
            )}

            {task.attachments && task.attachments.length > 0 && (
              <span className="flex items-center gap-1 text-content-secondary" title={`${task.attachments.length} attachment(s)`}>
                <Paperclip weight="bold" className="w-3 h-3 text-accent" />
                <span>{task.attachments.length}</span>
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
                  {sub.isDone ? (
                    <CheckCircle weight="fill" className="w-3.5 h-3.5 text-brandSuccess shrink-0" />
                  ) : (
                    <Circle weight="duotone" className="w-3.5 h-3.5 text-content-placeholder shrink-0" />
                  )}
                  <span className={cn(sub.isDone && "line-through text-content-placeholder")}>
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
