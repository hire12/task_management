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

  const subProjects = project.subProjects || [];
  const tasks = project.tasks || [];
  const doc = project.docs?.[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-[12.5px] text-content-placeholder">
        <Link href="/" className="hover:text-content-primary transition-colors">
          Projects
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

      {/* Cinematic Project Banner */}
      <ProjectBanner projectId={project.id} bannerUrl={project.bannerUrl} />

      {/* Main Project Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/70 pb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-surface border border-border text-accent shadow-card mt-1">
            <FolderSimple weight="duotone" className="w-7 h-7" />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-[22px] font-bold text-content-primary tracking-tight">
                {project.title}
              </h1>

              {/* Status Selector */}
              <select
                value={project.status}
                onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
                className="rounded-md border border-border bg-surface px-2.5 py-0.5 text-[12px] font-medium text-content-primary focus:outline-none focus:border-accent cursor-pointer shadow-xs"
              >
                <option value="DRAFT">Draft</option>
                <option value="QUEUED">Queued</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="DONE">Done / Shipped</option>
                <option value="ARCHIVED">Archived</option>
              </select>

              {/* Horizon Selector */}
              <select
                value={project.temporalHorizon}
                onChange={(e) => handleHorizonChange(e.target.value as TemporalHorizon)}
                className="rounded-md border border-border bg-surface px-2.5 py-0.5 text-[12px] font-medium text-content-secondary focus:outline-none focus:border-accent cursor-pointer shadow-xs"
              >
                <option value="ACTIVE">⚡ Active (Now)</option>
                <option value="FUTURE">📅 Pipeline (Next)</option>
                <option value="IDEA">💡 Incubator (Someday)</option>
                <option value="SHIPPED">🏆 Shipped</option>
              </select>
            </div>

            {project.description && (
              <p className="text-[13.5px] text-content-secondary max-w-2xl leading-relaxed">
                {project.description}
              </p>
            )}

            {project.targetEndDate && (
              <div className="flex items-center gap-2 text-[12px] text-content-placeholder mt-0.5">
                <Calendar weight="duotone" className="w-3.5 h-3.5" />
                <span>Target Deadline: {formatDate(project.targetEndDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Header Right Actions & Progress */}
        <div className="flex items-center gap-4 self-start md:self-auto">
          <div className="flex items-center gap-3 bg-surface rounded-xl border border-border px-3.5 py-2 shadow-card">
            <ProgressRing
              progress={project.progress}
              size={32}
              strokeWidth={3}
              color={project.progress === 100 ? "var(--color-success)" : "var(--color-accent)"}
            />
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-content-placeholder">
                Rollup Health
              </span>
              <span className="text-[14px] font-bold text-content-primary font-mono">
                {project.progress}% Done
              </span>
            </div>
          </div>

          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Delete Project"
            className="p-2 rounded-md border border-border bg-surface text-content-placeholder hover:text-brandDanger hover:bg-surface-muted transition-colors cursor-pointer"
          >
            <Trash weight="duotone" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs & Tab Actions */}
      <div className="flex items-center justify-between gap-4 border-b border-border/60">
        <div className="flex items-center gap-1 -mb-px">
          <button
            onClick={() => setActiveTab("kanban")}
            className={`flex items-center gap-2 px-3.5 py-2 text-[13.5px] font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === "kanban"
                ? "border-accent text-content-primary font-semibold"
                : "border-transparent text-content-secondary hover:text-content-primary"
            }`}
          >
            <Kanban weight="duotone" className="w-4 h-4" />
            <span>Tasks ({tasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("subprojects")}
            className={`flex items-center gap-2 px-3.5 py-2 text-[13.5px] font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === "subprojects"
                ? "border-accent text-content-primary font-semibold"
                : "border-transparent text-content-secondary hover:text-content-primary"
            }`}
          >
            <TreeStructure weight="duotone" className="w-4 h-4" />
            <span>Sub-Projects ({subProjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("docs")}
            className={`flex items-center gap-2 px-3.5 py-2 text-[13.5px] font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === "docs"
                ? "border-accent text-content-primary font-semibold"
                : "border-transparent text-content-secondary hover:text-content-primary"
            }`}
          >
            <Article weight="duotone" className="w-4 h-4" />
            <span>Architecture & Specs</span>
          </button>
        </div>

        {/* Tab-specific action button */}
        {activeTab === "kanban" && (
          <Button
            size="sm"
            onClick={() => handleOpenNewTaskWithStatus(TaskStatus.TODO)}
            className="gap-1 text-[12.5px]"
          >
            <Plus weight="bold" className="w-3 h-3" />
            <span>Add Task</span>
          </Button>
        )}

        {activeTab === "subprojects" && (
          <Button
            size="sm"
            onClick={() => setIsNewSubProjectOpen(true)}
            className="gap-1 text-[12.5px]"
          >
            <Plus weight="bold" className="w-3 h-3" />
            <span>New Sub-Project</span>
          </Button>
        )}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === "kanban" && (
          <KanbanBoard
            tasks={tasks as any}
            onOpenNewTask={handleOpenNewTaskWithStatus}
          />
        )}

        {activeTab === "subprojects" && (
          <div className="flex flex-col gap-4">
            {subProjects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-10 text-center flex flex-col items-center justify-center gap-3">
                <div className="p-3 rounded-full bg-surface-muted text-content-placeholder">
                  <TreeStructure weight="duotone" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-content-primary">
                    No sub-projects added yet
                  </p>
                  <p className="text-[12.5px] text-content-secondary mt-0.5">
                    Break this master initiative into modular streams or subsystems.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsNewSubProjectOpen(true)}
                  className="mt-2 gap-1 text-[12.5px]"
                >
                  <Plus weight="bold" className="w-3 h-3" />
                  <span>Create Sub-Project</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subProjects.map((sub: any) => (
                  <ProjectCard key={sub.id} project={sub} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "docs" && (
          <ProjectDocsEditor
            projectId={project.id}
            initialTitle={doc?.title}
            initialContent={doc?.content}
          />
        )}
      </div>

      {/* Modals */}
      <NewProjectModal
        isOpen={isNewSubProjectOpen}
        onClose={() => setIsNewSubProjectOpen(false)}
        workspaceId={project.workspaceId}
        defaultParentId={project.id}
        defaultHorizon={project.temporalHorizon}
      />

      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        projects={[{ id: project.id, title: project.title, parentId: project.parentId }]}
        defaultProjectId={project.id}
        defaultStatus={defaultTaskStatus}
      />
    </div>
  );
};
