"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProjectDoc(projectId: string) {
  let doc = await db.projectDoc.findFirst({
    where: { projectId },
  });

  if (!doc) {
    doc = await db.projectDoc.create({
      data: {
        projectId,
        title: "Project Specs & Architecture",
        content: "### Overview\n\nOutline core architecture, dependencies, API endpoints, and specs here.",
      },
    });
  }

  return doc;
}

export async function saveProjectDoc(projectId: string, content: string, title?: string) {
  const existing = await db.projectDoc.findFirst({ where: { projectId } });

  let doc;
  if (existing) {
    doc = await db.projectDoc.update({
      where: { id: existing.id },
      data: { content, ...(title ? { title } : {}) },
    });
  } else {
    doc = await db.projectDoc.create({
      data: {
        projectId,
        title: title || "Project Specs & Architecture",
        content,
      },
    });
  }

  revalidatePath(`/projects/${projectId}`);
  return doc;
}
