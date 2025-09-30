"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { TaskStatus, PriorityLevel } from "@prisma/client";
import { recalculateProjectProgress } from "./projects";

export async function getTodayTasks() {
  return db.task.findMany({
    where: {
      project: {
        temporalHorizon: "ACTIVE",
      },
    },
    include: {
      project: true,
      subtasks: true,
    },
    orderBy: [
      { status: "asc" },
      { priority: "desc" },
      { dueDate: "asc" },
    ],
  });
}

export async function createTask(formData: {
  projectId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: PriorityLevel;
  dueDate?: Date | string | null;
  estimatedMinutes?: number;
}) {
  const task = await db.task.create({
    data: {
      projectId: formData.projectId,
      title: formData.title,
      description: formData.description,
      status: formData.status || TaskStatus.TODO,
      priority: formData.priority || PriorityLevel.MEDIUM,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      estimatedMinutes: formData.estimatedMinutes || null,
    },
  });

  await recalculateProjectProgress(formData.projectId);

  revalidatePath(`/projects/${formData.projectId}`);
  revalidatePath("/");
  revalidatePath("/today");
  return task;
}

export async function updateTask(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    status: TaskStatus;
    priority: PriorityLevel;
    dueDate: Date | string | null;
    estimatedMinutes: number;
    actualMinutes: number;
  }>
) {
  const updateData: any = { ...data };
  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }

  const task = await db.task.update({
    where: { id },
    data: updateData,
  });

  await recalculateProjectProgress(task.projectId);

  revalidatePath(`/projects/${task.projectId}`);
  revalidatePath("/");
  revalidatePath("/today");
  return task;
}

export async function toggleTaskStatus(id: string) {
  const task = await db.task.findUnique({ where: { id } });
  if (!task) return null;

  const nextStatus: Record<TaskStatus, TaskStatus> = {
    BACKLOG: TaskStatus.TODO,
    TODO: TaskStatus.IN_PROGRESS,
    IN_PROGRESS: TaskStatus.DONE,
    REVIEW: TaskStatus.DONE,
    DONE: TaskStatus.TODO,
  };

  const updated = await db.task.update({
    where: { id },
    data: { status: nextStatus[task.status] },
  });

  await recalculateProjectProgress(task.projectId);

  revalidatePath(`/projects/${task.projectId}`);
  revalidatePath("/");
  revalidatePath("/today");
  return updated;
}

export async function deleteTask(id: string) {
  const task = await db.task.findUnique({ where: { id } });
  if (!task) return;

  await db.task.delete({ where: { id } });
  await recalculateProjectProgress(task.projectId);

  revalidatePath(`/projects/${task.projectId}`);
  revalidatePath("/");
  revalidatePath("/today");
  return { success: true };
}

export async function addSubtask(taskId: string, title: string) {
  const subtask = await db.subtask.create({
    data: { taskId, title, isCompleted: false },
  });
  const task = await db.task.findUnique({ where: { id: taskId } });
  if (task) {
    revalidatePath(`/projects/${task.projectId}`);
    revalidatePath("/today");
  }
  return subtask;
}

export async function toggleSubtask(id: string) {
  const subtask = await db.subtask.findUnique({
    where: { id },
    include: { task: true },
  });
  if (!subtask) return;

  const updated = await db.subtask.update({
    where: { id },
    data: { isCompleted: !subtask.isCompleted },
  });

  revalidatePath(`/projects/${subtask.task.projectId}`);
  revalidatePath("/today");
  return updated;
}
