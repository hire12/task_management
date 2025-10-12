"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import path from "path";

export async function deleteTaskAttachment(attachmentId: string) {
  const attachment = await db.taskAttachment.findUnique({
    where: { id: attachmentId },
    include: { task: true },
  });

  if (!attachment) return { success: false, error: "Attachment not found" };

  // Remove file from disk if it lives in /uploads/
  if (attachment.url.startsWith("/uploads/")) {
    const filename = path.basename(attachment.url);
    const diskPath = path.join(process.cwd(), "public", "uploads", filename);
    try {
      await unlink(diskPath);
    } catch (e) {
      // Don't fail the whole action if the file was already deleted
      console.warn("Could not delete file from disk:", diskPath);
    }
  }

  await db.taskAttachment.delete({
    where: { id: attachmentId },
  });

  revalidatePath(`/projects/${attachment.task.projectId}`);
  revalidatePath("/today");
  revalidatePath("/");

  return { success: true };
}

export async function toggleTaskCover(attachmentId: string, taskId: string) {
  const attachment = await db.taskAttachment.findUnique({
    where: { id: attachmentId },
    include: { task: true },
  });

  if (!attachment) return { success: false };

  const currentCoverState = attachment.isCover;

  // Unset all covers on this task first
  await db.taskAttachment.updateMany({
    where: { taskId },
    data: { isCover: false },
  });

  // If it wasn't a cover, make it the cover
  if (!currentCoverState) {
    await db.taskAttachment.update({
      where: { id: attachmentId },
      data: { isCover: true },
    });
  }

  revalidatePath(`/projects/${attachment.task.projectId}`);
  revalidatePath("/today");
  revalidatePath("/");

  return { success: true, isCover: !currentCoverState };
}

export async function linkAttachmentToTask(
  taskId: string,
  data: {
    filename: string;
    fileSize: number;
    mimeType: string;
    url: string;
    width?: number;
    height?: number;
    isCover?: boolean;
  }
) {
  const task = await db.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error("Task not found");

  const attachment = await db.taskAttachment.create({
    data: {
      taskId,
      filename: data.filename,
      fileSize: data.fileSize,
      mimeType: data.mimeType,
      url: data.url,
      width: data.width || null,
      height: data.height || null,
      isCover: data.isCover || false,
    },
  });

  revalidatePath(`/projects/${task.projectId}`);
  revalidatePath("/today");
  revalidatePath("/");

  return attachment;
}
