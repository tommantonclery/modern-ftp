"use client";

import { useState } from "react";
import ConnectionCard from "./ConnectionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { UIConnection } from "@/types/connections";

export default function ConnectionList({
  connections,
  onEdit,
  onRefresh,
}: {
  connections: UIConnection[];
  onEdit: (connection: UIConnection) => void;
  onRefresh: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this connection?")) return;
    setLoading(true);
    await fetch("/api/connections/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await onRefresh();
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-md" />
        ))}
      </div>
    );
  }

  if (!connections.length) {
    return (
      <div className="text-muted-foreground text-sm border p-6 rounded-md text-center">
        No connections saved yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {connections.map((conn) => (
        <ConnectionCard
          key={conn.id}
          connection={conn}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
