import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.resolve(__dirname, "local_db_export.json");
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Payload not found at ${jsonPath}`);
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  console.log("Restoring local data to production PostgreSQL database...");

  // 1. Wipe remote tables cleanly
  await prisma.activityLog.deleteMany({});
  await prisma.projectDoc.deleteMany({});
  await prisma.subtask.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.workspace.deleteMany({});

  // 2. Workspaces
  for (const w of data.workspaces) {
    await prisma.workspace.create({
      data: {
        id: w.id,
        name: w.name,
        slug: w.slug,
        icon: w.icon,
        color: w.color,
        createdAt: new Date(w.createdAt),
        updatedAt: new Date(w.updatedAt),
      },
    });
  }

  // 3. Root Projects (parentId is null) - e.g. Sada, Orbit Platform 2.0, etc.
  const rootProjects = data.projects.filter((p: any) => !p.parentId);
  for (const p of rootProjects) {
    await prisma.project.create({
      data: {
        id: p.id,
        workspaceId: p.workspaceId,
        parentId: null,
        title: p.title,
        description: p.description,
        temporalHorizon: p.temporalHorizon,
        status: p.status,
        priority: p.priority,
        progress: p.progress,
        targetStartDate: p.targetStartDate ? new Date(p.targetStartDate) : null,
        targetEndDate: p.targetEndDate ? new Date(p.targetEndDate) : null,
        tags: p.tags || [],
        pinnedLinks: p.pinnedLinks || null,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      },
    });
  }

  // 4. Sub-Projects (parentId is not null)
  const childProjects = data.projects.filter((p: any) => p.parentId);
  for (const p of childProjects) {
    await prisma.project.create({
      data: {
        id: p.id,
        workspaceId: p.workspaceId,
        parentId: p.parentId,
        title: p.title,
        description: p.description,
        temporalHorizon: p.temporalHorizon,
        status: p.status,
        priority: p.priority,
        progress: p.progress,
        targetStartDate: p.targetStartDate ? new Date(p.targetStartDate) : null,
        targetEndDate: p.targetEndDate ? new Date(p.targetEndDate) : null,
        tags: p.tags || [],
        pinnedLinks: p.pinnedLinks || null,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      },
    });
  }

  // 5. Tasks (including all Sada tasks)
  for (const t of data.tasks) {
    await prisma.task.create({
      data: {
        id: t.id,
        projectId: t.projectId,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        estimatedMinutes: t.estimatedMinutes,
        dueDate: t.dueDate ? new Date(t.dueDate) : null,
        orderIndex: t.orderIndex || 0,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      },
    });
  }

  // 6. Subtasks
  for (const s of data.subtasks) {
    await prisma.subtask.create({
      data: {
        id: s.id,
        taskId: s.taskId,
        title: s.title,
        isCompleted: s.isCompleted,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
      },
    });
  }

  // 7. Project Docs
  for (const d of data.projectDocs) {
    await prisma.projectDoc.create({
      data: {
        id: d.id,
        projectId: d.projectId,
        title: d.title,
        content: d.content,
        createdAt: new Date(d.createdAt),
        updatedAt: new Date(d.updatedAt),
      },
    });
  }

  // 8. Activity Logs
  for (const a of data.activityLogs) {
    await prisma.activityLog.create({
      data: {
        id: a.id,
        projectId: a.projectId,
        taskId: a.taskId,
        action: a.action,
        details: a.details,
        createdAt: new Date(a.createdAt),
      },
    });
  }

  console.log("Successfully restored all local data to production!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
