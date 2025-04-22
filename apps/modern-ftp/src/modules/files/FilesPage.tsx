"use client";

import { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { pingConnection } from "@/lib/pingConnection";
import FileList from "./FileList";
import clsx from "clsx";

type Connection = {
  id: string;
  name: string;
};

export default function FilesPageClient({ connections }: { connections: Connection[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(connections[0]?.id ?? null);
  const [statuses, setStatuses] = useState<Record<string, "online" | "offline">>({});

  useEffect(() => {
    async function loadStatuses() {
      const result: Record<string, "online" | "offline"> = {};
      await Promise.all(
        connections.map(async (conn) => {
          const status = await pingConnection(conn.id);
          result[conn.id] = status;
        })
      );
      setStatuses(result);
    }

    if (connections.length > 0) loadStatuses();
  }, [connections]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Remote Files</h1>

        {connections.length > 0 && (
          <Select value={selectedId ?? ""} onValueChange={(val) => setSelectedId(val)}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a connection" />
            </SelectTrigger>
            <SelectContent>
              {connections.map((conn) => (
                <SelectItem
                  key={conn.id}
                  value={conn.id}
                  className="flex items-center justify-between"
                >
                  {conn.name}
                  <span
                    className={clsx(
                      "ml-2 w-2 h-2 rounded-full",
                      statuses[conn.id] === "online" ? "bg-green-500" : "bg-red-500"
                    )}
                  />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedId ? (
        <FileList key={selectedId} connectionId={selectedId} />
      ) : (
        <p className="text-muted-foreground">No connection selected.</p>
      )}
    </div>
  );
}
