import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import DashboardShell from "@/components/DashboardShell";
import FilesPageClient from "@/modules/files/FilesPage";

export default async function FilesPage() {
  const session = await auth();
  if (!session?.user) return null;

  const connections = await db.sftpConnection.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell>
      <FilesPageClient connections={connections} />
    </DashboardShell>
  );
}
