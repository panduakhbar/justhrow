"server-only";

import { prisma } from "@/lib/db";

export async function getAllContent({ workspaceId, sort = "desc" }) {
  return await prisma.content.findMany({
    where: {
      workspaceId,
    },
    orderBy: {
      createdAt: sort,
    },
  });
}

export async function getContent({ id }) {
  return await prisma.content.findUnique({
    where: { id },
  });
}

export async function createContent({
  userId,
  workspaceId,
  mimetype,
  url,
  size,
}) {
  return await prisma.content.create({
    data: {
      userId,
      workspaceId,
      mimetype,
      url,
      size,
    },
  });
}

export async function createContentMany({ data }) {
  return await prisma.content.createMany({
    data,
  });
}

export async function updateContent({ id, willDeletedAt }) {
  return await prisma.content.update({
    where: {
      id,
    },
    data: {
      willDeletedAt,
    },
  });
}

export async function deleteContent({ id }) {
  return await prisma.content.delete({
    where: {
      id,
    },
  });
}
