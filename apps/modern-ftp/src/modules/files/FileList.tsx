"use client";

import { useEffect, useState } from "react";
import { Folder, File as FileIcon, Download, Trash2 } from "lucide-react";
import Fuse from "fuse.js";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import FileUploader from "./FileUploader";
import FileActionMenu from "./FileActionMenu";
import Breadcrumbs from "./Breadcrumbs";
import FileSearch from "./FileSearch";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export default function FileList({ connectionId }: { connectionId: string }) {
  const [files, setFiles] = useState<any[]>([]);
  const [visibleFiles, setVisibleFiles] = useState<any[]>([]);
  const [path, setPath] = useState(".");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  useEffect(() => {
    setPath(".");
    fetchFiles(".");
  }, [connectionId]);

  useEffect(() => {
    if (search.trim() !== "") {
      const fuse = new Fuse(files, {
        keys: ["filename"],
        threshold: 0.3,
      });
      setVisibleFiles(fuse.search(search).map((r) => r.item));
    } else {
      setVisibleFiles(files);
    }
  }, [search, files]);

  const fetchFiles = async (dir: string) => {
    setLoading(true);
    setError(null);
    setSelectedFiles([]);

    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId, path: dir }),
      });

      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();

      setFiles(data.files);
      setPath(dir);
    } catch (err) {
      setError("Could not connect to server or fetch files.");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (folderName: string) => {
    const newPath = path === "." ? folderName : `${path}/${folderName}`;
    fetchFiles(newPath);
  };

  const handleBatchDownload = () => {
    selectedFiles.forEach((filename) => {
      const url = `/api/files/download?connectionId=${connectionId}&file=${encodeURIComponent(`${path}/${filename}`)}`;
      window.open(url, "_blank");
    });
  };

  const handleBatchDelete = async () => {
    const confirmed = confirm(`Delete ${selectedFiles.length} file(s)?`);
    if (!confirmed) return;

    for (const filename of selectedFiles) {
      await fetch("/api/files/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          connectionId,
          path: `${path}/${filename}`,
        }),
      });
    }

    setSelectedFiles([]);
    fetchFiles(path);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <FileSearch value={search} onChange={setSearch} />
        <Breadcrumbs path={path} onNavigate={(p) => fetchFiles(p)} />
      </div>

      <FileUploader
        connectionId={connectionId}
        path={path}
        onUploadComplete={() => fetchFiles(path)}
      />

      {selectedFiles.length > 0 && (
        <div className="flex items-center justify-between border px-4 py-2 rounded-md bg-muted text-sm shadow-sm animate-in fade-in slide-in-from-top-2">
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">{selectedFiles.length}</span> selected
          </span>
          <div className="flex gap-3 items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={handleBatchDownload}>
                  <Download className="w-4 h-4 text-blue-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={handleBatchDelete}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      {loading && (
        <div className="divide-y border rounded-md bg-background shadow-sm animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <Skeleton className="w-5 h-5 rounded-sm" />
                <div className="flex flex-col gap-1 min-w-0">
                  <Skeleton className="h-4 w-[160px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </div>
              <Skeleton className="w-4 h-4" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="border border-red-200 bg-red-50 dark:bg-red-900/20 p-4 rounded-md space-y-2">
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={() => fetchFiles(path)}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="divide-y border rounded-md bg-background shadow-sm">
          {visibleFiles.map((file) => {
            const isDir = file.longname.startsWith("d");
            const size = file.attrs?.size || 0;
            const modified = new Date(file.attrs?.mtime * 1000).toLocaleString();

            return (
              <div
                key={file.filename}
                onClick={() => isDir && handleFolderClick(file.filename)}
                className={`group flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition cursor-pointer ${
                  selectedFiles.includes(file.filename) ? "bg-muted/40" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {isDir ? (
                    <Folder className="w-5 h-5 text-blue-600 shrink-0" />
                  ) : (
                    <FileIcon className="w-5 h-5 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      {!isDir && (
                        <Checkbox
                          checked={selectedFiles.includes(file.filename)}
                          onCheckedChange={(checked) => {
                            setSelectedFiles((prev) =>
                              checked
                                ? [...prev, file.filename]
                                : prev.filter((f) => f !== file.filename)
                            );
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4"
                        />
                      )}
                      <span className="truncate text-sm font-medium">{file.filename}</span>
                    </div>
                    <span className="text-xs text-muted-foreground truncate">
                      {isDir ? "Folder" : `${(size / 1024).toFixed(1)} KB`} • {modified}
                    </span>
                  </div>
                </div>

                {!isDir && (
                  <div
                    className="opacity-0 group-hover:opacity-100 transition"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FileActionMenu
                      file={file}
                      connectionId={connectionId}
                      currentPath={path}
                      refresh={() => fetchFiles(path)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
