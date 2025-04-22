"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";

export default function FileUploader({
  connectionId,
  path,
  onUploadComplete,
}: {
  connectionId: string;
  path: string;
  onUploadComplete: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    setUploading(true);
    for (const file of acceptedFiles) {
      const form = new FormData();
      form.set("connectionId", connectionId);
      form.set("path", path);
      form.set("file", file);

      const res = await fetch("/api/files/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        alert(`Upload failed for ${file.name}`);
      }
    }

    setUploading(false);
    setDone(true);
    setTimeout(() => setDone(false), 2000);
    onUploadComplete();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition",
        isDragActive ? "bg-blue-100 border-blue-400" : "hover:bg-muted"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
        {uploading ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : done ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <UploadCloud className="w-5 h-5" />
        )}
        <p>Drag & drop files here or click to browse</p>
      </div>
    </div>
  );
}
