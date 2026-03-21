import { db } from "./db";

export interface UserWorkspace {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  type: "PERSONAL" | "TEAM";
  role: "owner" | "admin" | "member" | "viewer";
  isOwner: boolean;
  memberCount: number;
}

/**
 * Ensures user has an active personal workspace, creating one if not present.
 */
export async function ensurePersonalWorkspace(userId: string, userName: string) {
  let workspace = await db.workspace.findFirst({
    where: {
      ownerId: userId,
      type: "PERSONAL",
    },
  });

  if (!workspace) {
    const slug = `personal-${userId.slice(0, 8)}-${Date.now()}`;
    workspace = await db.workspace.create({
      data: {
        name: `${userName}'s Space`,
        slug,
        icon: "UserCircle",
        color: "#4F6B58",
        type: "PERSONAL",
        ownerId: userId,
      },
    });
  }

  return workspace;
}

/**
 * Retrieves all workspaces accessible by the user (Personal + Teams joined).
 */
export async function getUserWorkspaces(userId: string): Promise<UserWorkspace[]> {
  // 1. Workspaces directly owned by user
  const owned = await db.workspace.findMany({
    where: { ownerId: userId },
    include: {
      organization: {
        include: {
          _count: { select: { members: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // 2. Workspaces accessible via organization membership
  const memberships = await db.member.findMany({
    where: { userId },
    include: {
      organization: {
        include: {
          workspaces: true,
          _count: { select: { members: true } },
        },
      },
    },
  });

  const list: UserWorkspace[] = [];

  // Add owned
  for (const w of owned) {
    list.push({
      id: w.id,
      name: w.name,
      slug: w.slug,
      icon: w.icon,
      color: w.color,
      type: (w.type as "PERSONAL" | "TEAM") || "PERSONAL",
      role: "owner",
      isOwner: true,
      memberCount: w.organization?._count.members || 1,
    });
  }

  // Add organization memberships not already added
  for (const m of memberships) {
    for (const w of m.organization.workspaces) {
      if (!list.some((existing) => existing.id === w.id)) {
        list.push({
          id: w.id,
          name: w.name,
          slug: w.slug,
          icon: w.icon,
          color: w.color,
          type: "TEAM",
          role: (m.role as any) || "member",
          isOwner: false,
          memberCount: m.organization._count.members,
        });
      }
    }
  }

  return list;
}

/**
 * Creates a brand new team workspace linked to an organization.
 */
export async function createTeamWorkspace(userId: string, name: string, icon = "Users", color = "#2563EB") {
  const orgSlug = `${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString(36)}`;
  
  // Create organization
  const org = await db.organization.create({
    data: {
      name,
      slug: orgSlug,
    },
  });

  // Add owner member
  await db.member.create({
    data: {
      organizationId: org.id,
      userId,
      role: "owner",
    },
  });

  // Create workspace linked to organization
  const workspace = await db.workspace.create({
    data: {
      name: `${name} Space`,
      slug: `ws-${orgSlug}`,
      icon,
      color,
      type: "TEAM",
      ownerId: userId,
      organizationId: org.id,
    },
  });

  return { organization: org, workspace };
}
