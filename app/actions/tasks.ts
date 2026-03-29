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
      attachments: true,
      assignee: true,
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
  assigneeId?: string | null;
}) {
  const task = await db.task.create({
    data: {
      projectId: formData.projectId,
      title: formData.title,
      description: formData.description,
      status: formData.status || TaskStatus.TODO,
      priority: formData.priority || PriorityLevel.MEDIUM,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      duration: formData.estimatedMinutes || 0,
      assigneeId: formData.assigneeId || null,
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
    assigneeId: string | null;
  }>
) {
  const updateData: any = { ...data };
  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }
  if (data.estimatedMinutes !== undefined) {
    updateData.duration = data.estimatedMinutes;
    delete updateData.estimatedMinutes;
  }
  if (data.actualMinutes !== undefined) {
    delete updateData.actualMinutes;
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
}

export async function addSubtask(taskId: string, title: string) {
  const subtask = await db.subtask.create({
    data: {
      taskId,
      title,
      isDone: false,
    },
  });

  const task = await db.task.findUnique({ where: { id: taskId } });
  if (task) {
    await recalculateProjectProgress(task.projectId);
    revalidatePath(`/projects/${task.projectId}`);
  }
  revalidatePath("/");
  revalidatePath("/today");
  return subtask;
}

export async function toggleSubtask(id: string) {
  const subtask = await db.subtask.findUnique({ where: { id } });
  if (!subtask) return null;

  const updated = await db.subtask.update({
    where: { id },
    data: { isDone: !subtask.isDone },
  });

  const task = await db.task.findUnique({ where: { id: subtask.taskId } });
  if (task) {
    await recalculateProjectProgress(task.projectId);
    revalidatePath(`/projects/${task.projectId}`);
  }
  revalidatePath("/");
  revalidatePath("/today");
  return updated;
}

export async function deleteSubtask(id: string) {
  const subtask = await db.subtask.findUnique({ where: { id } });
  if (!subtask) return;

  await db.subtask.delete({ where: { id } });

  const task = await db.task.findUnique({ where: { id: subtask.taskId } });
  if (task) {
    await recalculateProjectProgress(task.projectId);
    revalidatePath(`/projects/${task.projectId}`);
  }
  revalidatePath("/");
  revalidatePath("/today");
}
