import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { checkS3Health } from "@/lib/storage-health";

export async function GET() {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const health = await checkS3Health();
  return NextResponse.json({
    ok: health.ok,
    storage: health,
    ts: new Date().toISOString(),
  });
}
