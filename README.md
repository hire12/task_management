# Orbit

A modular, recursive workspace for active execution and future project pipelines.

Orbit is built for developers and builders who juggle active work alongside an upcoming queue of projects and ideas. Instead of flattening your tasks into endless disconnected lists, Orbit organizes work hierarchically (master initiatives into sub-projects and actionable tasks) across distinct temporal horizons.

---

## Core Concepts

### 1. Temporal Horizons
Work does not all happen at once. Orbit segments your workload into four clear horizons:
- **Active (Now)**: Projects and sub-systems currently under active development.
- **Pipeline (Next)**: Scheduled initiatives ready for execution once active work wraps up.
- **Incubator (Someday)**: Low-pressure backlog for ideas, technical spikes, and exploratory notes.
- **Trophy Room (Shipped)**: Completed initiatives, milestone archives, and changelogs.

### 2. Recursive Hierarchy
Real-world engineering projects break down into modules, services, and subsystems. Orbit allows infinite nesting:
- Master Projects $\rightarrow$ Sub-Projects $\rightarrow$ Tasks $\rightarrow$ Checklist Steps.
- Each sub-project maintains its own status, priorities, and deadlines while rolling up progress automatically to the parent initiative.

### 3. Automated Progress Rollup
When subtasks and child tasks are marked done, the system recalculates progress percentages up the entire hierarchy tree in real time.

### 4. Daily Focus HUD
A dedicated command deck (`/today`) that aggregates high-priority and in-progress tasks across all active projects so you can start each morning with clear priorities.

### 5. D3.js Micro-Sparklines
Inline SVG sparklines powered by D3.js render 14-day completion velocity and trendlines directly inside project cards without third-party chart bloat.

---

## Design System

- **Typography**: Google Lexend for maximum readability on dense dashboards.
- **Iconography**: Phosphor Icons in duotone style for visual depth.
- **Color Philosophy**: A muted, low-contrast palette (soft slate dark mode and warm alabaster light mode) that avoids eye strain during long working sessions.

---

## Tech Stack

- **Framework**: Next.js 15 (React 19 App Router, Server Actions)
- **Database**: PostgreSQL
- **ORM**: Prisma Client & Migrate
- **Styling**: Tailwind CSS
- **Visualization**: D3.js (`d3-shape`, `d3-scale`)
- **Type Safety**: TypeScript 5.7+

---

## Quick Start

### Prerequisites
- Node.js 18.18+ or 20+
- PostgreSQL 14+ running locally or in the cloud

### 1. Clone the repository
```bash
git clone git@github.com:hire12/task_management.git
cd task_management
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/task_os?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Run database migrations & seed sample data
```bash
npx prisma db push
npm run db:seed
```

### 5. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server on port 3000 |
| `npm run build` | Generates Prisma Client and builds the production bundle |
| `npm run start` | Runs the production build |
| `npm run db:push` | Pushes the Prisma schema state directly to PostgreSQL |
| `npm run db:seed` | Populates the database with realistic sample projects and tasks |
| `npm run db:studio` | Opens Prisma Studio web GUI to browse database records |
| `npm run lint` | Runs ESLint type checks across the codebase |

---

## Documentation

- [System Architecture](docs/ARCHITECTURE.md)
- [Getting Started & Local Setup](docs/GETTING_STARTED.md)
- [Contributing Guide](CONTRIBUTING.md)

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
