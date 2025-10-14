"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CaretLeft,
  CaretRight,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  ArrowsCounterClockwise,
  DownloadSimple,
  LinkSimple,
  Check,
  ArrowsOut,
  ArrowsIn,
} from "@phosphor-icons/react";
import { formatBytes } from "@/lib/image";
import { cn } from "@/lib/utils";

export interface LightboxImage {
  id: string;
  url: string;
  filename: string;
  fileSize?: number;
  mimeType?: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoom(1);
  }, [initialIndex, isOpen]);

  // Lock background scroll when open
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-") {
        handleZoomOut();
      } else if (e.key === "0") {
        handleZoomReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handleNext = () => {
    setZoom(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setZoom(1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleZoomReset = () => {
    setZoom(1);
  };

  const handleCopyLink = async () => {
    if (typeof window === "undefined") return;
    const fullUrl = `${window.location.origin}${currentImage.url}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Could not copy link:", err);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Previewing image ${currentImage.filename}`}
      className="fixed inset-0 z-50 flex items-center justify-center select-none animate-fade-in"
    >
      {/* Dim Backdrop */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md cursor-pointer transition-opacity"
        onClick={onClose}
      />

      {/* Top Controls Bar */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between px-6 z-10 text-white">
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-medium tracking-tight truncate max-w-sm">
            {currentImage.filename}
          </span>
          {currentImage.fileSize && (
            <span className="text-[12px] font-mono text-white/60">
              ({formatBytes(currentImage.fileSize)})
            </span>
          )}
          {currentImage.mimeType && (
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-white/10 text-white/70">
              {currentImage.mimeType.split("/")[1]?.toUpperCase() || "IMG"}
            </span>
          )}
          {images.length > 1 && (
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[11px] font-mono text-white/80">
              {currentIndex + 1} / {images.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            title="Copy image link"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
          >
            {copied ? (
              <Check weight="bold" className="w-4 h-4 text-brandSuccess" />
            ) : (
              <LinkSimple weight="bold" className="w-4 h-4" />
            )}
          </button>
          <a
            href={currentImage.url}
            download={currentImage.filename}
            title="Download image"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
          >
            <DownloadSimple weight="bold" className="w-4 h-4" />
          </a>
          <button
            onClick={handleToggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
          >
            {isFullscreen ? (
              <ArrowsIn weight="bold" className="w-4 h-4" />
            ) : (
              <ArrowsOut weight="bold" className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onClose}
            title="Close (Esc)"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>

        {copied && (
          <div className="absolute top-16 right-6 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-brandSuccess/40 text-[11.5px] font-medium text-brandSuccess flex items-center gap-1.5 shadow-raised animate-fade-in">
            <Check weight="bold" className="w-3.5 h-3.5" />
            <span>Link copied to clipboard!</span>
          </div>
        )}
      </div>

      {/* Left/Right Navigation Carets */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            title="Previous image (Left Arrow)"
            className="absolute left-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors z-10 cursor-pointer shadow-raised"
          >
            <CaretLeft weight="bold" className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            title="Next image (Right Arrow)"
            className="absolute right-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors z-10 cursor-pointer shadow-raised"
          >
            <CaretRight weight="bold" className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Center Image Container */}
      <div
        className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center overflow-hidden z-0"
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={() => setZoom((prev) => (prev === 1 ? 2 : 1))}
        title="Double-click to toggle zoom"
      >
        <img
          src={currentImage.url}
          alt={currentImage.filename}
          style={{ transform: `scale(${zoom})` }}
          className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl transition-transform duration-150 ease-out cursor-zoom-in"
        />
      </div>

      {/* Thumbnail Navigation Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-20 inset-x-0 flex items-center justify-center gap-2 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 pointer-events-auto max-w-[80vw] overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => {
                  setZoom(1);
                  setCurrentIndex(idx);
                }}
                className={cn(
                  "w-11 h-8 rounded-md overflow-hidden border transition-all cursor-pointer",
                  idx === currentIndex
                    ? "border-accent ring-1 ring-accent opacity-100 scale-105"
                    : "border-transparent opacity-50 hover:opacity-80"
                )}
              >
                <img src={img.url} alt={img.filename} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Zoom & View Toolbar */}
      <div className="absolute bottom-6 inset-x-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white shadow-raised pointer-events-auto">
          <button
            onClick={handleZoomOut}
            title="Zoom Out (-)"
            className="p-1.5 rounded-full hover:bg-white/15 transition-colors cursor-pointer"
          >
            <MagnifyingGlassMinus weight="bold" className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomReset}
            title="Reset Zoom (0)"
            className="px-2 py-0.5 text-[11.5px] font-mono text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            title="Zoom In (+)"
            className="p-1.5 rounded-full hover:bg-white/15 transition-colors cursor-pointer"
          >
            <MagnifyingGlassPlus weight="bold" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
