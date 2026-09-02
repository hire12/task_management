import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserWorkspaces, ensurePersonalWorkspace } from "@/lib/workspace";
import { getTodayTasks } from "@/app/actions/tasks";
import { TodayHUD } from "@/components/TodayHUD";
import { D3Sparkline } from "@/components/D3Sparkline";
import { Lightning } from "@phosphor-icons/react/dist/ssr";

interface PageProps {
  searchParams: Promise<{ workspaceId?: string }>;
}

export default async function TodayPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/today");
  }

  let workspaces = await getUserWorkspaces(session.user.id);
  if (workspaces.length === 0) {
    await ensurePersonalWorkspace(session.user.id, session.user.name || "Personal");
    workspaces = await getUserWorkspaces(session.user.id);
  }

  const requestedWorkspace = params.workspaceId
    ? workspaces.find((w) => w.id === params.workspaceId)
    : null;
  const activeWorkspace = requestedWorkspace || workspaces[0];

  const tasks = activeWorkspace ? await getTodayTasks(activeWorkspace.id) : [];

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "DONE").length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const sparklineData = [2, 3, 5, 4, 6, 8, 7, 10, 9, 12, 11, 14, 13, 15];

  return (
    <div className="flex flex-col gap-8">
      {/* Header Banner with Today HUD Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/70 pb-6">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-surface border border-border text-brandSuccess shadow-card mt-0.5">
            <Lightning weight="duotone" className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/20">
                {activeWorkspace?.name || "Personal Space"}
              </span>
            </div>
            <h1 className="text-[22px] font-semibold text-content-primary tracking-tight">
              Today&apos;s Daily Focus HUD
            </h1>
            <p className="text-[14px] text-content-secondary mt-0.5">
              Aggregated high-leverage tasks across active projects in this workspace.
            </p>
          </div>
        </div>

        {/* HUD Quick Stats Card */}
        <div className="flex items-center gap-5 bg-surface rounded-xl border border-border p-3.5 shadow-card">
          <div className="flex flex-col">
            <span className="text-[11.5px] font-medium text-content-placeholder">
              Daily Progress
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[18px] font-bold text-content-primary font-mono">
                {progress}%
              </span>
              <span className="text-[12px] text-content-secondary">
                ({completed}/{total} done)
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-border/60" />

          <div className="flex flex-col">
            <span className="text-[11.5px] font-medium text-content-placeholder">
              Completion Trend
            </span>
            <div className="mt-1">
              <D3Sparkline
                data={sparklineData}
                width={80}
                height={22}
                color="var(--color-success)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Task Sections with Full Detail Modal Support */}
      <TodayHUD tasks={tasks} />
    </div>
  );
}
