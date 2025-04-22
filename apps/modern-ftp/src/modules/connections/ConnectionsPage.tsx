"use client";

import { useState } from "react";
import { UIConnection } from "@/types/connections";
import ConnectionForm from "./ConnectionForm";
import ConnectionList from "./ConnectionList";
import { Card } from "@/components/ui/card";

export default function ConnectionsPageClient({
  initialConnections,
}: {
  initialConnections: UIConnection[];
}) {
  const [connections, setConnections] = useState<UIConnection[]>(initialConnections);
  const [editing, setEditing] = useState<UIConnection | null>(null);

  const refreshConnections = async (): Promise<UIConnection[]> => {
    const res = await fetch("/api/connections");
    const data = await res.json();
    return data.connections || [];
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4">
      <h1 className="text-xl font-semibold">SFTP Connections</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-md font-semibold mb-4">
            {editing ? "Edit Connection" : "New Connection"}
          </h2>
          <ConnectionForm
            key={editing?.id || "new"} // 🔑 force re-mount on edit switch
            defaultValues={editing || undefined}
            onSaved={async () => {
              const updated = await refreshConnections();
              setConnections(updated);     // ✅ keep list in sync
              setEditing(null);            // ✅ clear edit state after update
            }}
          />
        </Card>

        <div className="flex flex-col gap-4">
          <h2 className="text-md font-semibold">Saved Connections</h2>
          <ConnectionList
            key={connections.map(c => c.id).join(",")} // 🔑 force rerender
            connections={connections}
            onEdit={setEditing}
            onRefresh={async () => {
                const updated = await refreshConnections();
                setConnections(updated);
            }}
            />
        </div>
      </div>
    </div>
  );
}
