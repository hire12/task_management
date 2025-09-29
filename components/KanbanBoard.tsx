"use client";

import React, { useState, useEffect } from "react";
import { Plus, CheckCircle, Clock, Eye, ListChecks } from "@phosphor-icons/react";
import { FullTask } from "@/lib/types";
import { TaskCard } from "@/components/TaskCard";
import { updateTask } from "@/app/actions/tasks";
import { TaskStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

interface KanbanBoardProps {
  tasks: FullTask[];
  onOpenNewTask: (status?: TaskStatus) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks: initialTasks,
  onOpenNewTask,
}) => {
  const [tasks, setTasks] = useState<FullTask[]>(initialTasks);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const columns: { status: TaskStatus; title: string; icon: any; colorClass: string }[] = [
    { status: TaskStatus.TODO, title: "To Do", icon: ListChecks, colorClass: "text-content-secondary" },
    { status: TaskStatus.IN_PROGRESS, title: "In Progress", icon: Clock, colorClass: "text-brandWarning" },
    { status: TaskStatus.REVIEW, title: "In Review", icon: Eye, colorClass: "text-brandPurple" },
    { status: TaskStatus.DONE, title: "Done", icon: CheckCircle, colorClass: "text-brandSuccess" },
  ];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: FullTask) => {
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
    setDraggedTaskId(task.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    // Only clear if leaving the column itself
    const rect = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX >= rect.right ||
      e.clientY < rect.top ||
      e.clientY >= rect.bottom
    ) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    setDraggedTaskId(null);

    if (!taskId) return;

    const currentTask = tasks.find((t) => t.id === taskId);
    if (!currentTask || currentTask.status === targetStatus) return;

    // Optimistic local state update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
    );

    try {
      await updateTask(taskId, { status: targetStatus });
    } catch (err) {
      console.error("Failed to update task status:", err);
      // Revert on failure
      setTasks(initialTasks);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start select-none">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);
        const isHovered = dragOverColumn === col.status;
        const Icon = col.icon;

        return (
          <div
            key={col.status}
            onDragOver={(e) => handleDragOver(e, col.status)}
            onDragLeave={(e) => handleDragLeave(e, col.status)}
            onDrop={(e) => handleDrop(e, col.status)}
            className={cn(
              "flex flex-col gap-2 rounded-xl border border-border/70 bg-surface-muted/30 p-3 min-h-[360px] transition-all duration-200",
              isHovered && "border-accent bg-accent-subtle/30 ring-2 ring-accent/20 shadow-raised"
            )}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-1.5 py-1">
              <div className="flex items-center gap-2">
                <Icon weight="duotone" className={cn("w-4 h-4", col.colorClass)} />
                <span className="text-[13.5px] font-semibold text-content-primary tracking-tight">
                  {col.title}
                </span>
                <span className="text-[11px] font-mono rounded bg-surface px-1.5 py-0.5 text-content-placeholder border border-border/60">
                  {colTasks.length}
                </span>
              </div>

              <button
                onClick={() => onOpenNewTask(col.status)}
                className="p-1 rounded text-content-placeholder hover:text-content-primary hover:bg-surface transition-colors cursor-pointer"
                title={`Add task to ${col.title}`}
              >
                <Plus weight="bold" className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Drop Zone Placeholder Indicator */}
            {isHovered && (
              <div className="rounded-lg border border-dashed border-accent py-3 text-center text-[12px] font-medium text-accent bg-accent/5 animate-pulse">
                Drop task here
              </div>
            )}

            {/* Task Cards List */}
            <div className="flex flex-col gap-2.5 pt-1">
              {colTasks.length === 0 && !isHovered ? (
                <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-[12.5px] text-content-placeholder">
                  No tasks
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDragStart={handleDragStart}
                    isDragging={draggedTaskId === task.id}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
