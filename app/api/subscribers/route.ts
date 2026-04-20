import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { verifyCsrfToken } from "@/lib/csrf";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const rows = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" }, take: 1000 });
  return NextResponse.json({ subscribers: rows });
}

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
  const created = await prisma.subscriber.upsert({
    where: { email },
    update: {},
    create: { email },
  });
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!verifyCsrfToken(req.headers)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  const body = await req.json();
  const id = String(body.id ?? "");
  await prisma.subscriber.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
