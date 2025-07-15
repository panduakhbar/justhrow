"server-only";

import { prisma } from "@/lib/db";

export async function getAllWorkspace({ userId, sort = "desc", search }) {
  const where = { userId };
  if (search && typeof search === "string") {
    where.name = { contains: search, mode: "insensitive" };
  }

  return await prisma.workspace.findMany({
    where,
    include: {
      _count: {
        select: {
          contents: true,
        },
      },
    },
    orderBy: {
      createdAt: sort,
    },
  });
}

export async function getWorkspace({ id }) {
  return await prisma.workspace.findUnique({
    where: {
      id,
    },
  });
}

export async function createWorkspace({ userId, name }) {
  return await prisma.workspace.create({
    data: {
      name: name ?? "New Workspace",
      userId,
    },
  });
}

export async function updateWorkspace({ id, name, willDeletedAt }) {
  const data = {};
  if (name) {
    data.name = name;
  }
  if (willDeletedAt) {
    data.willDeletedAt = willDeletedAt;
  }
  return await prisma.workspace.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteWorkspace({ id }) {
  return await prisma.$transaction(async (tx) => {
    await tx.content.deleteMany({
      where: { workspaceId: id },
    });
    return await tx.workspace.delete({
      where: { id },
    });
  });
}
