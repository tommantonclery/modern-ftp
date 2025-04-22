import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const formData = await req.formData();
  const connectionId = formData.get("connectionId") as string;
  const path = formData.get("path") as string;
  const file = formData.get("file") as File;

  const session = await auth();
  if (!session?.user || !connectionId || !file || !path) {
    return new Response("Unauthorized or invalid", { status: 400 });
  }

  const connection = await db.sftpConnection.findUnique({
    where: { id: connectionId, userId: session.user.id },
  });

  if (!connection) return new Response("Connection not found", { status: 404 });

  const proxyForm = new FormData();
  proxyForm.set("host", connection.host);
  proxyForm.set("port", connection.port.toString());
  proxyForm.set("username", connection.username);
  if (connection.password) proxyForm.set("password", connection.password);
  if (connection.privateKey) proxyForm.set("privateKey", connection.privateKey);
  proxyForm.set("path", path);
  proxyForm.set("file", file);

  const uploadRes = await fetch("http://localhost:4001/upload", {
    method: "POST",
    body: proxyForm,
  });

  if (!uploadRes.ok) return new Response("Upload failed", { status: 500 });
  return new Response("Uploaded");
}
