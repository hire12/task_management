"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { TemporalHorizon, ProjectStatus, PriorityLevel } from "@prisma/client";

export async function getWorkspaces() {
  let workspaces = await db.workspace.findMany({
    orderBy: { createdAt: "asc" },
  });

  if (workspaces.length === 0) {
    const defaultWorkspace = await db.workspace.create({
      data: {
        name: "Main Space",
        slug: "main",
        icon: "Planet",
        color: "#4F6B58",
      },
    });
    workspaces = [defaultWorkspace];
  }

  return workspaces;
}

export async function getProjects(workspaceId?: string, horizon?: TemporalHorizon) {
  const where: any = {};
  if (workspaceId) where.workspaceId = workspaceId;
  if (horizon) where.temporalHorizon = horizon;

  return db.project.findMany({
    where,
    include: {
      parent: true,
      subProjects: {
        include: {
          tasks: true,
          _count: { select: { tasks: true, subProjects: true } },
        },
      },
      tasks: {
        include: { subtasks: true, attachments: true },
        orderBy: { orderIndex: "asc" },
      },
      _count: {
        select: { tasks: true, subProjects: true },
      },
    },
    orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
  });
}

export async function getProjectById(id: string) {
  return db.project.findUnique({
    where: { id },
    include: {
      workspace: true,
      parent: {
        include: {
          parent: true,
        },
      },
      subProjects: {
        include: {
          tasks: true,
          subProjects: true,
          _count: { select: { tasks: true, subProjects: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      tasks: {
        include: { subtasks: true, attachments: true },
        orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
      },
      docs: {
        orderBy: { updatedAt: "desc" },
      },
      activityLogs: {
        take: 10,
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { tasks: true, subProjects: true },
      },
    },
  });
}

export async function createProject(formData: {
  workspaceId: string;
  parentId?: string | null;
  title: string;
  description?: string;
  temporalHorizon?: TemporalHorizon;
  status?: ProjectStatus;
  priority?: PriorityLevel;
  targetStartDate?: Date | string | null;
  targetEndDate?: Date | string | null;
  tags?: string[];
}) {
  const project = await db.project.create({
    data: {
      workspaceId: formData.workspaceId,
      parentId: formData.parentId || null,
      title: formData.title,
      description: formData.description,
      temporalHorizon: formData.temporalHorizon || TemporalHorizon.ACTIVE,
      status: formData.status || ProjectStatus.IN_PROGRESS,
      priority: formData.priority || PriorityLevel.MEDIUM,
      targetStartDate: formData.targetStartDate ? new Date(formData.targetStartDate) : null,
      targetEndDate: formData.targetEndDate ? new Date(formData.targetEndDate) : null,
      tags: formData.tags || [],
      progress: 0,
    },
  });

  // Log activity
  await db.activityLog.create({
    data: {
      projectId: project.id,
      action: "PROJECT_CREATED",
      details: { title: project.title, horizon: project.temporalHorizon },
    },
  });

  if (formData.parentId) {
    revalidatePath(`/projects/${formData.parentId}`);
  }
  revalidatePath("/");
  revalidatePath("/today");
  return project;
}

export async function updateProject(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    temporalHorizon: TemporalHorizon;
    status: ProjectStatus;
    priority: PriorityLevel;
    progress: number;
    targetStartDate: Date | string | null;
    targetEndDate: Date | string | null;
    tags: string[];
    pinnedLinks: any;
  }>
) {
  const updateData: any = { ...data };
  if (data.targetStartDate !== undefined) {
    updateData.targetStartDate = data.targetStartDate ? new Date(data.targetStartDate) : null;
  }
  if (data.targetEndDate !== undefined) {
    updateData.targetEndDate = data.targetEndDate ? new Date(data.targetEndDate) : null;
  }

  const project = await db.project.update({
    where: { id },
    data: updateData,
  });

  revalidatePath(`/projects/${id}`);
  if (project.parentId) revalidatePath(`/projects/${project.parentId}`);
  revalidatePath("/");
  revalidatePath("/today");
  return project;
}

export async function setProjectBanner(projectId: string, bannerUrl: string) {
  const project = await db.project.update({
    where: { id: projectId },
    data: { bannerUrl },
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/");
  return project;
}

export async function removeProjectBanner(projectId: string) {
  const project = await db.project.update({
    where: { id: projectId },
    data: { bannerUrl: null },
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/");
  return project;
}

export async function deleteProject(id: string) {
  const project = await db.project.findUnique({ where: { id } });
  await db.project.delete({ where: { id } });

  if (project?.parentId) {
    revalidatePath(`/projects/${project.parentId}`);
  }
  revalidatePath("/");
  revalidatePath("/today");
  return { success: true };
}

export async function recalculateProjectProgress(projectId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      tasks: true,
      subProjects: {
        include: { tasks: true },
      },
    },
  });

  if (!project) return;

  const directTasks = project.tasks;
  const subProjects = project.subProjects;

  let totalUnits = directTasks.length;
  let completedUnits = directTasks.filter((t) => t.status === "DONE").length;

  for (const sub of subProjects) {
    totalUnits += sub.tasks.length || 1;
    completedUnits += sub.tasks.filter((t) => t.status === "DONE").length;
  }

  const progress = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : project.progress;

  await db.project.update({
    where: { id: projectId },
    data: { progress },
  });

  if (project.parentId) {
    await recalculateProjectProgress(project.parentId);
  }
}
