"use client";

import React, { useState, useEffect } from "react";
import { FloppyDisk, Article, Eye, PencilSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { saveProjectDoc } from "@/app/actions/docs";

interface ProjectDocsEditorProps {
  projectId: string;
  initialTitle?: string;
  initialContent?: string;
}

export const ProjectDocsEditor: React.FC<ProjectDocsEditorProps> = ({
  projectId,
  initialTitle = "Architecture & Specs",
  initialContent = "",
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSaved, setIsSaved] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setIsSaved(false);
  }, [content, title]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveProjectDoc(projectId, content, title);
      setIsSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-card flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Article weight="duotone" className="w-4 h-4 text-accent" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-[15px] font-semibold text-content-primary bg-transparent focus:outline-none"
            placeholder="Document title..."
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium text-content-secondary hover:text-content-primary hover:bg-surface-muted transition-colors cursor-pointer"
          >
            {previewMode ? (
              <>
                <PencilSimple weight="duotone" className="w-3.5 h-3.5" />
                <span>Edit</span>
              </>
            ) : (
              <>
                <Eye weight="duotone" className="w-3.5 h-3.5" />
                <span>Preview</span>
              </>
            )}
          </button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving || isSaved}
            className="gap-1 text-[12px]"
          >
            <FloppyDisk weight="duotone" className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : isSaved ? "Saved" : "Save Specs"}</span>
          </Button>
        </div>
      </div>

      {previewMode ? (
        <div className="prose prose-sm dark:prose-invert max-w-none min-h-[260px] whitespace-pre-wrap text-[13.5px] leading-relaxed text-content-primary">
          {content || "No document content written yet."}
        </div>
      ) : (
        <textarea
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write technical specs, API endpoints, design decisions, or release notes..."
          className="w-full bg-transparent text-[13.5px] font-mono leading-relaxed text-content-primary placeholder:text-content-placeholder focus:outline-none resize-y"
        />
      )}
    </div>
  );
};
