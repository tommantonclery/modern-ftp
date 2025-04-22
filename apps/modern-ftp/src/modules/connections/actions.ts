"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SftpConnectionSchema } from "@/validators/sftpConnection";

export async function createConnection(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  const raw = Object.fromEntries(formData.entries());
  const parsed = SftpConnectionSchema.safeParse(raw);

  if (!parsed.success) throw new Error("Invalid input");

  const data = parsed.data;

  await db.sftpConnection.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  });
}

export async function updateConnection(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Missing connection ID");

  const raw = Object.fromEntries(formData.entries());
  const parsed = SftpConnectionSchema.safeParse(raw);

  if (!parsed.success) throw new Error("Invalid input");

  const data = parsed.data;

  await db.sftpConnection.update({
    where: {
      id,
      userId: session.user.id,
    },
    data,
  });
}

export async function deleteConnection(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  await db.sftpConnection.delete({
    where: {
      id,
      userId: session.user.id,
    },
  });
}
