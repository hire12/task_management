import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressRingProps {
  progress: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  showText?: boolean;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress = 0,
  size = 28,
  strokeWidth = 3,
  color = "var(--color-accent)",
  showText = false,
  className,
}) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>
      {showText && (
        <span className="text-[12px] font-medium text-content-secondary tabular-nums">
          {Math.round(normalizedProgress)}%
        </span>
      )}
    </div>
  );
};
