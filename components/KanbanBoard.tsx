"use client";

import React, { useState, useEffect } from "react";
import { Plus, CheckCircle, Clock, Eye, ListChecks } from "@phosphor-icons/react";
import { FullTask } from "@/lib/types";
import { TaskCard } from "@/components/TaskCard";
import { TaskDetailModal } from "@/components/TaskDetailModal";
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
  const [selectedTask, setSelectedTask] = useState<FullTask | null>(null);

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
    setDraggedTaskId(task.id);
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetStatus: TaskStatus) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverColumn(null);

    const taskId =
      e.dataTransfer.getData("text/plain") ||
      (typeof window !== "undefined" && (window as any).__ORBIT_DRAGGED_TASK_ID) ||
      draggedTaskId;

    setDraggedTaskId(null);

    if (!taskId) return;

    const currentTask = tasks.find((t) => t.id === taskId);
    if (!currentTask || currentTask.status === targetStatus) return;

    // 1. Optimistically update local state immediately
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
    );

    // 2. Persist to server
    try {
      await updateTask(taskId, { status: targetStatus });
    } catch (err) {
      console.error("Failed to update task status:", err);
      // Revert on error
      setTasks(initialTasks);
    }
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.error("Failed to update task status:", err);
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
            onDragEnter={(e) => {
              e.preventDefault();
              setDragOverColumn(col.status);
            }}
            onDrop={(e) => handleDrop(e, col.status)}
            className={cn(
              "flex flex-col gap-2.5 rounded-xl border border-border/80 bg-surface-muted/30 p-3.5 min-h-[380px] transition-all duration-200",
              isHovered && "border-accent bg-accent-subtle/25 ring-2 ring-accent/30 shadow-raised"
            )}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-1 py-0.5">
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

            {/* Visual Drop Zone Indicator */}
            {isHovered && (
              <div
                onDragOver={(e) => handleDragOver(e, col.status)}
                onDrop={(e) => handleDrop(e, col.status)}
                className="rounded-lg border-2 border-dashed border-accent py-3.5 text-center text-[12.5px] font-medium text-accent bg-accent/10 animate-fade-in"
              >
                Drop task in {col.title}
              </div>
            )}

            {/* Tasks List */}
            <div
              onDragOver={(e) => handleDragOver(e, col.status)}
              onDrop={(e) => handleDrop(e, col.status)}
              className="flex flex-col gap-2.5 flex-1 min-h-[200px]"
            >
              {colTasks.length === 0 && !isHovered ? (
                <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-[12.5px] text-content-placeholder my-auto">
                  No tasks in {col.title}
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onStatusChange={handleTaskStatusChange}
                    onClick={(t) => setSelectedTask(t)}
                    isDragging={draggedTaskId === task.id}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}

      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onTaskUpdated={(updatedTask) => {
          setTasks((prev) =>
            prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
          );
          setSelectedTask(updatedTask);
        }}
      />
    </div>
  );
};
