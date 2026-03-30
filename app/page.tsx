import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { LandingPage } from "@/components/landing/LandingPage";
import { getUserWorkspaces, ensurePersonalWorkspace } from "@/lib/workspace";
import { getProjects } from "@/app/actions/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { TemporalHorizon } from "@prisma/client";
import {
  Lightning,
  CalendarBlank,
  Lightbulb,
  Trophy,
} from "@phosphor-icons/react/dist/ssr";
import { D3Sparkline } from "@/components/D3Sparkline";

interface PageProps {
  searchParams: Promise<{ horizon?: string; workspaceId?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If visitor is NOT authenticated, display the public landing page with CTA & Login/Signup!
  if (!session?.user) {
    return <LandingPage />;
  }

  // User is authenticated -> enforce strict multi-tenancy & workspace isolation
  let workspaces = await getUserWorkspaces(session.user.id);
  if (workspaces.length === 0) {
    await ensurePersonalWorkspace(session.user.id, session.user.name || "Personal");
    workspaces = await getUserWorkspaces(session.user.id);
  }

  // Active workspace validation: ensure requested workspace belongs to user
  const requestedWorkspace = params.workspaceId
    ? workspaces.find((w) => w.id === params.workspaceId)
    : null;
  const activeWorkspace = requestedWorkspace || workspaces[0];

  const horizon = (params.horizon as TemporalHorizon) || TemporalHorizon.ACTIVE;
  const allProjects = await getProjects(activeWorkspace.id, horizon);
  const masterProjects = allProjects.filter((p) => !p.parentId);

  // Compute stats
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
      subtitle: `Initiatives currently in progress in ${activeWorkspace.name}.`,
      icon: Lightning,
    },
    FUTURE: {
      title: "Upcoming Pipeline (Next)",
      subtitle: `Planned projects queued for future development in ${activeWorkspace.name}.`,
      icon: CalendarBlank,
    },
    IDEA: {
      title: "Idea Incubator (Someday)",
      subtitle: `Exploratory concepts and backlog sparks in ${activeWorkspace.name}.`,
      icon: Lightbulb,
    },
    SHIPPED: {
      title: "Trophy Room (Shipped)",
      subtitle: `Completed initiatives and launch retrospectives in ${activeWorkspace.name}.`,
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
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">
                {activeWorkspace.type === "PERSONAL" ? "Personal Space" : "Team Space"}
              </span>
              <span className="text-xs text-content-placeholder font-medium">
                {activeWorkspace.name}
              </span>
            </div>
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

          <div className="h-8 w-[1px] bg-border" />

          <div className="flex flex-col">
            <span className="text-[11.5px] font-medium text-content-placeholder">
              Velocity
            </span>
            <div className="mt-1">
              <D3Sparkline
                data={velocityPoints}
                width={80}
                height={22}
                color="var(--color-accent)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {masterProjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-content-placeholder shadow-xs">
            <HeaderIcon weight="duotone" className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <h3 className="text-base font-semibold text-content-primary">
              No initiatives in this horizon
            </h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              Create a new initiative or shift active projects to populate your {currentHeader.title.toLowerCase()}.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {masterProjects.map((project) => (
            <ProjectCard key={project.id} project={project as any} />
          ))}
        </div>
      )}
    </div>
  );
}
