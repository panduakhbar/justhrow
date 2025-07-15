"server-only";

import { CLOUDFLARE_R2_DEFAULT_PRESIGNED_EXPIRES_IN } from "@/lib/constant";
import { prisma } from "@/lib/db";
import { getPresignedUrl } from "./s3";
import { secondsUntil } from "@/lib/utils";

export async function getAllContent({ workspaceId, sort = "desc" }) {
  const now = new Date();
  const [workspace, contents] = await prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.findUnique({
      where: {
        id: workspaceId,
      },
    });
    const contents = await tx.content.findMany({
      where: {
        workspaceId,
      },
      orderBy: {
        createdAt: sort,
      },
    });

    return [workspace, contents];
  });

  const contentsWithImage = [];
  for (const content of contents) {
    let expiresIn = CLOUDFLARE_R2_DEFAULT_PRESIGNED_EXPIRES_IN;
    if (content.willDeletedAt) {
      expiresIn = secondsUntil({ now, futureDate: content.willDeletedAt });
    } else if (workspace?.willDeletedAt) {
      expiresIn = secondsUntil({ now, futureDate: workspace.willDeletedAt });
    }

    contentsWithImage.push({
      ...content,
      presignedUrl: await getPresignedUrl({ path: content.url, expiresIn }),
    });
  }

  return contentsWithImage;
}

export async function getContent({ id }) {
  return await prisma.content.findUnique({
    where: { id },
  });
}

export async function createContent({
  userId,
  workspaceId,
  name,
  mimetype,
  url,
  size,
}) {
  return await prisma.content.create({
    data: {
      name,
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
