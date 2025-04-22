"use client";

import { Pencil, Trash2, Server } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { UIConnection } from "@/types/connections";

export default function ConnectionCard({
  connection,
  onEdit,
  onDelete,
}: {
  connection: UIConnection;
  onEdit: (conn: UIConnection) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Card className="p-4 flex flex-col justify-between gap-3 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium truncate">
          <Server className="w-4 h-4 shrink-0" />
          <span className="truncate">{connection.name}</span>
        </div>
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            connection.healthy ? "bg-green-500" : "bg-red-500"
          }`}
          title={connection.healthy ? "Connected" : "Unreachable"}
        />
      </div>

      <div className="text-xs text-muted-foreground truncate">
        {connection.username}@{connection.host}:{connection.port}
      </div>

      <div className="flex justify-end gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(connection)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(connection.id)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </div>
    </Card>
  );
}
