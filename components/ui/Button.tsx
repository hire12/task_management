"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer";

    const variants = {
      primary:
        "bg-accent text-white hover:bg-accent-hover active:scale-[0.98] shadow-sm",
      secondary:
        "bg-surface-muted text-content-primary hover:bg-border/50 active:scale-[0.98]",
      outline:
        "border border-border bg-surface text-content-primary hover:bg-surface-muted active:scale-[0.98]",
      ghost:
        "text-content-secondary hover:text-content-primary hover:bg-surface-muted active:scale-[0.98]",
      danger:
        "bg-brandDanger/10 text-brandDanger hover:bg-brandDanger/20 active:scale-[0.98]",
    };

    const sizes = {
      sm: "text-[13px] px-2.5 py-1 gap-1.5 h-7",
      md: "text-[14px] px-3.5 py-1.5 gap-2 h-9",
      lg: "text-[15px] px-5 py-2.5 gap-2.5 h-11",
      icon: "h-8 w-8 p-0 rounded-md",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
