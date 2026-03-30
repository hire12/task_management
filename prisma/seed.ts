import { PrismaClient, TemporalHorizon, ProjectStatus, PriorityLevel, TaskStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Orbit Database with Better Auth and Multi-Tenant Workspaces...");

  // Clean existing data
  await prisma.activityLog.deleteMany({});
  await prisma.projectDoc.deleteMany({});
  await prisma.subtask.deleteMany({});
  await prisma.taskAttachment.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.projectMember.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.workspace.deleteMany({});
  await prisma.invitation.deleteMany({});
  await prisma.member.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Default User
  const user = await prisma.user.create({
    data: {
      name: "Hiriyan Mohammed",
      email: "hireemoh@gmail.com",
      emailVerified: true,
      image: "https://avatars.githubusercontent.com/u/112828727?v=4",
    },
  });

  // 2. Create Personal Workspace
  const personalSpace = await prisma.workspace.create({
    data: {
      name: "Hiriyan's Personal Space",
      slug: "personal-hiriyan",
      icon: "UserCircle",
      color: "#4F6B58",
      type: "PERSONAL",
      ownerId: user.id,
    },
  });

  // 3. Create Team Organization & Team Workspace
  const org = await prisma.organization.create({
    data: {
      name: "Orbit Core Team",
      slug: "orbit-core",
    },
  });

  await prisma.member.create({
    data: {
      organizationId: org.id,
      userId: user.id,
      role: "owner",
    },
  });

  const teamSpace = await prisma.workspace.create({
    data: {
      name: "Orbit Core Team",
      slug: "team-orbit-core",
      icon: "Users",
      color: "#2563EB",
      type: "TEAM",
      ownerId: user.id,
      organizationId: org.id,
    },
  });

  // 4. Create Master Project in Team Workspace
  const masterProject = await prisma.project.create({
    data: {
      workspaceId: teamSpace.id,
      title: "Orbit Platform 2.5",
      description: "Next-generation multi-tenant collaboration platform with Better Auth, team spaces, and client portals.",
      temporalHorizon: TemporalHorizon.ACTIVE,
      status: ProjectStatus.IN_PROGRESS,
      targetDate: new Date("2025-11-30"),
      color: "#388E3C",
      icon: "Target",
      isPublic: true,
      shareToken: "orbit-2-5-preview",
    },
  });

  // 5. Create Project Docs
  await prisma.projectDoc.create({
    data: {
      projectId: masterProject.id,
      title: "Orbit 2.5 Technical Blueprint & Multi-Tenancy Architecture",
      content: `### Orbit 2.5 — Engineering Blueprint & System Architecture

#### 1. Core Mission
Orbit provides lightning-fast task management with frictionless multi-tenancy, granular team permissions, and real-time collaboration.

#### 2. Architectural Pillars
1. **Better Auth Security**: Session cookie management with PostgreSQL Prisma adapter.
2. **Dual-Tier Multi-Tenancy**: Personal Spaces for private workflows alongside Team Spaces for organization members.
3. **Guest Client Portals**: Shareable read-only links (\`/p/[shareToken]\`) for external clients and stakeholders.
4. **Role-Based Access Control**: Strict Owner, Admin, Member, and Viewer permission enforcement.`,
    },
  });

  // 6. Create Sub-Project
  const authSubProject = await prisma.project.create({
    data: {
      workspaceId: teamSpace.id,
      parentId: masterProject.id,
      title: "Better Auth & Team Spaces Migration",
      description: "Implement user authentication, team member invitations, and workspace switching.",
      temporalHorizon: TemporalHorizon.ACTIVE,
      status: ProjectStatus.IN_PROGRESS,
      targetDate: new Date("2025-10-15"),
      color: "#2563EB",
      icon: "Lock",
    },
  });

  // 7. Create Sample Tasks
  await prisma.task.create({
    data: {
      projectId: authSubProject.id,
      title: "Integrate Better Auth Next.js route handler and session provider",
      description: "Set up `/api/auth/[...all]` handler with PostgreSQL database adapter.",
      status: TaskStatus.DONE,
      priority: PriorityLevel.HIGH,
      duration: 45,
      assigneeId: user.id,
      subtasks: {
        create: [
          { title: "Define User, Session, Account, Verification schema models", isDone: true },
          { title: "Create Better Auth instance in lib/auth.ts", isDone: true },
          { title: "Implement Next.js catch-all route handler", isDone: true },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      projectId: authSubProject.id,
      title: "Build Workspace Switcher and Team Member Invite Modal",
      description: "Enable switching between personal and team spaces with 1-click invite link generation.",
      status: TaskStatus.IN_PROGRESS,
      priority: PriorityLevel.URGENT,
      duration: 60,
      assigneeId: user.id,
      subtasks: {
        create: [
          { title: "Build WorkspaceSwitcher dropdown component", isDone: true },
          { title: "Implement TeamMembersModal with role management", isDone: true },
          { title: "Create public /invite/[token] landing page", isDone: false },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      projectId: authSubProject.id,
      title: "Build Client Guest Portal for Public Read-Only Kanban Boards",
      description: "Generate secure `/p/[shareToken]` preview links for external stakeholders.",
      status: TaskStatus.TODO,
      priority: PriorityLevel.MEDIUM,
      duration: 30,
      subtasks: {
        create: [
          { title: "Create public route `/p/[shareToken]`", isDone: true },
          { title: "Design clean read-only Kanban board layout", isDone: true },
          { title: "Add lightbox attachment inspector", isDone: false },
        ],
      },
    },
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
