import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { verifyCsrfToken } from "@/lib/csrf";

const KEY = "blog_v2_settings";
export const dynamic = "force-dynamic";

export async function GET() {
  const row = await prisma.siteSetting.findUnique({ where: { key: KEY } });
  if (!row) return NextResponse.json({ settings: null });
  try {
    return NextResponse.json({ settings: JSON.parse(row.value) });
  } catch {
    return NextResponse.json({ settings: null });
  }
}

export async function PUT(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!verifyCsrfToken(req.headers)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  const body = await req.json();
  const settings = body.settings ?? body;
  const row = await prisma.siteSetting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(settings) },
    create: { key: KEY, value: JSON.stringify(settings) },
  });
  return NextResponse.json({ ok: true, updatedAt: row.updatedAt });
}
