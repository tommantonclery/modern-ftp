import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const { connectionId, path = "." } = await req.json();

  const conn = await db.sftpConnection.findUnique({
    where: {
      id: connectionId,
      userId: session.user.id,
    },
  });

  if (!conn) return new Response("Connection not found", { status: 404 });

  try {
    const res = await fetch("http://localhost:4001/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: conn.host,
        port: conn.port,
        username: conn.username,
        password: conn.password || undefined,
        privateKey: conn.privateKey || undefined,
        path,
      }),
    });

    if (!res.ok) {
      return new Response("Microservice error", { status: 500 });
    }

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error(err);
    return new Response("Unexpected error", { status: 500 });
  }
}
