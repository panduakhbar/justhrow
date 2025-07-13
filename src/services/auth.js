"server-only";

import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export async function createSession(userId) {
  // 30 days in milliseconds
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  return await prisma.session.create({
    data: { userId, expiresAt },
  });
}
