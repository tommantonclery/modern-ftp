import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import mime from "mime-types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const connectionId = searchParams.get("connectionId");
  const filePath = searchParams.get("file");

  const session = await auth();
  if (!session?.user || !connectionId || !filePath) {
    return new Response("Unauthorized or invalid request", { status: 400 });
  }

  const connection = await db.sftpConnection.findUnique({
    where: { id: connectionId, userId: session.user.id },
  });

  if (!connection) return new Response("Connection not found", { status: 404 });

  const proxyUrl = new URL("http://localhost:4001/download");
  proxyUrl.searchParams.set("host", connection.host);
  proxyUrl.searchParams.set("port", String(connection.port));
  proxyUrl.searchParams.set("username", connection.username);
  if (connection.password) proxyUrl.searchParams.set("password", connection.password);
  if (connection.privateKey) proxyUrl.searchParams.set("privateKey", connection.privateKey);
  proxyUrl.searchParams.set("file", filePath);

  const res = await fetch(proxyUrl.toString());

  const ext = filePath.split(".").pop();
  const mimeType =
    res.headers.get("content-type") ||
    mime.lookup(ext || "") ||
    "application/octet-stream";

  return new Response(res.body, {
    status: 200,
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": `inline; filename="${filePath.split("/").pop()}"`,
    },
  });
}
