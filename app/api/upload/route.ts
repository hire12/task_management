import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { db } from "@/lib/db";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const taskId = formData.get("taskId") as string | null;
    const isCover = formData.get("isCover") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file was attached" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} is not supported. Please upload an image.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds maximum size of 10MB. Try compressing it first." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe unique filename
    const ext = path.extname(file.name) || `.${file.type.split("/")[1] || "png"}`;
    const cleanBase = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40);
    const uniqueHash = crypto.randomBytes(6).toString("hex");
    const filename = `${cleanBase}_${uniqueHash}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    // If taskId is provided, directly save attachment record to database
    let attachmentRecord = null;
    if (taskId) {
      attachmentRecord = await db.taskAttachment.create({
        data: {
          taskId,
          filename: file.name,
          fileSize: file.size,
          mimeType: file.type,
          url: publicUrl,
          isCover,
        },
      });
    }

    // If projectId and isBanner, update project bannerUrl
    const projectId = formData.get("projectId") as string | null;
    const isBanner = formData.get("isBanner") === "true";
    if (projectId && isBanner) {
      await db.project.update({
        where: { id: projectId },
        data: { bannerUrl: publicUrl },
      });
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: file.name,
      fileSize: file.size,
      mimeType: file.type,
      attachment: attachmentRecord,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}
