import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.workspaces || !data.projects || !data.tasks) {
      return NextResponse.json({ error: "Invalid backup format." }, { status: 400 });
    }

    // 1. Workspaces
    for (const w of data.workspaces) {
      await db.workspace.upsert({
        where: { id: w.id },
        update: {
          name: w.name,
          slug: w.slug,
          icon: w.icon || "Planet",
          color: w.color || "#4F6B58",
        },
        create: {
          id: w.id,
          name: w.name,
          slug: w.slug,
          icon: w.icon || "Planet",
          color: w.color || "#4F6B58",
          createdAt: new Date(w.createdAt),
          updatedAt: new Date(w.updatedAt),
        },
      });
    }

    // 2. Root Projects
    const rootProjects = data.projects.filter((p: any) => !p.parentId);
    for (const p of rootProjects) {
      await db.project.upsert({
        where: { id: p.id },
        update: {
          title: p.title,
          description: p.description,
          temporalHorizon: p.temporalHorizon,
          status: p.status,
          targetDate: p.targetDate ? new Date(p.targetDate) : null,
          color: p.color || "#388E3C",
          icon: p.icon || "Target",
          bannerUrl: p.bannerUrl,
        },
        create: {
          id: p.id,
          workspaceId: p.workspaceId,
          parentId: null,
          title: p.title,
          description: p.description,
          temporalHorizon: p.temporalHorizon,
          status: p.status,
          targetDate: p.targetDate ? new Date(p.targetDate) : null,
          color: p.color || "#388E3C",
          icon: p.icon || "Target",
          bannerUrl: p.bannerUrl,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        },
      });
    }

    // 3. Sub-Projects
    const childProjects = data.projects.filter((p: any) => p.parentId);
    for (const p of childProjects) {
      await db.project.upsert({
        where: { id: p.id },
        update: {
          title: p.title,
          description: p.description,
          temporalHorizon: p.temporalHorizon,
          status: p.status,
          targetDate: p.targetDate ? new Date(p.targetDate) : null,
          color: p.color || "#388E3C",
          icon: p.icon || "Target",
        },
        create: {
          id: p.id,
          workspaceId: p.workspaceId,
          parentId: p.parentId,
          title: p.title,
          description: p.description,
          temporalHorizon: p.temporalHorizon,
          status: p.status,
          targetDate: p.targetDate ? new Date(p.targetDate) : null,
          color: p.color || "#388E3C",
          icon: p.icon || "Target",
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        },
      });
    }

    // 4. Tasks
    for (const t of data.tasks) {
      await db.task.upsert({
        where: { id: t.id },
        update: {
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
          order: t.order || 0.0,
          duration: t.duration || 0,
        },
        create: {
          id: t.id,
          projectId: t.projectId,
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
          order: t.order || 0.0,
          duration: t.duration || 0,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
        },
      });
    }

    return NextResponse.json({ success: true, message: "Workspace data synchronized successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
