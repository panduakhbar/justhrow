"server-only";

import { prisma } from "@/lib/db";
import { hashPassword } from "./auth";

export async function createUser({ name, email, password }) {
  const hashedPassword = await hashPassword(password);
  return await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
}

export async function getUserByEmail({ email, password = false }) {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password,
    },
  });
}

export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}
