"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Download, Trash, Eye } from "lucide-react";
import PreviewDialog from "./PreviewDialog";
import { useState } from "react";

export default function FileActionMenu({
  file,
  connectionId,
  currentPath,
  refresh,
}: {
  file: any;
  connectionId: string;
  currentPath: string;
  refresh: () => void;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const fullPath = `${currentPath}/${file.filename}`;

  const handleDownload = () => {
    const url = `/api/files/download?connectionId=${connectionId}&file=${encodeURIComponent(fullPath)}`;
    window.open(url, "_blank");
  };

  const handleDelete = async () => {
    const confirmed = confirm(`Are you sure you want to delete "${file.filename}"?`);
    if (!confirmed) return;

    const res = await fetch("/api/files/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        connectionId,
        path: fullPath,
      }),
    });

    if (res.ok) {
      refresh();
    } else {
      alert("Failed to delete the file.");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 rounded hover:bg-muted">
            <MoreVertical className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left">
          <DropdownMenuItem onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" /> Download
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPreviewOpen(true)}>
            <Eye className="w-4 h-4 mr-2" /> Preview
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>
            <Trash className="w-4 h-4 mr-2 text-red-500" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        connectionId={connectionId}
        filePath={fullPath}
      />
    </>
  );
}
