import { getProjects, getWorkspaces } from "@/app/actions/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { TemporalHorizon, ProjectStatus } from "@prisma/client";
import {
  Lightning,
  CalendarBlank,
  Lightbulb,
  Trophy,
  Kanban,
  CheckCircle,
  Clock,
} from "@phosphor-icons/react/dist/ssr";
import { D3Sparkline } from "@/components/D3Sparkline";

interface PageProps {
  searchParams: Promise<{ horizon?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const horizon = (params.horizon as TemporalHorizon) || TemporalHorizon.ACTIVE;

  const workspaces = await getWorkspaces();
  const defaultWorkspace = workspaces[0];
  const allProjects = await getProjects(defaultWorkspace?.id, horizon);

  // Separate master projects (parentId is null) from sub-projects
  const masterProjects = allProjects.filter((p) => !p.parentId);

  // Compute horizon stats
  const totalTasks = allProjects.reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
  const completedTasks = allProjects.reduce(
    (acc, p) => acc + (p.tasks?.filter((t) => t.status === "DONE").length || 0),
    0
  );

  const horizonHeaders: Record<
    TemporalHorizon,
    { title: string; subtitle: string; icon: any }
  > = {
    ACTIVE: {
      title: "Active Execution (Now)",
      subtitle: "Initiatives and deliverables currently in progress.",
      icon: Lightning,
    },
    FUTURE: {
      title: "Upcoming Pipeline (Next)",
      subtitle: "Planned projects queued for future development.",
      icon: CalendarBlank,
    },
    IDEA: {
      title: "Idea Incubator (Someday)",
      subtitle: "Exploratory concepts, experiments, and backlog sparks.",
      icon: Lightbulb,
    },
    SHIPPED: {
      title: "Trophy Room (Shipped)",
      subtitle: "Completed initiatives, launch archives, and retrospectives.",
      icon: Trophy,
    },
  };

  const currentHeader = horizonHeaders[horizon] || horizonHeaders.ACTIVE;
  const HeaderIcon = currentHeader.icon;

  const velocityPoints = [3, 4, 6, 5, 8, 7, 9, 12, 10, 14, 13, 16, 15, 18];

  return (
    <div className="flex flex-col gap-8">
      {/* Top Banner with Stats & Horizon Definition */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/70 pb-6">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-surface border border-border text-accent shadow-card mt-0.5">
            <HeaderIcon weight="duotone" className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold text-content-primary tracking-tight">
              {currentHeader.title}
            </h1>
            <p className="text-[14px] text-content-secondary mt-0.5">
              {currentHeader.subtitle}
            </p>
          </div>
        </div>

        {/* Top Micro Metrics & D3 Sparkline */}
        <div className="flex items-center gap-5 bg-surface rounded-xl border border-border p-3.5 shadow-card self-start md:self-auto">
          <div className="flex flex-col">
            <span className="text-[11.5px] font-medium text-content-placeholder">
              Completion Rate
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[18px] font-bold text-content-primary font-mono">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </span>
              <span className="text-[12px] text-content-secondary">
                ({completedTasks}/{totalTasks} tasks)
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-border/60" />

          <div className="flex flex-col">
            <span className="text-[11.5px] font-medium text-content-placeholder">
              14-Day Velocity
            </span>
            <div className="mt-1">
              <D3Sparkline data={velocityPoints} width={80} height={22} color="var(--color-accent)" />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Kanban weight="duotone" className="w-4 h-4 text-content-secondary" />
            <h2 className="text-[15px] font-semibold text-content-primary tracking-tight">
              Projects ({masterProjects.length})
            </h2>
          </div>
        </div>

        {masterProjects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-surface-muted text-content-placeholder">
              <HeaderIcon weight="duotone" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[14.5px] font-medium text-content-primary">
                No projects in this horizon yet
              </p>
              <p className="text-[13px] text-content-secondary mt-0.5 max-w-sm">
                Create a new master project or change the temporal horizon to start organizing your work.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {masterProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
