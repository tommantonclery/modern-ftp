"use client";

import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({
  path,
  onNavigate,
}: {
  path: string;
  onNavigate: (to: string) => void;
}) {
  const segments = path === "." ? [] : path.split("/");

  const buildPath = (index: number) => {
    if (index === -1) return ".";
    return segments.slice(0, index + 1).join("/");
  };

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground overflow-x-auto">
      <button
        onClick={() => onNavigate(".")}
        className="hover:underline text-foreground"
      >
        Root
      </button>
      {segments.map((seg, i) => (
        <div key={i} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4" />
          <button
            onClick={() => onNavigate(buildPath(i))}
            className="hover:underline text-foreground"
          >
            {seg}
          </button>
        </div>
      ))}
    </div>
  );
}
