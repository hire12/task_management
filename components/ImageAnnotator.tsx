"use client";

import React, { useState, useRef } from "react";
import {
  X,
  FloppyDisk,
  ChatCircleDots,
  Square,
  ArrowUpRight,
  Trash,
  Check,
} from "@phosphor-icons/react";
import { saveAttachmentAnnotations } from "@/app/actions/annotations";
import { cn } from "@/lib/utils";

export interface AnnotationPin {
  id: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  label: number;
  comment: string;
}

interface ImageAnnotatorProps {
  attachmentId: string;
  imageUrl: string;
  filename: string;
  initialAnnotations?: any;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (saved: AnnotationPin[]) => void;
}

export const ImageAnnotator: React.FC<ImageAnnotatorProps> = ({
  attachmentId,
  imageUrl,
  filename,
  initialAnnotations,
  isOpen,
  onClose,
  onSaved,
}) => {
  const [pins, setPins] = useState<AnnotationPin[]>(
    Array.isArray(initialAnnotations) ? initialAnnotations : []
  );
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newPin: AnnotationPin = {
      id: `pin-${Date.now()}`,
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
      label: pins.length + 1,
      comment: "",
    };

    setPins([...pins, newPin]);
    setSelectedPinId(newPin.id);
  };

  const handleUpdateComment = (id: string, text: string) => {
    setPins(pins.map((p) => (p.id === id ? { ...p, comment: text } : p)));
  };

  const handleDeletePin = (id: string) => {
    const filtered = pins.filter((p) => p.id !== id);
    // Re-number pins
    const renumbered = filtered.map((p, idx) => ({ ...p, label: idx + 1 }));
    setPins(renumbered);
    if (selectedPinId === id) setSelectedPinId(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveAttachmentAnnotations(attachmentId, pins);
      setSavedSuccess(true);
      onSaved?.(pins);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none animate-fade-in">
      <div className="relative w-full max-w-5xl h-[90vh] bg-surface rounded-2xl border border-border shadow-modal flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-muted/30">
          <div className="flex items-center gap-3">
            <ChatCircleDots weight="duotone" className="w-5 h-5 text-accent" />
            <div>
              <h3 className="text-[14.5px] font-semibold text-content-primary tracking-tight">
                Annotate & Pinpoint UI Bugs: {filename}
              </h3>
              <p className="text-[12px] text-content-secondary">
                Click anywhere on the image to drop a feedback pin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-lg bg-accent text-white text-[12.5px] font-medium flex items-center gap-1.5 hover:bg-accent/90 cursor-pointer transition-colors shadow-sm"
            >
              {savedSuccess ? (
                <>
                  <Check weight="bold" className="w-4 h-4 text-brandSuccess" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <FloppyDisk weight="bold" className="w-4 h-4" />
                  <span>{isSaving ? "Saving..." : "Save Annotations"}</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-content-placeholder hover:text-content-primary hover:bg-surface-muted transition-colors cursor-pointer"
            >
              <X weight="bold" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Workspace Body: Image Canvas + Pin Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas Viewport */}
          <div className="flex-1 bg-black/5 overflow-auto p-6 flex items-center justify-center relative">
            <div
              ref={imageContainerRef}
              onClick={handleImageClick}
              className="relative inline-block cursor-crosshair rounded-xl overflow-hidden shadow-raised max-w-full max-h-full"
            >
              <img
                src={imageUrl}
                alt={filename}
                className="max-w-full max-h-[70vh] object-contain pointer-events-none select-none"
              />

              {/* Render Numbered Pins */}
              {pins.map((pin) => (
                <div
                  key={pin.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPinId(pin.id);
                  }}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shadow-lg transition-transform cursor-pointer border-2 border-white",
                    pin.id === selectedPinId
                      ? "bg-brandDanger text-white scale-125 z-20 ring-4 ring-brandDanger/30 animate-pulse"
                      : "bg-accent text-white hover:scale-110 z-10"
                  )}
                >
                  {pin.label}
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Notes Sidebar */}
          <div className="w-80 border-l border-border bg-surface flex flex-col">
            <div className="px-4 py-3 border-b border-border/80 text-[12.5px] font-semibold text-content-primary">
              Issue Notes ({pins.length})
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {pins.length === 0 ? (
                <div className="text-center py-12 text-content-placeholder text-[12.5px]">
                  Click on the image to drop Pin #1
                </div>
              ) : (
                pins.map((pin) => (
                  <div
                    key={pin.id}
                    onClick={() => setSelectedPinId(pin.id)}
                    className={cn(
                      "p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2",
                      pin.id === selectedPinId
                        ? "border-accent bg-accent/5 shadow-xs"
                        : "border-border bg-surface-muted/20 hover:border-content-placeholder/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-accent text-white text-[11px] font-bold flex items-center justify-center">
                          {pin.label}
                        </span>
                        <span className="text-[12px] font-medium text-content-primary">
                          Bug #{pin.label}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePin(pin.id);
                        }}
                        className="text-content-placeholder hover:text-brandDanger p-1 transition-colors"
                      >
                        <Trash weight="bold" className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      placeholder="Describe what is broken or needs change..."
                      value={pin.comment}
                      onChange={(e) => handleUpdateComment(pin.id, e.target.value)}
                      className="w-full text-[12px] p-2 rounded-lg border border-border/80 bg-surface text-content-primary placeholder:text-content-placeholder focus:border-accent focus:outline-none resize-none"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
