"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveAttachmentAnnotations(attachmentId: string, annotations: any) {
  const attachment = await db.taskAttachment.update({
    where: { id: attachmentId },
    data: { annotations },
    include: { task: true },
  });

  revalidatePath(`/projects/${attachment.task.projectId}`);
  revalidatePath("/today");
  return attachment;
}
