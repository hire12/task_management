"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  CheckCircle,
  Circle,
  Calendar,
  Clock,
  Trash,
  Tag,
  Paperclip,
  Image as ImageIcon,
  Check,
  PencilSimple,
  Star,
  ArrowsInSimple,
  UploadSimple,
  CircleNotch,
  ChatCircleDots,
} from "@phosphor-icons/react";
import { FullTask, TaskStatus, PriorityLevel } from "@/lib/types";
import { updateTask, deleteTask, toggleSubtask, addSubtask } from "@/app/actions/tasks";
import { deleteTaskAttachment, toggleTaskCover } from "@/app/actions/attachments";
import { formatRelativeDate, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { compressImage, formatBytes } from "@/lib/image";
import { ImageLightbox } from "@/components/ImageLightbox";
import { Dropzone } from "@/components/Dropzone";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { ImageAnnotator } from "@/components/ImageAnnotator";

interface TaskDetailModalProps {
  task: FullTask | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated?: (updatedTask: FullTask) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onTaskUpdated,
}) => {
  const [currentTask, setCurrentTask] = useState<FullTask | null>(task);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [annotatingAttachment, setAnnotatingAttachment] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processAndUploadFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0 || !currentTask) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const rawFile = files[i];
        if (!rawFile.type.startsWith("image/")) continue;

        const compressedFile = await compressImage(rawFile);
        const formData = new FormData();
        formData.append("file", compressedFile);
        formData.append("taskId", currentTask.id);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Upload failed");
        }

        const data = await res.json();
        if (data.attachment) {
          const currentAttachments = currentTask.attachments || [];
          const merged = {
            ...currentTask,
            attachments: [...currentAttachments, data.attachment],
          };
          setCurrentTask(merged);
          onTaskUpdated?.(merged);
        }
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    setCurrentTask(task);
    if (task) {
      setTitleValue(task.title);
      setDescValue(task.description || "");
    }
  }, [task]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle direct clipboard paste (Cmd+V / Ctrl+V)
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) imageFiles.push(file);
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault();
        processAndUploadFiles(imageFiles);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [isOpen, currentTask]);

  if (!isOpen || !currentTask) return null;

  const isDone = currentTask.status === "DONE";

  const handleSaveTitle = async () => {
    if (!titleValue.trim() || titleValue === currentTask.title) {
      setIsEditingTitle(false);
      return;
    }
    const updated = await updateTask(currentTask.id, { title: titleValue.trim() });
    if (updated) {
      const merged = { ...currentTask, title: updated.title };
      setCurrentTask(merged);
      onTaskUpdated?.(merged);
    }
    setIsEditingTitle(false);
  };

  const handleSaveDesc = async () => {
    if (descValue === currentTask.description) {
      setIsEditingDesc(false);
      return;
    }
    const updated = await updateTask(currentTask.id, { description: descValue });
    if (updated) {
      const merged = { ...currentTask, description: updated.description };
      setCurrentTask(merged);
      onTaskUpdated?.(merged);
    }
    setIsEditingDesc(false);
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    const updated = await updateTask(currentTask.id, { status: newStatus });
    if (updated) {
      const merged = { ...currentTask, status: updated.status };
      setCurrentTask(merged);
      onTaskUpdated?.(merged);
    }
  };

  const handlePriorityChange = async (newPriority: PriorityLevel) => {
    const updated = await updateTask(currentTask.id, { priority: newPriority });
    if (updated) {
      const merged = { ...currentTask, priority: updated.priority };
      setCurrentTask(merged);
      onTaskUpdated?.(merged);
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(currentTask.id);
      onClose();
    }
  };

  const handleToggleSubtask = async (subtaskId: string) => {
    const updated = await toggleSubtask(subtaskId);
    if (updated && currentTask.subtasks) {
      const newSubtasks = currentTask.subtasks.map((s) =>
        s.id === subtaskId ? { ...s, isCompleted: updated.isCompleted } : s
      );
      const merged = { ...currentTask, subtasks: newSubtasks };
      setCurrentTask(merged);
      onTaskUpdated?.(merged);
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    const added = await addSubtask(currentTask.id, newSubtask.trim());
    if (added && currentTask.subtasks) {
      const merged = { ...currentTask, subtasks: [...currentTask.subtasks, added] };
      setCurrentTask(merged);
      onTaskUpdated?.(merged);
    }
    setNewSubtask("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processAndUploadFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processAndUploadFiles(e.dataTransfer.files);
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!currentTask.attachments) return;
    const backup = currentTask.attachments;
    const updatedAttachments = currentTask.attachments.filter((a) => a.id !== attachmentId);
    const merged = { ...currentTask, attachments: updatedAttachments };
    setCurrentTask(merged);
    onTaskUpdated?.(merged);

    try {
      await deleteTaskAttachment(attachmentId);
    } catch (err) {
      const reverted = { ...currentTask, attachments: backup };
      setCurrentTask(reverted);
      onTaskUpdated?.(reverted);
    }
  };

  const handleToggleCover = async (attachmentId: string) => {
    if (!currentTask.attachments) return;
    const backup = currentTask.attachments;
    const isCurrentlyCover = currentTask.attachments.find((a) => a.id === attachmentId)?.isCover;

    const updated = currentTask.attachments.map((a) => ({
      ...a,
      isCover: a.id === attachmentId ? !isCurrentlyCover : false,
    }));

    const merged = { ...currentTask, attachments: updated };
    setCurrentTask(merged);
    onTaskUpdated?.(merged);

    try {
      await toggleTaskCover(attachmentId, currentTask.id);
    } catch {
      const reverted = { ...currentTask, attachments: backup };
      setCurrentTask(reverted);
      onTaskUpdated?.(reverted);
    }
  };

  const totalSubtasks = currentTask.subtasks?.length || 0;
  const completedSubtasks = currentTask.subtasks?.filter((s) => s.isCompleted).length || 0;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Container with Drag-and-Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative w-full max-w-3xl rounded-2xl border border-border bg-surface shadow-modal overflow-hidden z-10 flex flex-col max-h-[90vh] transition-all",
          isDraggingFile && "ring-2 ring-accent border-accent"
        )}
      >
        {/* Drop Overlay */}
        {isDraggingFile && (
          <div className="absolute inset-0 z-50 bg-accent/10 backdrop-blur-xs flex flex-col items-center justify-center border-2 border-dashed border-accent m-2 rounded-xl pointer-events-none">
            <UploadSimple weight="bold" className="w-10 h-10 text-accent animate-bounce" />
            <span className="text-[15px] font-semibold text-accent mt-2">
              Drop screenshot to attach to this task
            </span>
          </div>
        )}
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-surface-muted/30">
          <div className="flex items-center gap-3">
            {/* Status Selector */}
            <select
              value={currentTask.status}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
              className="px-2.5 py-1 rounded-md text-[12.5px] font-semibold border border-border bg-surface text-content-primary hover:border-content-placeholder cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="BACKLOG">Backlog</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">Review</option>
              <option value="DONE">Done</option>
            </select>

            {/* Priority Selector */}
            <select
              value={currentTask.priority}
              onChange={(e) => handlePriorityChange(e.target.value as PriorityLevel)}
              className="px-2.5 py-1 rounded-md text-[12.5px] font-semibold border border-border bg-surface text-content-primary hover:border-content-placeholder cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="URGENT">Urgent Priority</option>
            </select>

            {currentTask.project && (
              <span className="hidden sm:inline-block text-[12px] text-content-placeholder border-l border-border/80 pl-3">
                {currentTask.project.title}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteTask}
              title="Delete Task"
              className="p-1.5 rounded-lg text-content-placeholder hover:text-brandDanger hover:bg-surface-muted transition-colors cursor-pointer"
            >
              <Trash weight="duotone" className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close (Esc)"
              className="p-1.5 rounded-lg text-content-placeholder hover:text-content-primary hover:bg-surface-muted transition-colors cursor-pointer"
            >
              <X weight="bold" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Title Area */}
          <div>
            {isEditingTitle ? (
              <div className="flex items-start gap-2">
                <input
                  type="text"
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
                  autoFocus
                  className="w-full text-[19px] font-semibold text-content-primary bg-surface-muted/50 rounded-lg p-2 border border-accent focus:outline-none"
                />
                <button
                  onClick={handleSaveTitle}
                  className="px-3 py-2 rounded-lg bg-accent text-white text-[12px] font-medium"
                >
                  Save
                </button>
              </div>
            ) : (
              <h2
                onClick={() => setIsEditingTitle(true)}
                className={cn(
                  "text-[20px] font-semibold text-content-primary tracking-tight cursor-pointer hover:bg-surface-muted/40 p-1.5 -ml-1.5 rounded-lg transition-colors group flex items-center justify-between",
                  isDone && "line-through text-content-placeholder"
                )}
              >
                <span>{currentTask.title}</span>
                <PencilSimple
                  weight="duotone"
                  className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity ml-2 shrink-0"
                />
              </h2>
            )}
          </div>

          {/* Description Reader & Editor */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-content-placeholder">
                Description & Specs
              </span>
              {!isEditingDesc && (
                <button
                  onClick={() => setIsEditingDesc(true)}
                  className="text-[12px] text-accent hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <PencilSimple weight="bold" className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {isEditingDesc ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={descValue}
                  onChange={(e) => setDescValue(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                      e.preventDefault();
                      handleSaveDesc();
                    }
                  }}
                  placeholder="Add detailed task specs, reproduction steps, or requirements..."
                  rows={6}
                  autoFocus
                  className="w-full text-[13.5px] leading-relaxed text-content-primary bg-surface-muted/40 rounded-xl p-3.5 border border-border focus:border-accent focus:outline-none resize-y"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-content-placeholder">
                    Tip: Press <kbd className="font-mono bg-surface-muted px-1 py-0.5 rounded border border-border">Cmd/Ctrl + Enter</kbd> to save
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setDescValue(currentTask.description || "");
                        setIsEditingDesc(false);
                      }}
                      className="px-3 py-1.5 rounded-md text-[12px] text-content-secondary hover:bg-surface-muted"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveDesc}
                      className="px-3 py-1.5 rounded-md bg-accent text-white text-[12px] font-medium shadow-xs"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingDesc(true)}
                className="rounded-xl border border-border/70 bg-surface-muted/20 p-4 text-[13.5px] leading-relaxed text-content-primary cursor-pointer hover:border-border transition-colors min-h-[80px]"
              >
                {currentTask.description ? (
                  <MarkdownRenderer content={currentTask.description} />
                ) : (
                  <p className="text-content-placeholder italic">
                    No description provided yet. Click to add detailed specs or instructions.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Image Attachments Gallery */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon weight="duotone" className="w-4 h-4 text-content-secondary" />
                <span className="text-[12px] font-semibold uppercase tracking-wider text-content-placeholder">
                  Image Attachments ({currentTask.attachments?.length || 0})
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-content-placeholder bg-surface-muted border border-border/80">
                  Cmd/Ctrl + V
                </span>
              </div>

              <label className="text-[12px] text-accent hover:underline flex items-center gap-1 cursor-pointer">
                <UploadSimple weight="bold" className="w-3 h-3" />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {uploadError && (
              <div className="p-2.5 rounded-lg bg-brandDanger/10 border border-brandDanger/20 text-brandDanger text-[12px]">
                {uploadError}
              </div>
            )}

            {currentTask.attachments && currentTask.attachments.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {currentTask.attachments.map((att, idx) => (
                  <div
                    key={att.id}
                    className="group relative rounded-xl border border-border bg-surface-muted/40 overflow-hidden shadow-xs hover:border-content-placeholder transition-all cursor-pointer"
                  >
                    {/* Thumbnail Image */}
                    <div
                      onClick={() => setActiveLightboxIndex(idx)}
                      className="aspect-video w-full overflow-hidden bg-black/5 flex items-center justify-center"
                    >
                      <img
                        src={att.url}
                        alt={att.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>

                    {/* Metadata Footer */}
                    <div className="p-2 flex items-center justify-between text-[11px] text-content-secondary bg-surface">
                      <span className="truncate max-w-[120px]" title={att.filename}>
                        {att.filename}
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-content-placeholder">
                        {att.width && att.height && (
                          <span className="text-[10px] opacity-70">
                            {att.width}×{att.height}
                          </span>
                        )}
                        <span>{formatBytes(att.fileSize)}</span>
                      </div>
                    </div>

                    {/* Actions Overlay */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAnnotatingAttachment(att);
                        }}
                        title="Annotate bugs on image"
                        className="p-1 rounded-md bg-black/70 backdrop-blur-xs text-white hover:bg-accent transition-colors cursor-pointer"
                      >
                        <ChatCircleDots weight="bold" className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleCover(att.id)}
                        title={att.isCover ? "Remove card cover" : "Set as card cover"}
                        className={cn(
                          "p-1 rounded-md bg-black/70 backdrop-blur-xs text-white hover:bg-black transition-colors cursor-pointer",
                          att.isCover && "text-brandWarning"
                        )}
                      >
                        <Star weight={att.isCover ? "fill" : "bold"} className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAttachment(att.id)}
                        title="Delete image"
                        className="p-1 rounded-md bg-black/70 backdrop-blur-xs text-white hover:bg-brandDanger transition-colors cursor-pointer"
                      >
                        <Trash weight="bold" className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {att.isCover && (
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-white text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Star weight="fill" className="w-2.5 h-2.5 text-brandWarning" />
                        <span>Cover</span>
                      </div>
                    )}
                  </div>
                ))}

                {isUploading && (
                  <div className="rounded-xl border border-dashed border-accent bg-accent/5 flex flex-col items-center justify-center gap-2 aspect-video animate-pulse">
                    <CircleNotch weight="bold" className="w-5 h-5 text-accent animate-spin" />
                    <span className="text-[11.5px] font-medium text-accent">Processing...</span>
                  </div>
                )}
              </div>
            ) : (
              <Dropzone
                onFilesDrop={processAndUploadFiles}
                isUploading={isUploading}
              />
            )}
          </div>

          {/* Subtasks & Checklist */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle weight="duotone" className="w-4 h-4 text-content-secondary" />
                <span className="text-[12px] font-semibold uppercase tracking-wider text-content-placeholder">
                  Checklist & Steps ({completedSubtasks}/{totalSubtasks})
                </span>
              </div>
              {totalSubtasks > 0 && (
                <span className="text-[11.5px] font-mono text-content-secondary">
                  {subtaskProgress}%
                </span>
              )}
            </div>

            {/* Checklist progress bar */}
            {totalSubtasks > 0 && (
              <div className="w-full h-1.5 bg-surface-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-brandSuccess transition-all duration-300 rounded-full"
                  style={{ width: `${subtaskProgress}%` }}
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              {currentTask.subtasks?.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => handleToggleSubtask(sub.id)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-muted/60 transition-colors cursor-pointer text-[13px] text-content-primary"
                >
                  {sub.isCompleted ? (
                    <CheckCircle weight="fill" className="w-4 h-4 text-brandSuccess shrink-0" />
                  ) : (
                    <Circle weight="duotone" className="w-4 h-4 text-content-placeholder shrink-0" />
                  )}
                  <span className={cn(sub.isCompleted && "line-through text-content-placeholder")}>
                    {sub.title}
                  </span>
                </div>
              ))}

              <form onSubmit={handleAddSubtask} className="mt-1">
                <input
                  type="text"
                  placeholder="+ Add a step or subtask (press Enter)..."
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-[13px] border border-border/80 bg-surface-muted/30 placeholder:text-content-placeholder focus:border-accent focus:outline-none"
                />
              </form>
            </div>
          </div>
        </div>

        {/* Modal Footer Info */}
        <div className="px-6 py-3 border-t border-border/80 bg-surface-muted/20 flex items-center justify-between text-[11.5px] text-content-placeholder">
          <div className="flex items-center gap-4">
            {currentTask.dueDate && (
              <span className="flex items-center gap-1.5 text-content-secondary">
                <Calendar weight="duotone" className="w-3.5 h-3.5" />
                <span>Due {formatRelativeDate(currentTask.dueDate)}</span>
              </span>
            )}
            {currentTask.estimatedMinutes && (
              <span className="flex items-center gap-1.5">
                <Clock weight="duotone" className="w-3.5 h-3.5" />
                <span>Estimate: {currentTask.estimatedMinutes}m</span>
              </span>
            )}
          </div>

          <span className="font-mono">Created {formatRelativeDate(currentTask.createdAt)}</span>
        </div>
      </div>

      {/* Fullscreen Image Lightbox */}
      {currentTask.attachments && currentTask.attachments.length > 0 && (
        <ImageLightbox
          images={currentTask.attachments}
          initialIndex={activeLightboxIndex ?? 0}
          isOpen={activeLightboxIndex !== null}
          onClose={() => setActiveLightboxIndex(null)}
        />
      )}

      {/* Visual Canvas Bug Pin-Pointer */}
      {annotatingAttachment && (
        <ImageAnnotator
          attachmentId={annotatingAttachment.id}
          imageUrl={annotatingAttachment.url}
          filename={annotatingAttachment.filename}
          initialAnnotations={annotatingAttachment.annotations}
          isOpen={!!annotatingAttachment}
          onClose={() => setAnnotatingAttachment(null)}
          onSaved={(pins) => {
            if (currentTask.attachments) {
              const updated = currentTask.attachments.map((a) =>
                a.id === annotatingAttachment.id ? { ...a, annotations: pins as any } : a
              );
              const merged = { ...currentTask, attachments: updated as any };
              setCurrentTask(merged);
              onTaskUpdated?.(merged);
            }
          }}
        />
      )}
    </div>
  );
};
