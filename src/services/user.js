"server-only";

import { prisma } from "@/lib/db";
import { hashPassword } from "./auth";

export async function getUserByEmail({ email, includePassword = false }) {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: includePassword,
    },
  });
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
  try {
    const hashedPassword = password ? await hashPassword(password) : undefined;
    return await prisma.user.create({
      data: { name, email, password: hashedPassword, avatarUrl },
    });
  } catch (error) {
    console.error("[ERROR] Create User:", error);
    throw new Error("Failed to create user. Please try again.");
  }
}

export async function updateUser({ id, name, password, avatarUrl }) {
  try {
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
  } catch (error) {
    console.error("[ERROR] Update User:", error);
    throw new Error("Failed to update user. Please try again.");
  }
}

export async function deleteUser({ id }) {
  try {
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
  } catch (error) {
    console.error("[ERROR] Delete User:", error);
    throw new Error("Failed to delete user. Please try again.");
  }
}
