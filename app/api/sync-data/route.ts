import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const authHeader = req.headers.get("x-sync-secret");
  if (authHeader !== "orbit-sync-2026-secure-token") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();

    // 1. Wipe tables cleanly
    await db.activityLog.deleteMany({});
    await db.projectDoc.deleteMany({});
    await db.subtask.deleteMany({});
    await db.task.deleteMany({});
    await db.project.deleteMany({});
    await db.workspace.deleteMany({});

    // 2. Workspaces
    for (const w of data.workspaces) {
      await db.workspace.create({
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

    // 3. Root Projects (parentId is null)
    const rootProjects = data.projects.filter((p: any) => !p.parentId);
    for (const p of rootProjects) {
      await db.project.create({
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
      await db.project.create({
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

    // 5. Tasks
    for (const t of data.tasks) {
      await db.task.create({
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
      await db.subtask.create({
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
      await db.projectDoc.create({
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
      await db.activityLog.create({
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

    return NextResponse.json({
      success: true,
      message: `Restored ${data.workspaces.length} workspaces, ${data.projects.length} projects, ${data.tasks.length} tasks.`,
    });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
