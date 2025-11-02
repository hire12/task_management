"use client";

import React, { useState } from "react";
import { Funnel, DownloadSimple, X, Check, Image as ImageIcon } from "@phosphor-icons/react";
import { FullTask, PriorityLevel, TaskStatus } from "@/lib/types";
import { exportTasksToCSV, exportTasksToJSON } from "@/lib/exportTasks";
import { cn } from "@/lib/utils";

interface TaskFiltersProps {
  tasks: FullTask[];
  onFiltered: (filtered: FullTask[]) => void;
  className?: string;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  tasks,
  onFiltered,
  className,
}) => {
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | "ALL">("ALL");
  const [onlyWithAttachments, setOnlyWithAttachments] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const applyFilters = (
    priority = selectedPriority,
    status = selectedStatus,
    withAttach = onlyWithAttachments
  ) => {
    let result = [...tasks];
    if (priority !== "ALL") {
      result = result.filter((t) => t.priority === priority);
    }
    if (status !== "ALL") {
      result = result.filter((t) => t.status === status);
    }
    if (withAttach) {
      result = result.filter((t) => t.attachments && t.attachments.length > 0);
    }
    onFiltered(result);
  };

  const handlePriorityChange = (p: PriorityLevel | "ALL") => {
    setSelectedPriority(p);
    applyFilters(p, selectedStatus, onlyWithAttachments);
  };

  const handleStatusChange = (s: TaskStatus | "ALL") => {
    setSelectedStatus(s);
    applyFilters(selectedPriority, s, onlyWithAttachments);
  };

  const handleToggleAttachments = () => {
    const next = !onlyWithAttachments;
    setOnlyWithAttachments(next);
    applyFilters(selectedPriority, selectedStatus, next);
  };

  const handleReset = () => {
    setSelectedPriority("ALL");
    setSelectedStatus("ALL");
    setOnlyWithAttachments(false);
    onFiltered(tasks);
  };

  const isFiltered = selectedPriority !== "ALL" || selectedStatus !== "ALL" || onlyWithAttachments;

  return (
    <div className={cn("flex items-center gap-2 flex-wrap text-[12px]", className)}>
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-border bg-surface text-content-secondary">
        <Funnel weight="bold" className="w-3.5 h-3.5 text-accent" />
        <span className="font-medium text-content-primary">Filter:</span>
      </div>

      {/* Priority Selector */}
      <select
        value={selectedPriority}
        onChange={(e) => handlePriorityChange(e.target.value as any)}
        className="px-2.5 py-1 rounded-lg border border-border bg-surface text-content-primary focus:outline-none focus:border-accent cursor-pointer shadow-2xs"
      >
        <option value="ALL">All Priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>

      {/* Status Selector */}
      <select
        value={selectedStatus}
        onChange={(e) => handleStatusChange(e.target.value as any)}
        className="px-2.5 py-1 rounded-lg border border-border bg-surface text-content-primary focus:outline-none focus:border-accent cursor-pointer shadow-2xs"
      >
        <option value="ALL">All Stages</option>
        <option value="BACKLOG">Backlog</option>
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="REVIEW">Review</option>
        <option value="DONE">Done</option>
      </select>

      {/* With Attachments Chip */}
      <button
        onClick={handleToggleAttachments}
        className={cn(
          "px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs",
          onlyWithAttachments
            ? "border-accent bg-accent/10 text-accent font-medium"
            : "border-border bg-surface text-content-secondary hover:text-content-primary"
        )}
      >
        <ImageIcon weight="bold" className="w-3.5 h-3.5" />
        <span>With Images</span>
      </button>

      {/* Reset */}
      {isFiltered && (
        <button
          onClick={handleReset}
          className="p-1 rounded-lg text-content-placeholder hover:text-content-primary hover:bg-surface-muted transition-colors cursor-pointer"
          title="Reset filters"
        >
          <X weight="bold" className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Export Button */}
      <div className="relative ml-auto">
        <button
          onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
          className="px-2.5 py-1 rounded-lg border border-border bg-surface text-content-secondary hover:text-content-primary hover:bg-surface-muted transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <DownloadSimple weight="bold" className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        {isExportMenuOpen && (
          <div className="absolute right-0 top-full mt-1.5 w-36 rounded-xl border border-border bg-surface shadow-modal py-1 z-20 animate-fade-in">
            <button
              onClick={() => {
                exportTasksToCSV(tasks);
                setIsExportMenuOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-[12px] text-content-primary hover:bg-surface-muted transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>Export as CSV</span>
            </button>
            <button
              onClick={() => {
                exportTasksToJSON(tasks);
                setIsExportMenuOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-[12px] text-content-primary hover:bg-surface-muted transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>Export as JSON</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
