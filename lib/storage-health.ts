import { HeadBucketCommand, S3Client } from "@aws-sdk/client-s3";

export async function checkS3Health() {
  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION || "us-east-1";
  const bucket = process.env.S3_BUCKET;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    return { enabled: false, ok: false, reason: "s3_env_missing" as const };
  }

  const client = new S3Client({
    endpoint,
    region,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });

  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
    return { enabled: true, ok: true, bucket };
  } catch (error: unknown) {
    const errorName =
      typeof error === "object" && error && "name" in error
        ? String((error as { name?: string }).name || "S3Error")
        : "S3Error";
    return { enabled: true, ok: false, bucket, error: errorName };
  }
}
