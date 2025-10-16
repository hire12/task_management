"use client";

import React, { useState, useRef } from "react";
import { Image as ImageIcon, Trash, Camera, CircleNotch } from "@phosphor-icons/react";
import { setProjectBanner, removeProjectBanner } from "@/app/actions/projects";
import { compressImage } from "@/lib/image";
import { cn } from "@/lib/utils";

interface ProjectBannerProps {
  projectId: string;
  bannerUrl?: string | null;
  editable?: boolean;
}

export const ProjectBanner: React.FC<ProjectBannerProps> = ({
  projectId,
  bannerUrl: initialBannerUrl,
  editable = true,
}) => {
  const [bannerUrl, setBannerUrl] = useState<string | null>(initialBannerUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const compressed = await compressImage(file, { maxWidth: 2560, quality: 0.85 });
      const formData = new FormData();
      formData.append("file", compressed);
      formData.append("projectId", projectId);
      formData.append("isBanner", "true");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (data.url) {
        setBannerUrl(data.url);
        await setProjectBanner(projectId, data.url);
      }
    } catch (err) {
      console.error("Banner upload error:", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (window.confirm("Remove this project banner?")) {
      setBannerUrl(null);
      await removeProjectBanner(projectId);
    }
  };

  if (!bannerUrl && !editable) return null;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden group mb-6 border border-border/60 bg-surface-muted/20">
      {bannerUrl ? (
        <div className="relative h-44 sm:h-52 w-full overflow-hidden">
          <img
            src={bannerUrl}
            alt="Project Banner"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {/* Subtle gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      ) : (
        <div className="h-28 w-full border border-dashed border-border/80 flex items-center justify-center bg-gradient-to-r from-accent/10 via-surface-muted/40 to-brandSuccess/10 text-content-placeholder rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="relative z-10 flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border/80 bg-surface/90 backdrop-blur-xs text-[12.5px] font-medium text-content-primary hover:bg-surface hover:border-accent transition-all cursor-pointer shadow-sm"
          >
            {isUploading ? (
              <CircleNotch weight="bold" className="w-4 h-4 animate-spin text-accent" />
            ) : (
              <Camera weight="bold" className="w-4 h-4 text-accent" />
            )}
            <span>{isUploading ? "Compressing & Uploading..." : "Add Project Cover Banner"}</span>
          </button>
        </div>
      )}

      {/* Floating Action Controls on Hover */}
      {editable && bannerUrl && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            title="Change banner"
            className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-xs text-white hover:bg-black text-[11.5px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {isUploading ? (
              <CircleNotch weight="bold" className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Camera weight="bold" className="w-3.5 h-3.5" />
            )}
            <span>Change</span>
          </button>

          <button
            onClick={handleRemove}
            title="Remove banner"
            className="p-1.5 rounded-md bg-black/70 backdrop-blur-xs text-white hover:bg-brandDanger transition-colors cursor-pointer"
          >
            <Trash weight="bold" className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
