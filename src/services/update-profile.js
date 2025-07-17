"use server";

import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { getCurrentSession } from "@/services/session";

export async function updateProfile({ name, password }) {
  const session = await getCurrentSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = { name };

  if (password && password.trim() !== "") {
    const hashed = await bcrypt.hash(password, 10);
    data.password = hashed;
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data,
  });
}
