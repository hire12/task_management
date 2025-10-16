"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface CardCoverProps {
  url: string;
  alt: string;
  aspectRatio?: "banner" | "wide" | "square";
  fit?: "cover" | "contain";
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const CardCover: React.FC<CardCoverProps> = ({
  url,
  alt,
  aspectRatio = "wide",
  fit = "cover",
  className,
  onClick,
}) => {
  const [loaded, setLoaded] = useState(false);

  const aspectClasses = {
    banner: "aspect-[3/1] min-h-[90px]",
    wide: "aspect-[2.4/1] min-h-[110px]",
    square: "aspect-square min-h-[140px]",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative w-full overflow-hidden bg-surface-muted/40 transition-colors",
        aspectClasses[aspectRatio],
        className
      )}
    >
      {!loaded && (
        <div className="absolute inset-0 bg-surface-muted animate-pulse" />
      )}
      <img
        src={url}
        alt={alt}
        draggable={false}
        onLoad={() => setLoaded(true)}
        className={cn(
          "w-full h-full transition-all duration-300 pointer-events-none select-none",
          fit === "contain" ? "object-contain bg-black/20" : "object-cover",
          loaded ? "opacity-100 group-hover:scale-105" : "opacity-0"
        )}
      />
    </div>
  );
};
