"server-only";

import { prisma } from "@/lib/db";
import { workspaceDestroyerTask } from "@/trigger/destroyer";

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

export async function getWorkspace({ id, userId }) {
  const where = { id };
  if (userId) {
    where.userId = userId;
  }
  return await prisma.workspace.findUnique({
    where,
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function createWorkspace({ userId, name }) {
  try {
    const workspace = await prisma.workspace.create({
      data: {
        name: name ?? "New Workspace",
        userId,
        willDeletedAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // One day
      },
    });

    await workspaceDestroyerTask.trigger(
      { id: workspace.id },
      { delay: workspace.willDeletedAt },
    );

    return workspace;
  } catch (error) {
    console.error("[ERROR] Create Workspace:", error);
    throw new Error("Failed to create workspace. Please try again.");
  }
}

export async function updateWorkspace({ userId, id, name, willDeletedAt }) {
  try {
    const workspace = await getWorkspace({ id, userId });
    if (!workspace) {
      throw new Error("Workspace not found or unauthorized");
    }
    const data = {};
    if (name) {
      data.name = name;
    }
    if (willDeletedAt) {
      data.willDeletedAt = willDeletedAt;
    }

    const [updatedWorkspace, _] = await Promise.all([
      prisma.workspace.update({
        where: {
          id,
          userId,
        },
        data,
      }),
      workspaceDestroyerTask.trigger({ id }, { delay: willDeletedAt }),
    ]);

    return updatedWorkspace;
  } catch (error) {
    console.error("[ERROR] Update Workspace:", error);
    throw new Error("Failed to update workspace. Please try again.");
  }
}

export async function deleteWorkspace({ userId, id }) {
  try {
    const workspace = await getWorkspace({ id, userId });
    if (!workspace) {
      throw new Error("Workspace not found or unauthorized");
    }
    return await prisma.workspace.delete({
      where: { id },
    });
  } catch (error) {
    console.error("[ERROR] Delete Workspace:", error);
    throw new Error("Failed to delete workspace. Please try again.");
  }
}
