"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ConnectionForm from "./ConnectionForm";
import { SftpConnection } from "@prisma/client";

export default function EditConnectionDialog({
  open,
  onOpenChange,
  connection,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connection: SftpConnection;
}) {
  const sanitizedDefaults = {
    id: connection.id,
    name: connection.name,
    host: connection.host,
    port: connection.port,
    username: connection.username,
    password: connection.password ?? undefined,
    privateKey: connection.privateKey ?? undefined,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Connection</DialogTitle>
        </DialogHeader>
        <ConnectionForm
          mode="edit"
          defaultValues={sanitizedDefaults}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
