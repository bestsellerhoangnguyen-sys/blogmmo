CREATE TABLE IF NOT EXISTS "public"."AdminAuditLog" (
  "id" TEXT NOT NULL,
  "actor" TEXT,
  "action" TEXT NOT NULL,
  "resource" TEXT NOT NULL,
  "resourceId" TEXT,
  "status" TEXT NOT NULL,
  "detail" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AdminAuditLog_createdAt_idx" ON "public"."AdminAuditLog"("createdAt");
CREATE INDEX IF NOT EXISTS "AdminAuditLog_resource_action_idx" ON "public"."AdminAuditLog"("resource", "action");
