CREATE TABLE IF NOT EXISTS "public"."Comment" (
  "id" TEXT NOT NULL,
  "postId" TEXT NOT NULL,
  "author" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "approved" BOOLEAN NOT NULL DEFAULT false,
  "likes" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Comment_postId_idx" ON "public"."Comment"("postId");
CREATE INDEX IF NOT EXISTS "Comment_approved_idx" ON "public"."Comment"("approved");

CREATE TABLE IF NOT EXISTS "public"."Subscriber" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Subscriber_email_key" ON "public"."Subscriber"("email");

CREATE TABLE IF NOT EXISTS "public"."SiteSetting" (
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
);
