"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getUserWorkspaces, createTeamWorkspace, ensurePersonalWorkspace } from "@/lib/workspace";

export async function getUserWorkspacesAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  // Ensure user has personal workspace
  await ensurePersonalWorkspace(session.user.id, session.user.name);

  return await getUserWorkspaces(session.user.id);
}

export async function createTeamWorkspaceAction(name: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const result = await createTeamWorkspace(session.user.id, name);
  revalidatePath("/");
  return result;
}

export async function inviteTeamMemberAction(organizationId: string, email: string, role = "member") {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Verify caller is admin or owner
  const membership = await db.member.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId: session.user.id,
      },
    },
  });

  if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
    throw new Error("Forbidden: Only owners and admins can invite members.");
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

  const invite = await db.invitation.create({
    data: {
      organizationId,
      email,
      role,
      inviterId: session.user.id,
      expiresAt,
    },
  });

  return { token: invite.token, id: invite.id };
}

export async function toggleProjectPublicAction(projectId: string, isPublic: boolean) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  let shareToken: string | undefined = undefined;
  if (isPublic) {
    shareToken = `share-${projectId.slice(0, 8)}-${Date.now().toString(36)}`;
  }

  const updated = await db.project.update({
    where: { id: projectId },
    data: {
      isPublic,
      ...(isPublic ? { shareToken } : {}),
    },
  });

  revalidatePath(`/projects/${projectId}`);
  return { isPublic: updated.isPublic, shareToken: updated.shareToken };
}

export async function assignTaskMemberAction(taskId: string, assigneeId: string | null) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const updated = await db.task.update({
    where: { id: taskId },
    data: { assigneeId },
    include: { assignee: true },
  });

  return updated;
}
