"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import PdfViewer from "@/components/PdfViewer";
import Prism from "prismjs";

// Import Prism themes and language support
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-css";

function getPrismLang(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "js":
    case "jsx":
      return "javascript";
    case "ts":
    case "tsx":
      return "typescript";
    case "json":
      return "json";
    case "md":
      return "markdown";
    case "sh":
    case "bash":
      return "bash";
    case "css":
      return "css";
    default:
      return null;
  }
}

export default function PreviewDialog({
  open,
  onOpenChange,
  connectionId,
  filePath,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: string;
  filePath: string;
}) {
  const [content, setContent] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const filename = filePath.split("/").pop() || "";

  useEffect(() => {
    if (!open) return;

    const fetchFile = async () => {
      setLoading(true);
      setError(false);
      setContent(null);
      setPreviewUrl(null);

      try {
        const res = await fetch(
          `/api/files/download?connectionId=${connectionId}&file=${encodeURIComponent(filePath)}`
        );

        const type = res.headers.get("content-type") ?? "";
        setMimeType(type);

        if (type.startsWith("text/") || type === "application/json") {
          const raw = await res.text();
          const lang = getPrismLang(filename);
          const highlighted = lang
            ? Prism.highlight(raw, Prism.languages[lang], lang)
            : raw;
          setContent(highlighted);
        } else if (
          type.startsWith("image/") ||
          type === "application/pdf"
        ) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
        } else {
          setContent(null);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [open, filePath]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-6 gap-4">
        <DialogHeader>
          <DialogTitle className="truncate">{filename}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="truncate">{mimeType}</span>
          <a
            href={`/api/files/download?connectionId=${connectionId}&file=${encodeURIComponent(filePath)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Download
          </a>
        </div>

        <div className="flex-1 rounded border bg-muted overflow-auto px-4 py-2">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
            </div>
          ) : error ? (
            <p className="text-sm text-red-500">Failed to load preview.</p>
          ) : mimeType === "application/pdf" && previewUrl ? (
            <PdfViewer url={previewUrl} />
          ) : mimeType.startsWith("image/") && previewUrl ? (
            <div className="flex justify-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-[70vh] max-w-full rounded shadow"
              />
            </div>
          ) : content ? (
            <ScrollArea className="text-sm font-mono leading-relaxed prose dark:prose-invert">
              <div
                className="pr-4"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground">
              Preview not supported for this file type.
            </p>
          )}
        </div>

        <DialogClose asChild>
          <button className="absolute top-4 right-4 text-sm text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
