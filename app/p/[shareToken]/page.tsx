import React from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Planet, Lock, ShieldCheck, CheckSquare, Image as ImageIcon } from "@phosphor-icons/react/dist/ssr";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

interface GuestPortalProps {
  params: Promise<{ shareToken: string }>;
}

export default async function GuestPortalPage({ params }: GuestPortalProps) {
  const { shareToken } = await params;

  // Lookup project by shareToken
  const project = await db.project.findFirst({
    where: {
      shareToken,
      isPublic: true,
    },
    include: {
      tasks: {
        include: {
          subtasks: true,
          attachments: true,
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const columns = [
    { status: "BACKLOG", label: "Backlog", color: "#64748B" },
    { status: "TODO", label: "To Do", color: "#3B82F6" },
    { status: "IN_PROGRESS", label: "In Progress", color: "#F59E0B" },
    { status: "REVIEW", label: "Review", color: "#8B5CF6" },
    { status: "DONE", label: "Done", color: "#10B981" },
  ];

  const completedCount = project.tasks.filter((t) => t.status === "DONE").length;
  const progressPercent = project.tasks.length > 0 ? Math.round((completedCount / project.tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-canvas text-content-primary flex flex-col">
      {/* Client Header */}
      <header className="h-16 border-b border-border bg-surface px-6 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent text-accent-fg flex items-center justify-center shadow-card">
            <Planet weight="duotone" className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-content-primary">
              {project.title}
            </span>
            <span className="text-[11px] text-content-secondary flex items-center gap-1">
              <ShieldCheck weight="fill" className="w-3 h-3 text-success" />
              <span>Live Guest View · Read Only</span>
            </span>
          </div>
        </div>

        {/* Progress Pill */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-xs font-semibold text-content-primary">
              {completedCount} of {project.tasks.length} tasks completed
            </span>
            <span className="text-[10px] text-content-placeholder">
              {progressPercent}% sprint completion
            </span>
          </div>
          <div className="w-20 h-2 rounded-full bg-border overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Kanban Board Container */}
      <main className="flex-1 p-6 overflow-x-auto flex gap-6 items-start">
        {columns.map((col) => {
          const colTasks = project.tasks.filter((t) => t.status === col.status);
          return (
            <div
              key={col.status}
              className="w-80 shrink-0 rounded-2xl border border-border bg-surface/80 p-3.5 flex flex-col gap-3 shadow-card"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border/80">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: col.color }}
                  />
                  <span className="text-xs font-bold text-content-primary">
                    {col.label}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-raised border border-border text-[10px] font-semibold text-content-secondary">
                  {colTasks.length}
                </span>
              </div>

              <div className="flex flex-col gap-2.5 max-h-[calc(100vh-12rem)] overflow-y-auto pr-0.5">
                {colTasks.length === 0 ? (
                  <div className="py-6 text-center text-xs text-content-placeholder border border-dashed border-border/60 rounded-xl">
                    No tasks in {col.label}
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const cover = task.attachments.find((a) => a.isCover) || task.attachments[0];
                    const doneSubtasks = task.subtasks.filter((s) => s.isDone).length;
                    return (
                      <div
                        key={task.id}
                        className="rounded-xl border border-border bg-surface p-3.5 shadow-2xs flex flex-col gap-2.5"
                      >
                        {cover && (
                          <div className="w-full aspect-video rounded-lg overflow-hidden bg-black/5 relative border border-border/60">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={cover.url}
                              alt={cover.filename}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <span className="text-xs font-semibold text-content-primary leading-snug">
                          {task.title}
                        </span>

                        {task.description && (
                          <div className="text-[11px] text-content-secondary line-clamp-2">
                            <MarkdownRenderer content={task.description} />
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px] text-content-placeholder">
                          {task.subtasks.length > 0 ? (
                            <div className="flex items-center gap-1 text-content-secondary">
                              <CheckSquare className="w-3.5 h-3.5" />
                              <span>
                                {doneSubtasks}/{task.subtasks.length}
                              </span>
                            </div>
                          ) : (
                            <div />
                          )}

                          {task.attachments.length > 0 && (
                            <div className="flex items-center gap-1 text-content-secondary">
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>{task.attachments.length}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
