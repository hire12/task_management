"use client";

import React, { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            "w-full rounded-md border border-border bg-surface px-3 py-1.5 text-[14px] text-content-primary placeholder:text-content-placeholder transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50",
            error && "border-brandDanger focus:border-brandDanger focus:ring-brandDanger",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-[12px] text-brandDanger">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            "w-full rounded-md border border-border bg-surface px-3 py-2 text-[14px] text-content-primary placeholder:text-content-placeholder transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50 min-h-[80px]",
            error && "border-brandDanger focus:border-brandDanger focus:ring-brandDanger",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-[12px] text-brandDanger">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
