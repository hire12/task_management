"use client";

import React, { useState } from "react";
import { FullTask } from "@/lib/types";
import { TaskCard } from "@/components/TaskCard";
import { TaskDetailModal } from "@/components/TaskDetailModal";
import { WarningCircle, Clock, CheckCircle } from "@phosphor-icons/react";

interface TodayHUDProps {
  tasks: FullTask[];
}

export const TodayHUD: React.FC<TodayHUDProps> = ({ tasks: initialTasks }) => {
  const [tasks, setTasks] = useState<FullTask[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<FullTask | null>(null);

  // 1. All tasks currently actively in flight (IN_PROGRESS or REVIEW)
  const inProgressTasks = tasks.filter(
    (t) => t.status === "IN_PROGRESS" || t.status === "REVIEW"
  );

  // 2. High priority, urgent, or overdue tasks ready in queue (TODO / BACKLOG)
  const urgentTasks = tasks.filter(
    (t) =>
      t.status !== "DONE" &&
      t.status !== "IN_PROGRESS" &&
      t.status !== "REVIEW" &&
      (t.priority === "HIGH" || t.priority === "URGENT" || (t.dueDate && new Date(t.dueDate) < new Date()))
  );

  // 3. Normal queued backlog tasks (TODO / BACKLOG with MEDIUM or LOW priority)
  const remainingTasks = tasks.filter(
    (t) =>
      t.status !== "DONE" &&
      t.status !== "IN_PROGRESS" &&
      t.status !== "REVIEW" &&
      t.priority !== "HIGH" &&
      t.priority !== "URGENT" &&
      (!t.dueDate || new Date(t.dueDate) >= new Date())
  );

  // 4. Completed tasks
  const completedTasks = tasks.filter((t) => t.status === "DONE");

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Urgent / High Priority Focus */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <WarningCircle weight="duotone" className="w-4 h-4 text-brandDanger" />
              <h2 className="text-[14px] font-semibold text-content-primary tracking-tight">
                High Priority & Urgent
              </h2>
            </div>
            <span className="text-[11px] font-mono rounded bg-surface px-1.5 py-0.5 text-content-placeholder border border-border">
              {urgentTasks.length}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {urgentTasks.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/70 p-4 text-center text-[12.5px] text-content-placeholder">
                No urgent tasks pending
              </div>
            ) : (
              urgentTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  showProjectName
                  onClick={(task) => setSelectedTask(task)}
                />
              ))
            )}
          </div>
        </div>

        {/* Active In Progress */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Clock weight="duotone" className="w-4 h-4 text-brandWarning" />
              <h2 className="text-[14px] font-semibold text-content-primary tracking-tight">
                In Progress (Active)
              </h2>
            </div>
            <span className="text-[11px] font-mono rounded bg-surface px-1.5 py-0.5 text-content-placeholder border border-border">
              {inProgressTasks.length}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {inProgressTasks.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/70 p-4 text-center text-[12.5px] text-content-placeholder">
                No active tasks in progress
              </div>
            ) : (
              inProgressTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  showProjectName
                  onClick={(task) => setSelectedTask(task)}
                />
              ))
            )}
          </div>
        </div>

        {/* Queue & Completed */}
        <div className="flex flex-col gap-5">
          {/* Queue */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-content-primary tracking-tight">
                  Next in Queue
                </span>
              </div>
              <span className="text-[11px] font-mono rounded bg-surface px-1.5 py-0.5 text-content-placeholder border border-border">
                {remainingTasks.length}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {remainingTasks.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border/70 p-4 text-center text-[12.5px] text-content-placeholder">
                  All queued tasks cleared
                </div>
              ) : (
                remainingTasks.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    showProjectName
                    onClick={(task) => setSelectedTask(task)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Completed Today */}
          {completedTasks.length > 0 && (
            <div className="flex flex-col gap-3 pt-4 border-t border-border/60">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <CheckCircle weight="duotone" className="w-4 h-4 text-brandSuccess" />
                  <span className="text-[14px] font-semibold text-content-secondary tracking-tight">
                    Completed Today
                  </span>
                </div>
                <span className="text-[11px] font-mono rounded bg-surface px-1.5 py-0.5 text-content-placeholder border border-border">
                  {completedTasks.length}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {completedTasks.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    showProjectName
                    onClick={(task) => setSelectedTask(task)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

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
    </>
  );
};
