"use server";

import { prisma } from "@/lib/db";
import { r2Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadFileAction(_, formData) {
  const file = formData.get("file");

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = file.name;

  try {
    const fileUpload = await r2Client.send(
      new PutObjectCommand({
        Bucket: "justhrow",
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    const url = `${key}`;

    await prisma.content.create({
      data: {
        url,
        mimetype: file.type,
        size: file.size,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: {
        errors: ["Something went wrong."],
      },
    };
  }
}
