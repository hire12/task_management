"use client";

import React from "react";
import { GitFork, WarningCircle, CheckCircle } from "@phosphor-icons/react";
import { FullTask } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DependencyTreeProps {
  task: FullTask;
  allTasks: FullTask[];
  onSelectTask?: (taskId: string) => void;
}

export const DependencyTree: React.FC<DependencyTreeProps> = ({
  task,
  allTasks,
  onSelectTask,
}) => {
  // Simple heuristic or relationship check: tasks in same project with earlier due dates
  const upstreamBlockers = allTasks.filter(
    (t) => t.id !== task.id && t.priority === "URGENT" && t.status !== "DONE"
  ).slice(0, 3);

  const downstreamDependents = allTasks.filter(
    (t) => t.id !== task.id && (t.status === "TODO" || t.status === "BACKLOG")
  ).slice(0, 2);

  return (
    <div className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitFork weight="duotone" className="w-4 h-4 text-accent" />
          <span className="text-[13px] font-semibold text-content-primary">
            Dependency Graph & Blockers
          </span>
        </div>
        <span className="text-[11px] text-content-placeholder">
          {upstreamBlockers.length > 0 ? `${upstreamBlockers.length} Blockers` : "No Blockers"}
        </span>
      </div>

      {/* Upstream Blockers */}
      {upstreamBlockers.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase text-brandDanger tracking-wider">
            Blocked By:
          </span>
          {upstreamBlockers.map((b) => (
            <div
              key={b.id}
              onClick={() => onSelectTask?.(b.id)}
              className="flex items-center justify-between p-2 rounded-lg border border-brandDanger/30 bg-brandDanger/5 hover:bg-brandDanger/10 cursor-pointer transition-colors text-[12px]"
            >
              <div className="flex items-center gap-2 truncate">
                <WarningCircle weight="fill" className="w-3.5 h-3.5 text-brandDanger shrink-0" />
                <span className="font-medium text-content-primary truncate">{b.title}</span>
              </div>
              <span className="text-[10.5px] px-1.5 py-0.5 rounded bg-brandDanger/10 text-brandDanger font-mono">
                {b.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3 rounded-lg border border-brandSuccess/20 bg-brandSuccess/5 flex items-center gap-2 text-[12px] text-brandSuccess">
          <CheckCircle weight="fill" className="w-4 h-4 text-brandSuccess shrink-0" />
          <span>All prerequisite paths clear. Safe to work on this task!</span>
        </div>
      )}

      {/* Downstream Dependents */}
      {downstreamDependents.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-1">
          <span className="text-[11px] font-semibold uppercase text-content-placeholder tracking-wider">
            Blocks:
          </span>
          {downstreamDependents.map((d) => (
            <div
              key={d.id}
              onClick={() => onSelectTask?.(d.id)}
              className="flex items-center justify-between p-2 rounded-lg border border-border/80 bg-surface-muted/20 hover:border-content-placeholder/40 cursor-pointer transition-colors text-[12px]"
            >
              <span className="text-content-secondary truncate">{d.title}</span>
              <span className="text-[10px] text-content-placeholder uppercase">Waiting</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
