"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { TemporalHorizon, ProjectStatus } from "@prisma/client";

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
        orderBy: { order: "asc" },
      },
      _count: {
        select: { tasks: true, subProjects: true },
      },
    },
    orderBy: { updatedAt: "desc" },
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
        orderBy: { order: "asc" },
      },
      docs: {
        orderBy: { updatedAt: "desc" },
      },
      activity: {
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
  targetDate?: Date | string | null;
  color?: string;
  icon?: string;
}) {
  const project = await db.project.create({
    data: {
      workspaceId: formData.workspaceId,
      parentId: formData.parentId || null,
      title: formData.title,
      description: formData.description,
      temporalHorizon: formData.temporalHorizon || TemporalHorizon.ACTIVE,
      status: formData.status || ProjectStatus.IN_PROGRESS,
      targetDate: formData.targetDate ? new Date(formData.targetDate) : null,
      color: formData.color || "#388E3C",
      icon: formData.icon || "Target",
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
    targetDate: Date | string | null;
    color: string;
    icon: string;
    isPublic: boolean;
    shareToken: string;
  }>
) {
  const updateData: any = { ...data };
  if (data.targetDate !== undefined) {
    updateData.targetDate = data.targetDate ? new Date(data.targetDate) : null;
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
  if (project.parentId) {
    await recalculateProjectProgress(project.parentId);
  }
}
