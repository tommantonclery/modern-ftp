import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const connections = await db.sftpConnection.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(connections);
}
