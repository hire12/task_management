"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, ArrowCounterClockwise, Timer } from "@phosphor-icons/react";
import { updateTask } from "@/app/actions/tasks";
import { cn } from "@/lib/utils";

interface TaskTimerProps {
  taskId: string;
  initialMinutes?: number | null;
  onTimeUpdated?: (minutes: number) => void;
}

export const TaskTimer: React.FC<TaskTimerProps> = ({
  taskId,
  initialMinutes = 0,
  onTimeUpdated,
}) => {
  const [seconds, setSeconds] = useState((initialMinutes || 0) * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleToggle = async () => {
    if (isRunning) {
      // Save minutes when pausing
      const mins = Math.max(1, Math.round(seconds / 60));
      await updateTask(taskId, { estimatedMinutes: mins });
      onTimeUpdated?.(mins);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/80 bg-surface-muted/30 text-content-primary">
      <Timer weight="duotone" className={cn("w-4 h-4", isRunning ? "text-brandSuccess animate-pulse" : "text-content-placeholder")} />
      <span className="font-mono text-[13px] font-semibold tracking-wider">
        {formatTime(seconds)}
      </span>

      <button
        onClick={handleToggle}
        className={cn(
          "p-1 rounded hover:bg-surface-muted transition-colors cursor-pointer ml-1",
          isRunning ? "text-brandWarning" : "text-brandSuccess"
        )}
        title={isRunning ? "Pause timer" : "Start timer"}
      >
        {isRunning ? <Pause weight="bold" className="w-3.5 h-3.5" /> : <Play weight="bold" className="w-3.5 h-3.5" />}
      </button>

      <button
        onClick={handleReset}
        className="p-1 rounded text-content-placeholder hover:text-content-primary hover:bg-surface-muted transition-colors cursor-pointer"
        title="Reset timer"
      >
        <ArrowCounterClockwise weight="bold" className="w-3 h-3" />
      </button>
    </div>
  );
};
