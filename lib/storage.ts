import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

function getContentType(ext: string) {
  const e = ext.toLowerCase();
  if ([".jpg", ".jpeg"].includes(e)) return "image/jpeg";
  if (e === ".png") return "image/png";
  if (e === ".webp") return "image/webp";
  if (e === ".gif") return "image/gif";
  return "application/octet-stream";
}

function createS3Client() {
  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION || "auto";
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) return null;

  return new S3Client({
    endpoint,
    region,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export async function uploadImage(fileName: string, buffer: Buffer) {
  const ext = path.extname(fileName) || ".bin";
  const key = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

  const bucket = process.env.S3_BUCKET;
  const publicBase = process.env.S3_PUBLIC_BASE_URL;
  const s3 = createS3Client();

  if (s3 && bucket && publicBase) {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: getContentType(ext),
      })
    );
    return { key, url: `${publicBase.replace(/\/$/, "")}/${key}`, provider: "s3" as const };
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, key), buffer);
  return { key, url: `/uploads/${key}`, provider: "local" as const };
}
