import { CLOUDFLARE_R2_BUCKET } from "@/lib/constant";
import { r2Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createId } from "@paralleldrive/cuid2";

export async function upload({ file, folder }) {
  const ext = file.name.split(".").at(-1);
  const name = file.name.split(".").slice(0, -1).join(".");
  const filename = `${name}-${createId()}.${ext}`;

  const path = `${folder}/${filename}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: CLOUDFLARE_R2_BUCKET,
        Key: path,
        ContentType: file.type,
        Body: buffer,
      }),
    );
    return path;
  } catch (error) {
    console.log("[S3] Upload failed. error: ", error);
    return null;
  }
}

export async function uploadMany({ files, folder }) {
  return await Promise.all(files.map((file) => upload({ file, folder })));
}

export async function getPresignedUrl({ path, expiresIn = 3600 }) {
  // should return url
  return "";
}
