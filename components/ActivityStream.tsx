"use client";

import React from "react";
import { Pulse, Clock, CheckCircle, PlusCircle, PencilSimple } from "@phosphor-icons/react";
import { FullTask } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";

interface ActivityStreamProps {
  tasks: FullTask[];
}

export const ActivityStream: React.FC<ActivityStreamProps> = ({ tasks }) => {
  // Synthesize activity stream items from task events
  const events = tasks.flatMap((t) => [
    {
      id: `ev-created-${t.id}`,
      type: "created",
      title: `Created task "${t.title}"`,
      date: new Date(t.createdAt),
      icon: PlusCircle,
      color: "text-accent",
    },
    {
      id: `ev-updated-${t.id}`,
      type: t.status === "DONE" ? "completed" : "updated",
      title: t.status === "DONE" ? `Completed task "${t.title}"` : `Updated task "${t.title}"`,
      date: new Date(t.updatedAt),
      icon: t.status === "DONE" ? CheckCircle : PencilSimple,
      color: t.status === "DONE" ? "text-brandSuccess" : "text-brandWarning",
    },
  ]).sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);

  return (
    <div className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between pb-2 border-b border-border/80">
        <div className="flex items-center gap-2">
          <Pulse weight="duotone" className="w-4 h-4 text-accent" />
          <span className="text-[13px] font-semibold text-content-primary">
            Workspace Activity Stream
          </span>
        </div>
        <span className="text-[11px] text-content-placeholder">Last 10 events</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {events.map((ev) => {
          const Icon = ev.icon;
          return (
            <div key={ev.id} className="flex items-start gap-2.5 text-[12px]">
              <Icon weight="fill" className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${ev.color}`} />
              <div className="flex-1 flex items-center justify-between gap-2">
                <span className="text-content-secondary truncate">{ev.title}</span>
                <span className="text-[11px] text-content-placeholder shrink-0 font-mono">
                  {formatRelativeDate(ev.date)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
