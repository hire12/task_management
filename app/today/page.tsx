import { getTodayTasks } from "@/app/actions/tasks";
import { TaskCard } from "@/components/TaskCard";
import { D3Sparkline } from "@/components/D3Sparkline";
import { Lightning, CheckCircle, WarningCircle, Clock } from "@phosphor-icons/react/dist/ssr";

export default async function TodayPage() {
  const tasks = await getTodayTasks();

  const urgentTasks = tasks.filter(
    (t) => (t.priority === "HIGH" || t.priority === "URGENT") && t.status !== "DONE"
  );
  const inProgressTasks = tasks.filter(
    (t) => t.status === "IN_PROGRESS" && t.priority !== "HIGH" && t.priority !== "URGENT"
  );
  const remainingTasks = tasks.filter(
    (t) => t.status !== "DONE" && t.status !== "IN_PROGRESS" && t.priority !== "HIGH" && t.priority !== "URGENT"
  );
  const completedTasks = tasks.filter((t) => t.status === "DONE");

  const total = tasks.length;
  const completed = completedTasks.length;
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
            <h1 className="text-[22px] font-semibold text-content-primary tracking-tight">
              Today's Daily Focus HUD
            </h1>
            <p className="text-[14px] text-content-secondary mt-0.5">
              Aggregated high-leverage tasks across all active projects.
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

      {/* Task Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Urgent / High Priority Focus */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <WarningCircle weight="duotone" className="w-4 h-4 text-brandDanger" />
              <h2 className="text-[14px] font-semibold text-content-primary tracking-tight">
                High Priority & Urgent
              </h2>
            </div>
            <span className="text-[11px] font-mono rounded bg-surface px-1.5 py-0.5 text-content-placeholder border border-border">
              {urgentTasks.length}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {urgentTasks.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/70 p-4 text-center text-[12.5px] text-content-placeholder">
                No urgent tasks pending
              </div>
            ) : (
              urgentTasks.map((t) => (
                <TaskCard key={t.id} task={t} showProjectName />
              ))
            )}
          </div>
        </div>

        {/* Active In Progress */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Clock weight="duotone" className="w-4 h-4 text-brandWarning" />
              <h2 className="text-[14px] font-semibold text-content-primary tracking-tight">
                In Progress (Active)
              </h2>
            </div>
            <span className="text-[11px] font-mono rounded bg-surface px-1.5 py-0.5 text-content-placeholder border border-border">
              {inProgressTasks.length}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {inProgressTasks.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/70 p-4 text-center text-[12.5px] text-content-placeholder">
                No active tasks in progress
              </div>
            ) : (
              inProgressTasks.map((t) => (
                <TaskCard key={t.id} task={t} showProjectName />
              ))
            )}
          </div>
        </div>

        {/* Queue & Completed */}
        <div className="flex flex-col gap-5">
          {/* Queue */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-content-primary tracking-tight">
                  Next in Queue
                </span>
              </div>
              <span className="text-[11px] font-mono rounded bg-surface px-1.5 py-0.5 text-content-placeholder border border-border">
                {remainingTasks.length}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {remainingTasks.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border/70 p-4 text-center text-[12.5px] text-content-placeholder">
                  All queued tasks cleared
                </div>
              ) : (
                remainingTasks.map((t) => (
                  <TaskCard key={t.id} task={t} showProjectName />
                ))
              )}
            </div>
          </div>

          {/* Completed Today */}
          {completedTasks.length > 0 && (
            <div className="flex flex-col gap-3 pt-4 border-t border-border/60">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <CheckCircle weight="duotone" className="w-4 h-4 text-brandSuccess" />
                  <span className="text-[14px] font-semibold text-content-secondary tracking-tight">
                    Completed Today
                  </span>
                </div>
                <span className="text-[11px] font-mono rounded bg-surface px-1.5 py-0.5 text-content-placeholder border border-border">
                  {completedTasks.length}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {completedTasks.map((t) => (
                  <TaskCard key={t.id} task={t} showProjectName />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
