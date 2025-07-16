import { CLOUDFLARE_R2_BUCKET } from "@/lib/constant";
import { r2Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

export async function getPresignedUrl({ path, contentType, expiresIn = 300 }) {
  try {
    const command = new PutObjectCommand({
      Bucket: CLOUDFLARE_R2_BUCKET,
      Key: path,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(r2Client, command, {
      expiresIn,
    });

    return presignedUrl;
  } catch (error) {
    console.log("[S3] Failed to get Presigned URL: ", error);
    if (
      error.name === "CredentialsProviderError" ||
      error.name === "AccessDenied" ||
      error.name === "InvalidAccessKeyIdError" ||
      error.name === "SignatureDoesNotMatchError"
    ) {
      throw new Error("Authentication failed with R2 service.");
    } else if (
      error.code === "ECONNREFUSED" ||
      error.code === "ENOTFOUND" ||
      error.code === "ETIMEDOUT" ||
      error.name === "NetworkError"
    ) {
      throw new Error("Network connection failed.");
    } else {
      throw new Error(`Failed to generate presigned URL: ${error.message}`);
    }
  }
}
