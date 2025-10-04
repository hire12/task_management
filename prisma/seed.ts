import { PrismaClient, TemporalHorizon, ProjectStatus, PriorityLevel, TaskStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Orbit Database with full production-level initiatives...");

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

  // 2. Active Master Project: Orbit Platform 2.0
  const orbitMaster = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      title: "Orbit Platform 2.0",
      description: "Modular, recursive project & task operating system with D3 sparklines, temporal horizons, and real-time collaboration.",
      temporalHorizon: TemporalHorizon.ACTIVE,
      status: ProjectStatus.IN_PROGRESS,
      priority: PriorityLevel.HIGH,
      progress: 20,
      targetStartDate: new Date("2025-09-20"),
      targetEndDate: new Date("2025-10-31"),
    },
  });

  // Master Specs Document
  await prisma.projectDoc.create({
    data: {
      projectId: orbitMaster.id,
      title: "Orbit 2.0 Technical Architecture & Master Specs",
      content: `### Orbit 2.0 — Engineering Blueprint & System Architecture

#### 1. Core Mission & Philosophy
Orbit is engineered as a **speed-first, cognitive-load-minimizing operating system** for developers, founders, and engineering teams.

#### 2. System Subsystems
1. **Multi-User Collaboration Engine**: Live presence, WebSocket event bus, and optimistic state synchronization with IndexedDB local persistence.
2. **Autonomous AI Copilot**: Voice memos directly parsed into decomposed subtasks with automated time estimates and horizon triage.
3. **Advanced D3 Velocity Engine**: Interactive Cumulative Flow Diagrams (CFD), cycle time distribution, and Monte Carlo sprint completion estimators.
4. **Keyboard-First Command Shell**: Zero-mouse workflow with global \`G + Key\` navigation, quick capture hotkeys, and GitHub PR auto-linkers.
5. **Zero-Trust Security & RBAC**: Passkey/WebAuthn biometric authentication with granular workspace permissions.

#### 3. Data Integrity & Rollup Invariants
- Parent initiatives automatically aggregate completion metrics across all child sub-projects and subtask checklists.
- Zero orphaned tasks: deleting a sub-project cleanly cascades or re-parents under the root master initiative.`,
    },
  });

  // --- SUB-PROJECT 1: Real-Time Sync & Multi-User Collaboration ---
  const subCollab = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      parentId: orbitMaster.id,
      title: "Real-Time Sync & Live Collaboration Engine",
      description: "WebSocket event bus, live peer presence avatars, and offline-first IndexedDB synchronization.",
      temporalHorizon: TemporalHorizon.ACTIVE,
      status: ProjectStatus.IN_PROGRESS,
      priority: PriorityLevel.HIGH,
      progress: 35,
    },
  });

  await prisma.task.create({
    data: {
      projectId: subCollab.id,
      title: "Implement WebSocket live presence avatars & active card highlights",
      description: "Broadcast active user locations so collaborators see who is editing or viewing a specific initiative.",
      status: TaskStatus.IN_PROGRESS,
      priority: PriorityLevel.HIGH,
      estimatedMinutes: 60,
      dueDate: new Date(Date.now() + 86400000 * 2),
      subtasks: {
        create: [
          { title: "Set up lightweight WebSocket / SSE connection listener", isCompleted: true },
          { title: "Broadcast heartbeat presence payload with user profile initials", isCompleted: true },
          { title: "Render pulsing avatar pills on task cards currently being edited", isCompleted: false },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      projectId: subCollab.id,
      title: "Build Offline-First IndexedDB Cache with Service Worker background sync",
      description: "Enable full offline usage allowing developers to create tasks and write specs on flights without internet.",
      status: TaskStatus.TODO,
      priority: PriorityLevel.HIGH,
      estimatedMinutes: 90,
      dueDate: new Date(Date.now() + 86400000 * 4),
      subtasks: {
        create: [
          { title: "Initialize idb-keyval local store for project and task entities", isCompleted: false },
          { title: "Intercept mutations in offline mode and enqueue to local sync queue", isCompleted: false },
          { title: "Replay mutation queue with exponential backoff upon network reconnect", isCompleted: false },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      projectId: subCollab.id,
      title: "Design Conflict-Free Reordering & Last-Write-Wins Task State Resolver",
      description: "Ensure concurrent drag-and-drop column shifts resolve gracefully without race conditions.",
      status: TaskStatus.TODO,
      priority: PriorityLevel.MEDIUM,
      estimatedMinutes: 45,
      subtasks: {
        create: [
          { title: "Add version timestamp and client-generated UUID idempotency keys", isCompleted: false },
          { title: "Write server-side reconciliation test suite for concurrent status updates", isCompleted: false },
        ],
      },
    },
  });

  // --- SUB-PROJECT 2: Autonomous AI Copilot & Voice Dispatcher ---
  const subAI = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      parentId: orbitMaster.id,
      title: "Autonomous AI Copilot & Voice Dispatcher",
      description: "Voice-first capture, automated subtask decomposition, and smart horizon auto-triaging.",
      temporalHorizon: TemporalHorizon.ACTIVE,
      status: ProjectStatus.IN_PROGRESS,
      priority: PriorityLevel.URGENT,
      progress: 25,
    },
  });

  await prisma.task.create({
    data: {
      projectId: subAI.id,
      title: "Voice Memo Web Audio Recorder with Instant Whisper Transcription",
      description: "Hold down spacebar or click mic icon to record a 15-second thought and automatically turn it into a structured task.",
      status: TaskStatus.IN_PROGRESS,
      priority: PriorityLevel.URGENT,
      estimatedMinutes: 60,
      dueDate: new Date(Date.now() + 86400000 * 1),
      subtasks: {
        create: [
          { title: "Implement Web Audio API MediaRecorder hook with audio waveform visualizer", isCompleted: true },
          { title: "Create server action endpoint to stream audio chunks to transcription model", isCompleted: false },
          { title: "Auto-populate task title, priority, and description from transcribed voice", isCompleted: false },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      projectId: subAI.id,
      title: "1-Click AI Task Decomposer (Break features into actionable checklists)",
      description: "Add a 'Decompose with AI' button on task cards that outputs 3 to 6 technical steps with realistic time estimates.",
      status: TaskStatus.TODO,
      priority: PriorityLevel.HIGH,
      estimatedMinutes: 45,
      dueDate: new Date(Date.now() + 86400000 * 3),
      subtasks: {
        create: [
          { title: "Design prompt template extracting technical acceptance criteria", isCompleted: false },
          { title: "Build interactive checklist preview modal before applying steps", isCompleted: false },
          { title: "Calculate estimated minutes rollup from generated checklist steps", isCompleted: false },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      projectId: subAI.id,
      title: "Smart Horizon Auto-Classifier (Triage into Now, Next, or Someday)",
      description: "Analyze initiative descriptions to suggest optimal temporal horizon placement based on scope and urgency.",
      status: TaskStatus.TODO,
      priority: PriorityLevel.MEDIUM,
      estimatedMinutes: 30,
      subtasks: {
        create: [
          { title: "Create heuristic classification rules for quick triage", isCompleted: false },
          { title: "Add horizon suggestion pill on New Project modal", isCompleted: false },
        ],
      },
    },
  });

  // --- SUB-PROJECT 3: D3.js Sprint Analytics & Velocity Forecasting ---
  const subAnalytics = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      parentId: orbitMaster.id,
      title: "D3.js Sprint Analytics & Velocity Forecasting",
      description: "Cumulative flow diagrams, cycle-time distributions, and Monte Carlo sprint completion estimators.",
      temporalHorizon: TemporalHorizon.ACTIVE,
      status: ProjectStatus.IN_PROGRESS,
      priority: PriorityLevel.HIGH,
      progress: 50,
    },
  });

  await prisma.task.create({
    data: {
      projectId: subAnalytics.id,
      title: "Interactive Cumulative Flow Diagram (CFD) for bottleneck detection",
      description: "Visual stacked area chart rendered via D3.js showing task progression across To Do, In Progress, Review, and Done over 30 days.",
      status: TaskStatus.TODO,
      priority: PriorityLevel.HIGH,
      estimatedMinutes: 90,
      dueDate: new Date(Date.now() + 86400000 * 5),
      subtasks: {
        create: [
          { title: "Aggregate daily task status snapshots into historical time-series array", isCompleted: false },
          { title: "Build D3 d3.stack() and d3.area() curve rendering component", isCompleted: false },
          { title: "Add hover tooltip showing exact work-in-progress (WIP) count per column", isCompleted: false },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      projectId: subAnalytics.id,
      title: "Monte Carlo Sprint Completion Date Probability Forecaster",
      description: "Run 1,000 statistical simulations using historical velocity variance to show 50%, 85%, and 95% target delivery confidence dates.",
      status: TaskStatus.TODO,
      priority: PriorityLevel.MEDIUM,
      estimatedMinutes: 60,
      subtasks: {
        create: [
          { title: "Calculate moving standard deviation of completed task points", isCompleted: false },
          { title: "Render confidence interval band on target completion date pill", isCompleted: false },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      projectId: subAnalytics.id,
      title: "Weekly Automated Retrospective & Engineering Velocity Summary",
      description: "Generate structured Markdown retrospectives highlighting shipped items, cycle time velocity, and blockers.",
      status: TaskStatus.DONE,
      priority: PriorityLevel.MEDIUM,
      estimatedMinutes: 40,
      subtasks: {
        create: [
          { title: "Query all tasks marked DONE within the past 7 days", isCompleted: true },
          { title: "Format summary into exportable Markdown changelog", isCompleted: true },
        ],
      },
    },
  });

  // --- SUB-PROJECT 4: Keyboard-First Command OS & GitHub Workflows ---
  const subKeyboard = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      parentId: orbitMaster.id,
      title: "Keyboard-First Command OS & GitHub Workflows",
      description: "Global sequence shortcuts, automatic GitHub branch generator, and custom automation trigger rules.",
      temporalHorizon: TemporalHorizon.ACTIVE,
      status: ProjectStatus.IN_PROGRESS,
      priority: PriorityLevel.HIGH,
      progress: 60,
    },
  });

  await prisma.task.create({
    data: {
      projectId: subKeyboard.id,
      title: "Global Vim-style Hotkey Sequence Engine (G+T, G+P, C, X)",
      description: "Press 'G then T' for Today HUD, 'G then P' for Projects, 'C' to quick-open new task modal, and 'X' to toggle completion.",
      status: TaskStatus.IN_PROGRESS,
      priority: PriorityLevel.HIGH,
      estimatedMinutes: 45,
      dueDate: new Date(Date.now() + 86400000 * 2),
      subtasks: {
        create: [
          { title: "Implement key sequence buffer hook (handles two-key chords)", isCompleted: true },
          { title: "Add keyboard shortcut help overlay modal (press '?' to open)", isCompleted: true },
          { title: "Disable hotkeys automatically when focusing input/textarea elements", isCompleted: false },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      projectId: subKeyboard.id,
      title: "GitHub Branch Generator & CLI integration (orbit checkout <id>)",
      description: "Click 'Copy Git Branch' on any task to get 'git checkout -b feat/orbit-task-123-title' for seamless git hygiene.",
      status: TaskStatus.TODO,
      priority: PriorityLevel.MEDIUM,
      estimatedMinutes: 30,
      subtasks: {
        create: [
          { title: "Generate slugified branch names based on task priority and title", isCompleted: false },
          { title: "Add 1-click clipboard copy button on TaskCard hover", isCompleted: false },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      projectId: subKeyboard.id,
      title: "Custom Event Trigger Automations (Auto-escalate & auto-move)",
      description: "Rule: When all subtasks marked done -> move task to REVIEW. When dueDate is within 24h -> elevate priority to URGENT.",
      status: TaskStatus.TODO,
      priority: PriorityLevel.HIGH,
      estimatedMinutes: 60,
      subtasks: {
        create: [
          { title: "Build rule evaluation hook inside toggleSubtask server action", isCompleted: false },
          { title: "Add toast notification when an automated rule executes", isCompleted: false },
        ],
      },
    },
  });

  // --- SUB-PROJECT 5: Production Security, Multi-Tenant RBAC & Passkeys ---
  const subSecurity = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      parentId: orbitMaster.id,
      title: "Production Security, Multi-Tenant RBAC & Passkeys",
      description: "WebAuthn / Passkey biometric login, role-based workspace permissions, and exportable audit logs.",
      temporalHorizon: TemporalHorizon.ACTIVE,
      status: ProjectStatus.IN_PROGRESS,
      priority: PriorityLevel.HIGH,
      progress: 55,
    },
  });

  await prisma.task.create({
    data: {
      projectId: subSecurity.id,
      title: "WebAuthn / Passkey Biometric Login (FaceID / TouchID / YubiKey)",
      description: "Zero-password secure authentication using hardware-backed WebAuthn credentials and FIDO2.",
      status: TaskStatus.TODO,
      priority: PriorityLevel.HIGH,
      estimatedMinutes: 75,
      dueDate: new Date(Date.now() + 86400000 * 6),
      subtasks: {
        create: [
          { title: "Implement @simplewebauthn/browser registration & verification flow", isCompleted: false },
          { title: "Store public key credentials and counter in PostgreSQL User table", isCompleted: false },
          { title: "Add fallback magic link email authentication", isCompleted: false },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      projectId: subSecurity.id,
      title: "Workspace Member RBAC Permissions (Admin, Member, Guest Viewer)",
      description: "Granular permission gates: Guests can view and comment, Members can manage tasks, Admins can manage billing and workspace settings.",
      status: TaskStatus.TODO,
      priority: PriorityLevel.MEDIUM,
      estimatedMinutes: 45,
      subtasks: {
        create: [
          { title: "Create WorkspaceMember role schema with invitation tokens", isCompleted: false },
          { title: "Add permission check middleware on destructive server actions", isCompleted: false },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      projectId: subSecurity.id,
      title: "Immutable Activity Stream & Audit Trail with CSV/JSON Export",
      description: "Track all entity creations, status shifts, priority escalations, and deletions with timestamps and actor details.",
      status: TaskStatus.DONE,
      priority: PriorityLevel.MEDIUM,
      estimatedMinutes: 35,
      subtasks: {
        create: [
          { title: "Log all project and task mutations in ActivityLog table", isCompleted: true },
          { title: "Build export endpoint for compliance and weekly backup reports", isCompleted: true },
        ],
      },
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
