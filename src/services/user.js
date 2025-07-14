"server-only";

import { prisma } from "@/lib/db";
import { hashPassword } from "./auth";

export async function getUserByEmail(email, withPassword = false) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: withPassword,
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: withPassword ? user.password : undefined,
  };
}

export async function getUserById({ id }) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

export async function createUser({ name, email, password, avatarUrl }) {
  const hashedPassword = password ? await hashPassword(password) : undefined;
  return await prisma.user.create({
    data: { name, email, password: hashedPassword, avatarUrl },
  });
}

export async function updateUser({ id, name, password, avatarUrl }) {
  const data = {};
  if (name) {
    data.name = name;
  }
  if (password) {
    data.password = await hashPassword(password);
  }
  if (avatarUrl) {
    data.avatarUrl = avatarUrl;
  }

  return await prisma.user.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteUser({ id }) {
  await prisma.$transaction(async (tx) => {
    await tx.content.deleteMany({
      where: {
        userId: id,
      },
    });
    await tx.workspace.deleteMany({
      where: {
        userId: id,
      },
    });
    await tx.user.delete({
      where: { id },
    });
  });
}
