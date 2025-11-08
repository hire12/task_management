import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const projects = await db.project.findMany({
      include: {
        tasks: {
          include: {
            subtasks: true,
            attachments: true,
          },
        },
        docs: true,
      },
    });

    const backupPayload = {
      version: "2.0.0",
      exportedAt: new Date().toISOString(),
      workspaceTitle: "Production Workspace Backup",
      totalProjects: projects.length,
      data: projects,
    };

    const response = new NextResponse(JSON.stringify(backupPayload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="workspace-backup-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
