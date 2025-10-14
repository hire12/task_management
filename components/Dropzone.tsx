"use client";

import React, { useState, useRef } from "react";
import { UploadSimple, CircleNotch, Image as ImageIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface DropzoneProps {
  onFilesDrop: (files: File[]) => void;
  isUploading?: boolean;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  className?: string;
  label?: string;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFilesDrop,
  isUploading = false,
  maxSizeMB = 10,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"],
  className,
  label = "Drag & drop screenshots or click to attach images",
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setErrorMsg(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles: File[] = [];
      let hasInvalid = false;

      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i];
        if (acceptedTypes.includes(file.type)) {
          validFiles.push(file);
        } else {
          hasInvalid = true;
        }
      }

      if (hasInvalid) {
        setErrorMsg("Only image files (PNG, JPG, WebP, GIF, SVG) are supported.");
      }

      if (validFiles.length > 0) {
        onFilesDrop(validFiles);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesDrop(Array.from(e.target.files));
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isUploading && inputRef.current?.click()}
      className={cn(
        "relative rounded-xl border border-dashed border-border/80 p-5 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200",
        isDragOver
          ? "border-accent bg-accent/5 ring-2 ring-accent/20 scale-[1.01]"
          : "hover:border-accent hover:bg-surface-muted/30",
        isUploading && "cursor-wait opacity-80",
        className
      )}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept={acceptedTypes.join(",")}
        multiple
        className="hidden"
      />

      {isUploading ? (
        <div className="flex flex-col items-center gap-2">
          <CircleNotch weight="bold" className="w-6 h-6 text-accent animate-spin" />
          <span className="text-[12.5px] font-medium text-accent">Compressing & uploading...</span>
        </div>
      ) : (
        <>
          <div className="p-2 rounded-full bg-surface-muted text-content-secondary group-hover:text-accent transition-colors">
            {isDragOver ? (
              <UploadSimple weight="bold" className="w-5 h-5 text-accent animate-bounce" />
            ) : (
              <ImageIcon weight="duotone" className="w-5 h-5" />
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[12.5px] font-medium text-content-primary">
              {isDragOver ? "Drop image now!" : label}
            </span>
            <span className="text-[11px] text-content-placeholder">
              PNG, JPG, WebP, SVG up to {maxSizeMB}MB
            </span>
            {errorMsg && (
              <span className="text-[11.5px] text-brandDanger font-medium mt-1">
                {errorMsg}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};
