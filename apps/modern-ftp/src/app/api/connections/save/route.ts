import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { id, name, host, port, username, password, privateKey } = body;

  try {
    if (id) {
      // Update existing connection
      await db.sftpConnection.update({
        where: {
          id,
          userId: session.user.id,
        },
        data: {
          name,
          host,
          port,
          username,
          password,
          privateKey,
        },
      });
    } else {
      // Create new connection
      await db.sftpConnection.create({
        data: {
          userId: session.user.id,
          name,
          host,
          port,
          username,
          password,
          privateKey,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[CONNECTION_SAVE_ERROR]", err);
    return NextResponse.json({ error: "Failed to save connection" }, { status: 500 });
  }
}
