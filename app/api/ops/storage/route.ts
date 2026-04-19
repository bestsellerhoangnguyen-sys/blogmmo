import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { checkS3Health } from "@/lib/storage-health";
import { logAdminAudit } from "@/lib/admin-audit";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    logAdminAudit({ action: "healthcheck", resource: "storage", status: "failure", detail: { reason: "forbidden" } });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const health = await checkS3Health();
  logAdminAudit({
    actor: session.user?.email,
    action: "healthcheck",
    resource: "storage",
    status: health.ok ? "success" : "failure",
    detail: {
      enabled: health.enabled,
      bucket: "bucket" in health ? health.bucket : undefined,
      reason: "reason" in health ? health.reason : undefined,
    },
  });
  return NextResponse.json({
    ok: health.ok,
    storage: health,
    ts: new Date().toISOString(),
  });
}
