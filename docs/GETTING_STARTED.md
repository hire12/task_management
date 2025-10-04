# Getting Started with Orbit

A step-by-step guide to setting up Orbit for local development or self-hosting.

---

## System Requirements

- **Node.js**: Version 18.18 or higher (Node 20 or 22 recommended).
- **PostgreSQL**: Version 14, 15, or 16.
- **Git**: Installed and configured.

---

## Step-by-Step Installation

### 1. Clone the repository
```bash
git clone git@github.com:hire12/task_management.git
cd task_management
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create local PostgreSQL database
```bash
# Using psql command line
psql -U postgres -c "CREATE DATABASE task_os;"
```

### 4. Configure environment variables
Create a `.env` file in the project root:
```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/task_os?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Synchronize Prisma schema & seed sample data
```bash
# Push schema to database
npx prisma db push

# Populate initial workspace, projects, and tasks
npm run db:seed
```

### 6. Start the development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure Overview

```
task_management/
├── app/
│   ├── actions/          # Server Actions for Projects, Tasks, and Docs
│   ├── projects/[id]/    # Project hub (Kanban, Sub-projects, Specs)
│   ├── today/            # Daily Focus HUD view
│   ├── globals.css       # Design tokens & muted theme variables
│   ├── layout.tsx        # Application shell layout
│   └── page.tsx          # Horizon dashboard view
├── components/
│   ├── ui/               # Base Button, Badge, Input, Modal primitives
│   ├── D3Sparkline.tsx   # Custom D3.js spline sparkline
│   ├── ProgressRing.tsx  # SVG circular progress indicator
│   ├── KanbanBoard.tsx   # Multi-column task board
│   ├── ProjectCard.tsx   # Project cards with embedded metrics
│   ├── TaskCard.tsx      # Task item with subtask toggles
│   ├── Sidebar.tsx       # Horizon navigation and quick actions
│   └── Header.tsx        # Breadcrumbs, search trigger, theme toggle
├── docs/                 # Technical documentation
├── lib/
│   ├── db.ts             # Prisma client singleton
│   ├── types.ts          # Shared TypeScript models
│   └── utils.ts          # Formatting and helper utilities
├── prisma/
│   ├── schema.prisma     # PostgreSQL relational schema
│   └── seed.ts           # Development seed script
├── tailwind.config.ts    # Tailwind theme & token configurations
└── tsconfig.json         # TypeScript configuration
```
