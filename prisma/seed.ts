import { PrismaClient, TemporalHorizon, ProjectStatus, PriorityLevel, TaskStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.activityLog.deleteMany({});
  await prisma.projectDoc.deleteMany({});
  await prisma.subtask.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.workspace.deleteMany({});

  // 1. Create Workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: "Engineering & Ventures",
      slug: "engineering-ventures",
      icon: "Planet",
      color: "#4F6B58",
    },
  });

  // 2. Active Master Project: Next-Gen Commerce
  const activeMaster = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      title: "Orbit Platform 2.0",
      description: "Modular, recursive project & task operating system with D3 sparklines and temporal horizons.",
      temporalHorizon: TemporalHorizon.ACTIVE,
      status: ProjectStatus.IN_PROGRESS,
      priority: PriorityLevel.HIGH,
      progress: 65,
      targetStartDate: new Date("2025-09-20"),
      targetEndDate: new Date("2025-10-04"),
    },
  });

  // Sub-project 1 under Active Master
  const subBackend = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      parentId: activeMaster.id,
      title: "PostgreSQL & Prisma Data Engine",
      description: "Relational data modeling, recursive self-referential relations, and fast indexing.",
      temporalHorizon: TemporalHorizon.ACTIVE,
      status: ProjectStatus.DONE,
      priority: PriorityLevel.HIGH,
      progress: 100,
    },
  });

  // Sub-project 2 under Active Master
  const subFrontend = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      parentId: activeMaster.id,
      title: "Lexend UI & Phosphor Duotone System",
      description: "Muted low-contrast dark/light palette, custom D3.js sparklines, and responsive modals.",
      temporalHorizon: TemporalHorizon.ACTIVE,
      status: ProjectStatus.IN_PROGRESS,
      priority: PriorityLevel.HIGH,
      progress: 75,
    },
  });

  // Tasks under Sub-Project 1 (Backend)
  await prisma.task.create({
    data: {
      projectId: subBackend.id,
      title: "Design recursive parent_id schema in Prisma",
      status: TaskStatus.DONE,
      priority: PriorityLevel.HIGH,
      estimatedMinutes: 60,
      subtasks: {
        create: [
          { title: "Define TemporalHorizon & Status enums", isCompleted: true },
          { title: "Configure cascade delete rules", isCompleted: true },
        ],
      },
    },
  });

  // Tasks under Sub-Project 2 (Frontend)
  await prisma.task.create({
    data: {
      projectId: subFrontend.id,
      title: "Implement custom D3 MonotoneX sparklines",
      status: TaskStatus.DONE,
      priority: PriorityLevel.HIGH,
      estimatedMinutes: 45,
      subtasks: {
        create: [
          { title: "Build dynamic area fill gradient", isCompleted: true },
          { title: "Add pulsing end-point anchor", isCompleted: true },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      projectId: subFrontend.id,
      title: "Build Today Focus HUD multi-project aggregator",
      status: TaskStatus.IN_PROGRESS,
      priority: PriorityLevel.URGENT,
      dueDate: new Date(),
      estimatedMinutes: 90,
    },
  });

  await prisma.task.create({
    data: {
      projectId: subFrontend.id,
      title: "Refine keyboard shortcuts and Command Palette (Cmd + K)",
      status: TaskStatus.TODO,
      priority: PriorityLevel.MEDIUM,
      estimatedMinutes: 30,
    },
  });

  // Docs for Active Project
  await prisma.projectDoc.create({
    data: {
      projectId: activeMaster.id,
      title: "System Architecture & Philosophy",
      content: `### Orbit OS Architecture

- **Recursive Model**: Infinite sub-project nesting without clutter.
- **Temporal Dimensions**:
  1. Active (Now)
  2. Pipeline (Next)
  3. Incubator (Someday)
  4. Shipped (Trophy Room)
- **Design Tokens**: Lexend typography, Phosphor Duotone iconography, and D3.js micro-sparklines.`,
    },
  });

  // 3. Pipeline Master Project (Future Horizon)
  await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      title: "Autonomous AI Task Dispatcher",
      description: "Background agent that auto-breaks large user goals into sub-tasks with time estimates.",
      temporalHorizon: TemporalHorizon.FUTURE,
      status: ProjectStatus.QUEUED,
      priority: PriorityLevel.MEDIUM,
      progress: 0,
      targetStartDate: new Date("2025-10-15"),
    },
  });

  // 4. Incubator Master Project (Someday Horizon)
  await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      title: "Voice-First Daily Standup Logger",
      description: "Quick audio recordings converted directly to task completions and changelogs.",
      temporalHorizon: TemporalHorizon.IDEA,
      status: ProjectStatus.DRAFT,
      priority: PriorityLevel.LOW,
      progress: 0,
    },
  });

  // 5. Shipped Master Project (Trophy Horizon)
  const shippedMaster = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      title: "Task Management V1 MVP",
      description: "Initial prototype with Express, MongoDB, and basic CRUD.",
      temporalHorizon: TemporalHorizon.SHIPPED,
      status: ProjectStatus.DONE,
      priority: PriorityLevel.MEDIUM,
      progress: 100,
    },
  });

  await prisma.task.create({
    data: {
      projectId: shippedMaster.id,
      title: "Shipped initial prototype to staging",
      status: TaskStatus.DONE,
      priority: PriorityLevel.MEDIUM,
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
