"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderSimple,
  TreeStructure,
  Kanban,
  Article,
  Plus,
  Trash,
  CaretRight,
  Calendar,
  ShareNetwork,
} from "@phosphor-icons/react";
import { FullProject } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ProgressRing";
import { KanbanBoard } from "@/components/KanbanBoard";
import { ProjectBanner } from "@/components/ProjectBanner";
import { ProjectDocsEditor } from "@/components/ProjectDocsEditor";
import { ProjectCard } from "@/components/ProjectCard";
import { NewProjectModal } from "@/components/NewProjectModal";
import { NewTaskModal } from "@/components/NewTaskModal";
import { updateProject, deleteProject } from "@/app/actions/projects";
import { toggleProjectPublicAction } from "@/app/actions/workspace";
import { ShareProjectModal } from "@/components/auth/ShareProjectModal";
import { formatDate } from "@/lib/utils";
import { ProjectStatus, TemporalHorizon, TaskStatus } from "@prisma/client";

interface ProjectViewProps {
  project: FullProject;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ project }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"kanban" | "subprojects" | "docs">("kanban");
  const [isNewSubProjectOpen, setIsNewSubProjectOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [deleting, setDeleting] = useState(false);

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    await updateProject(project.id, { status: newStatus });
  };

  const handleHorizonChange = async (newHorizon: TemporalHorizon) => {
    await updateProject(project.id, { temporalHorizon: newHorizon });
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project and its sub-projects?")) {
      setDeleting(true);
      await deleteProject(project.id);
      router.push("/");
    }
  };

  const handleOpenNewTaskWithStatus = (status?: TaskStatus) => {
    if (status) setDefaultTaskStatus(status);
    setIsNewTaskOpen(true);
  };

  const tasks = project.tasks || [];
  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-canvas overflow-y-auto">
      {/* Banner */}
      <ProjectBanner
        projectId={project.id}
        bannerUrl={project.bannerUrl}
      />

      {/* Main Header / Meta */}
      <div className="px-8 pt-6 pb-4 border-b border-border/60 bg-surface/50 backdrop-blur-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-card border border-border/80"
            style={{ backgroundColor: `${project.color}15` }}
          >
            <FolderSimple
              weight="duotone"
              className="w-6 h-6"
              style={{ color: project.color }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            {/* Breadcrumb Hierarchy */}
            <div className="flex items-center gap-1.5 text-[12px] text-content-placeholder">
              <Link href="/" className="hover:text-content-primary transition-colors">
                Workspace
              </Link>
              {project.parent && (
                <>
                  <CaretRight weight="bold" className="w-3 h-3" />
                  <Link
                    href={`/projects/${project.parent.id}`}
                    className="hover:text-content-primary transition-colors"
                  >
                    {project.parent.title}
                  </Link>
                </>
              )}
              <CaretRight weight="bold" className="w-3 h-3" />
              <span className="text-content-primary font-medium">{project.title}</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold font-display text-content-primary tracking-tight">
                {project.title}
              </h1>

              {/* Status Selector */}
              <select
                value={project.status}
                onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
                className="text-[11.5px] font-semibold px-2 py-0.5 rounded-full border border-border bg-surface text-content-primary focus:outline-none focus:border-accent cursor-pointer shadow-2xs"
              >
                <option value="DRAFT">Draft</option>
                <option value="QUEUED">Queued</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="DONE">Completed</option>
                <option value="ARCHIVED">Archived</option>
              </select>

              {/* Horizon Selector */}
              <select
                value={project.temporalHorizon}
                onChange={(e) => handleHorizonChange(e.target.value as TemporalHorizon)}
                className="text-[11.5px] font-semibold px-2 py-0.5 rounded-full border border-border bg-surface text-content-secondary focus:outline-none focus:border-accent cursor-pointer shadow-2xs"
              >
                <option value="ACTIVE">⚡ Active Sprint</option>
                <option value="FUTURE">📅 Future Quarter</option>
                <option value="IDEA">💡 Idea / Concept</option>
                <option value="SHIPPED">🚀 Shipped</option>
              </select>
            </div>

            {project.description && (
              <p className="text-[13px] text-content-secondary max-w-2xl leading-relaxed">
                {project.description}
              </p>
            )}

            {project.targetDate && (
              <div className="flex items-center gap-1.5 text-[11.5px] text-content-placeholder mt-0.5">
                <Calendar weight="duotone" className="w-3.5 h-3.5 text-accent" />
                <span>Target: {formatDate(project.targetDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Share with Client / Guest Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-semibold text-content-primary hover:bg-surface-raised transition-colors shadow-2xs cursor-pointer"
          >
            <ShareNetwork weight="duotone" className="w-4 h-4 text-accent" />
            <span>Share & Guest View</span>
          </button>

          {/* Progress Ring */}
          <div className="flex items-center gap-2.5 bg-surface rounded-xl border border-border px-3 py-1.5 shadow-card">
            <ProgressRing
              progress={progressPercent}
              size={28}
              strokeWidth={3}
              color={progressPercent === 100 ? "var(--color-success)" : "var(--color-accent)"}
            />
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] text-content-placeholder font-medium">Sprint</span>
              <span className="text-xs font-bold text-content-primary font-mono">
                {progressPercent}%
              </span>
            </div>
          </div>

          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Delete Project"
            className="p-2 rounded-xl border border-border bg-surface text-content-placeholder hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
          >
            <Trash weight="duotone" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center justify-between border-b border-border/80 px-8 bg-surface/30">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("kanban")}
            className={`flex items-center gap-2 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "kanban"
                ? "border-accent text-accent"
                : "border-transparent text-content-secondary hover:text-content-primary"
            }`}
          >
            <Kanban weight="duotone" className="w-4 h-4" />
            <span>Board ({tasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("subprojects")}
            className={`flex items-center gap-2 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "subprojects"
                ? "border-accent text-accent"
                : "border-transparent text-content-secondary hover:text-content-primary"
            }`}
          >
            <TreeStructure weight="duotone" className="w-4 h-4" />
            <span>Sub-Projects ({project.subProjects?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("docs")}
            className={`flex items-center gap-2 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "docs"
                ? "border-accent text-accent"
                : "border-transparent text-content-secondary hover:text-content-primary"
            }`}
          >
            <Article weight="duotone" className="w-4 h-4" />
            <span>Specs & Notes</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "kanban" && (
            <Button
              size="sm"
              onClick={() => handleOpenNewTaskWithStatus(TaskStatus.TODO)}
              className="gap-1.5 text-xs"
            >
              <Plus weight="bold" className="w-3.5 h-3.5" />
              <span>New Task</span>
            </Button>
          )}

          {activeTab === "subprojects" && (
            <Button
              size="sm"
              onClick={() => setIsNewSubProjectOpen(true)}
              className="gap-1.5 text-xs"
            >
              <Plus weight="bold" className="w-3.5 h-3.5" />
              <span>New Sub-Project</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 p-8">
        {activeTab === "kanban" && (
          <KanbanBoard
            tasks={tasks as any}
            onOpenNewTask={handleOpenNewTaskWithStatus}
          />
        )}

        {activeTab === "subprojects" && (
          <div className="flex flex-col gap-4">
            {(!project.subProjects || project.subProjects.length === 0) ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-surface/40 flex flex-col items-center gap-3">
                <TreeStructure weight="duotone" className="w-8 h-8 text-content-placeholder" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-content-primary">No sub-projects yet</span>
                  <span className="text-xs text-content-secondary">Break this initiative down into smaller milestones</span>
                </div>
                <Button size="sm" onClick={() => setIsNewSubProjectOpen(true)}>
                  Create First Sub-Project
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {project.subProjects.map((sub: any) => (
                  <ProjectCard key={sub.id} project={sub} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "docs" && (
          <ProjectDocsEditor
            projectId={project.id}
            initialTitle={project.docs?.[0]?.title}
            initialContent={project.docs?.[0]?.content}
          />
        )}
      </div>

      {/* Sub Project Modal */}
      <NewProjectModal
        isOpen={isNewSubProjectOpen}
        onClose={() => setIsNewSubProjectOpen(false)}
        workspaceId={project.workspaceId}
        defaultParentId={project.id}
      />

      {/* Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        projects={[project]}
        defaultProjectId={project.id}
        defaultStatus={defaultTaskStatus}
      />

      {/* Share with Client Modal */}
      <ShareProjectModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        projectTitle={project.title}
        projectId={project.id}
        isPublic={project.isPublic}
        shareToken={project.shareToken}
        onTogglePublic={(isPub) => toggleProjectPublicAction(project.id, isPub) as any}
      />
    </div>
  );
};
