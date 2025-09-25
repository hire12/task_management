import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "purple" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "sm",
  className,
}) => {
  const variants = {
    default: "bg-surface-muted text-content-secondary border border-border/60",
    success: "bg-brandSuccess/12 text-brandSuccess border border-brandSuccess/25",
    warning: "bg-brandWarning/12 text-brandWarning border border-brandWarning/25",
    danger: "bg-brandDanger/12 text-brandDanger border border-brandDanger/25",
    purple: "bg-brandPurple/12 text-brandPurple border border-brandPurple/25",
    neutral: "bg-surface-muted/60 text-content-placeholder border border-border/40",
  };

  const sizes = {
    sm: "text-[11px] px-2 py-0.5 rounded-[4px] font-medium tracking-tight",
    md: "text-[12px] px-2.5 py-1 rounded-[5px] font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 leading-none transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};
