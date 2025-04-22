"use client";

import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useHotkeys } from "react-hotkeys-hook";

export default function FileSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useHotkeys("ctrl+k, cmd+k", (e) => {
    e.preventDefault();
    inputRef.current?.focus();
  });

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search files… (Cmd/Ctrl + K)"
      className="w-full sm:max-w-sm"
    />
  );
}
