import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import DashboardShell from "@/components/DashboardShell";
import ConnectionsPageClient from "@/modules/connections/ConnectionsPage";

export default async function ConnectionsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const connections = await db.sftpConnection.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const uiConnections = connections.map((c) => ({
    ...c,
    password: c.password ?? undefined,
    privateKey: c.privateKey ?? undefined,
  }));

  return (
    <DashboardShell>
      <ConnectionsPageClient initialConnections={uiConnections} />
    </DashboardShell>
  );
}
