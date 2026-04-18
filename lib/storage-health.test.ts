import { beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();

vi.mock("@aws-sdk/client-s3", () => {
  class MockS3Client {
    send = sendMock;
  }
  class MockHeadBucketCommand {
    constructor() {}
  }
  return {
    S3Client: MockS3Client,
    HeadBucketCommand: MockHeadBucketCommand,
  };
});

describe("checkS3Health", () => {
  beforeEach(() => {
    sendMock.mockReset();
    delete process.env.S3_ENDPOINT;
    delete process.env.S3_REGION;
    delete process.env.S3_BUCKET;
    delete process.env.S3_ACCESS_KEY_ID;
    delete process.env.S3_SECRET_ACCESS_KEY;
  });

  it("returns env missing when s3 is not configured", async () => {
    const { checkS3Health } = await import("@/lib/storage-health");
    const result = await checkS3Health();
    expect(result).toEqual({ enabled: false, ok: false, reason: "s3_env_missing" });
  });

  it("returns ok when head bucket succeeds", async () => {
    process.env.S3_ENDPOINT = "https://s3.us-east-1.amazonaws.com";
    process.env.S3_BUCKET = "bucket";
    process.env.S3_ACCESS_KEY_ID = "key";
    process.env.S3_SECRET_ACCESS_KEY = "secret";

    sendMock.mockResolvedValue({});

    const { checkS3Health } = await import("@/lib/storage-health");
    const result = await checkS3Health();

    expect(result).toEqual({ enabled: true, ok: true, bucket: "bucket" });
  });

  it("returns error metadata when head bucket fails", async () => {
    process.env.S3_ENDPOINT = "https://s3.us-east-1.amazonaws.com";
    process.env.S3_BUCKET = "bucket";
    process.env.S3_ACCESS_KEY_ID = "key";
    process.env.S3_SECRET_ACCESS_KEY = "secret";

    sendMock.mockRejectedValue({ name: "AccessDenied" });

    const { checkS3Health } = await import("@/lib/storage-health");
    const result = await checkS3Health();

    expect(result).toEqual({
      enabled: true,
      ok: false,
      bucket: "bucket",
      error: "AccessDenied",
    });
  });
});
