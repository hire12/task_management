# Architecture & Technical Design

This document details the internal architecture, database design, and data flow of Orbit.

---

## 1. Domain Model & Hierarchy

Orbit models work hierarchically rather than as flat lists.

```
Workspace
 └── Master Project (parentId = null)
      ├── Sub-Project A (parentId = Master.id)
      │    ├── Task 1
      │    │    ├── Step 1 (Subtask)
      │    │    └── Step 2 (Subtask)
      │    └── Task 2
      └── Sub-Project B
           └── Task 3
```

### Self-Referencing Recursive Relation
In Prisma (`prisma/schema.prisma`):
```prisma
model Project {
  id          String   @id @default(uuid())
  workspaceId String
  parentId    String?
  parent      Project?  @relation("ProjectToSubProjects", fields: [parentId], references: [id], onDelete: Cascade)
  subProjects Project[] @relation("ProjectToSubProjects")
  ...
}
```
This enables infinite nesting of subsystems, microservices, or milestones without requiring separate tables for each level of hierarchy.

---

## 2. Temporal Horizons

Every project belongs to one of four temporal horizons:
- `ACTIVE`: Work actively being developed.
- `FUTURE`: Planned pipeline work with scheduled start dates.
- `IDEA`: Raw concepts, technical spikes, and backlog notes.
- `SHIPPED`: Finished initiatives archived with retrospectives.

Switching a project's horizon moves its entire sub-tree cleanly into the corresponding view.

---

## 3. Automated Progress Rollup

The progress calculation engine (`app/actions/projects.ts` -> `recalculateProjectProgress`) ensures parent projects always reflect child task completion:

1. Gathers all direct tasks belonging to the project.
2. Recursively gathers tasks across all nested sub-projects.
3. Computes `completedUnits / totalUnits * 100`.
4. Updates the project's `progress` column.
5. If the project has a parent, triggers recalculation upward to the root.

---

## 4. D3.js Micro-Sparkline Architecture

Rather than loading large charting libraries (e.g. Chart.js, Recharts), Orbit uses a lightweight D3 component (`components/D3Sparkline.tsx`):
- Uses `d3.scaleLinear()` for normalized coordinate scaling.
- Generates smooth spline curves with `d3.curveMonotoneX`.
- Emits clean SVG `<path>` elements with responsive area gradient fills and pulsing end-point anchors.
- Renders in under 1ms per card with zero canvas overhead.

---

## 5. Server Actions & State Flow

Data operations use Next.js Server Actions (`app/actions/`):
- `projects.ts`: CRUD, status updates, horizon switching, progress rollup.
- `tasks.ts`: Task creation, status cycling, subtask toggling.
- `docs.ts`: Markdown specs storage and auto-saving.

Path revalidations (`revalidatePath`) ensure that UI views reflect database state instantly without client-side stale caches.
