"use client";

import React from "react";
import Link from "next/link";
import { FolderSimple, TreeStructure, CheckSquareOffset, Calendar } from "@phosphor-icons/react";
import { FullProject } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { D3Sparkline } from "@/components/D3Sparkline";
import { ProgressRing } from "@/components/ProgressRing";
import { formatDate, generateSparklineData } from "@/lib/utils";

interface ProjectCardProps {
  project: FullProject;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const completedTasks = project.tasks?.filter((t) => t.status === "DONE").length || 0;
  const totalTasks = project.tasks?.length || 0;
  const subProjectsCount = project.subProjects?.length || project._count?.subProjects || 0;
  const sparklineData = generateSparklineData(completedTasks, Math.max(5, totalTasks));

  const priorityVariants: Record<string, "neutral" | "warning" | "danger" | "purple"> = {
    LOW: "neutral",
    MEDIUM: "warning",
    HIGH: "danger",
    URGENT: "purple",
  };

  const statusVariants: Record<string, "default" | "success" | "warning" | "neutral"> = {
    DRAFT: "neutral",
    QUEUED: "default",
    IN_PROGRESS: "warning",
    ON_HOLD: "neutral",
    DONE: "success",
    ARCHIVED: "neutral",
  };

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block rounded-xl border border-border bg-surface p-4 shadow-card hover:shadow-raised hover:border-content-placeholder/40 transition-all duration-200"
    >
      <div className="flex flex-col gap-3">
        {/* Top bar: Horizon / Status / Priority */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={statusVariants[project.status] || "default"}>
              {project.status.replace("_", " ")}
            </Badge>
            {project.priority !== "MEDIUM" && (
              <Badge variant={priorityVariants[project.priority] || "neutral"}>
                {project.priority}
              </Badge>
            )}
          </div>

          <ProgressRing
            progress={project.progress}
            size={24}
            strokeWidth={2.5}
            color={project.progress === 100 ? "var(--color-success)" : "var(--color-accent)"}
          />
        </div>

        {/* Project Title & Description */}
        <div>
          <h3 className="text-[15px] font-semibold text-content-primary tracking-tight group-hover:text-accent transition-colors flex items-center gap-2">
            <FolderSimple weight="duotone" className="w-4 h-4 text-accent shrink-0" />
            <span className="line-clamp-1">{project.title}</span>
          </h3>
          {project.description && (
            <p className="text-[13px] text-content-secondary line-clamp-2 mt-1 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* Sparkline & Metrics Footer */}
        <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2 text-[12px] text-content-placeholder">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CheckSquareOffset weight="duotone" className="w-3.5 h-3.5" />
              <span>{completedTasks}/{totalTasks}</span>
            </span>

            {subProjectsCount > 0 && (
              <span className="flex items-center gap-1 text-content-secondary">
                <TreeStructure weight="duotone" className="w-3.5 h-3.5" />
                <span>{subProjectsCount} sub</span>
              </span>
            )}

            {project.targetEndDate && (
              <span className="hidden sm:flex items-center gap-1">
                <Calendar weight="duotone" className="w-3.5 h-3.5" />
                <span>{formatDate(project.targetEndDate)}</span>
              </span>
            )}
          </div>

          <D3Sparkline
            data={sparklineData}
            width={64}
            height={20}
            color={project.progress === 100 ? "var(--color-success)" : "var(--color-accent)"}
          />
        </div>
      </div>
    </Link>
  );
};
