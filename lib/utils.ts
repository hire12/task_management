import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.round((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 1 && diffDays < 7) return `in ${diffDays} days`;
  if (diffDays < -1 && diffDays > -7) return `${Math.abs(diffDays)}d overdue`;

  return formatDate(d);
}

// Generate realistic mock 14-day activity sparkline points
export function generateSparklineData(completedCount: number = 5, totalCount: number = 10): number[] {
  const points: number[] = [];
  let current = Math.max(1, Math.floor(completedCount * 0.3));
  for (let i = 0; i < 14; i++) {
    const delta = Math.floor(Math.sin(i * 0.5) * 2) + (i > 8 ? 1 : 0);
    current = Math.max(0, Math.min(totalCount, current + delta));
    points.push(current);
  }
  return points;
}
