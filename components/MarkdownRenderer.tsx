"use client";

import React, { useState } from "react";
import { Copy, Check, CheckSquare, Square } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  onImageClick?: (url: string) => void;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  onImageClick,
  className,
}) => {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  if (!content) return null;

  const handleCopyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Simple line-by-line markdown parser for clean native rendering
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeBlockLang = "";

  lines.forEach((line, index) => {
    // Code block start / end
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // End code block
        const codeText = codeBuffer.join("\n");
        const blockId = `code-${index}`;
        elements.push(
          <div
            key={blockId}
            className="group relative my-3 rounded-xl border border-border/80 bg-[#15191d] p-3.5 font-mono text-[12.5px] text-emerald-300 overflow-x-auto shadow-sm"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[11px] text-white/50">
              <span>{codeBlockLang || "code"}</span>
              <button
                onClick={() => handleCopyCode(codeText, blockId)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                {copiedCodeId === blockId ? (
                  <>
                    <Check weight="bold" className="w-3.5 h-3.5 text-brandSuccess" />
                    <span className="text-brandSuccess">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy weight="bold" className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="m-0 leading-relaxed">{codeText}</pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeBlockLang = line.trim().slice(3).trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // Heading 1
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={index} className="text-[18px] font-bold text-content-primary mt-4 mb-2">
          {renderInline(line.slice(2))}
        </h1>
      );
      return;
    }

    // Heading 2
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={index} className="text-[16px] font-semibold text-content-primary mt-3 mb-1.5">
          {renderInline(line.slice(3))}
        </h2>
      );
      return;
    }

    // Heading 3
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={index} className="text-[14.5px] font-semibold text-content-primary mt-2.5 mb-1">
          {renderInline(line.slice(4))}
        </h3>
      );
      return;
    }

    // Checkbox items
    if (line.trim().startsWith("- [x] ") || line.trim().startsWith("- [ ] ")) {
      const isChecked = line.trim().startsWith("- [x] ");
      const itemText = line.trim().slice(6);
      elements.push(
        <div key={index} className="flex items-center gap-2 my-1 text-[13px] text-content-primary">
          {isChecked ? (
            <CheckSquare weight="fill" className="w-4 h-4 text-brandSuccess shrink-0" />
          ) : (
            <Square weight="bold" className="w-4 h-4 text-content-placeholder shrink-0" />
          )}
          <span className={cn(isChecked && "line-through text-content-placeholder")}>
            {renderInline(itemText)}
          </span>
        </div>
      );
      return;
    }

    // Unordered bullet list
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      elements.push(
        <li key={index} className="ml-4 list-disc text-[13px] text-content-primary my-0.5">
          {renderInline(line.trim().slice(2))}
        </li>
      );
      return;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={index}
          className="border-l-3 border-accent pl-3 py-1 my-2 italic text-[13px] text-content-secondary bg-accent/5 rounded-r-lg"
        >
          {renderInline(line.slice(2))}
        </blockquote>
      );
      return;
    }

    // Image markdown: ![alt](url)
    const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      const alt = imgMatch[1];
      const src = imgMatch[2];
      elements.push(
        <div key={index} className="my-3 rounded-xl overflow-hidden border border-border/80 bg-black/5">
          <img
            src={src}
            alt={alt}
            onClick={() => onImageClick?.(src)}
            className="w-full max-h-96 object-contain cursor-zoom-in hover:opacity-95 transition-opacity"
          />
          {alt && <div className="p-1.5 text-center text-[11px] text-content-placeholder">{alt}</div>}
        </div>
      );
      return;
    }

    // Empty line
    if (!line.trim()) {
      elements.push(<div key={index} className="h-2" />);
      return;
    }

    // Standard paragraph
    elements.push(
      <p key={index} className="text-[13px] leading-relaxed text-content-primary my-1">
        {renderInline(line)}
      </p>
    );
  });

  return <div className={cn("markdown-body font-sans", className)}>{elements}</div>;
};

function renderInline(text: string): React.ReactNode {
  // Parse inline bold, code, links
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold: **text**
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
    // Inline code: `text`
    const codeMatch = remaining.match(/`([^`]+)`/);
    // Link: [text](url)
    const linkMatch = remaining.match(/\[(.*?)\]\((.*?)\)/);

    // Find first match
    let firstMatchIndex = remaining.length;
    let matchType = "";
    let matchLength = 0;
    let matchedText = "";
    let extraData = "";

    if (boldMatch && boldMatch.index !== undefined && boldMatch.index < firstMatchIndex) {
      firstMatchIndex = boldMatch.index;
      matchType = "bold";
      matchLength = boldMatch[0].length;
      matchedText = boldMatch[1];
    }
    if (codeMatch && codeMatch.index !== undefined && codeMatch.index < firstMatchIndex) {
      firstMatchIndex = codeMatch.index;
      matchType = "code";
      matchLength = codeMatch[0].length;
      matchedText = codeMatch[1];
    }
    if (linkMatch && linkMatch.index !== undefined && linkMatch.index < firstMatchIndex) {
      firstMatchIndex = linkMatch.index;
      matchType = "link";
      matchLength = linkMatch[0].length;
      matchedText = linkMatch[1];
      extraData = linkMatch[2];
    }

    if (firstMatchIndex > 0) {
      parts.push(remaining.slice(0, firstMatchIndex));
    }

    if (matchType === "bold") {
      parts.push(<strong key={key++} className="font-semibold text-content-primary">{matchedText}</strong>);
    } else if (matchType === "code") {
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 rounded bg-surface-muted border border-border font-mono text-[11.5px] text-accent">
          {matchedText}
        </code>
      );
    } else if (matchType === "link") {
      parts.push(
        <a key={key++} href={extraData} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
          {matchedText}
        </a>
      );
    }

    if (firstMatchIndex === remaining.length) {
      break;
    }

    remaining = remaining.slice(firstMatchIndex + matchLength);
  }

  return parts.length > 0 ? parts : text;
}
