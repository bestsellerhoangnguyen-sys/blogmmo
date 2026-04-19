import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { checkS3Health } from "@/lib/storage-health";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const health = await checkS3Health();
  return NextResponse.json({
    ok: health.ok,
    storage: health,
    ts: new Date().toISOString(),
  });
}
