import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { verifyCsrfToken } from "@/lib/csrf";

type Params = { params: { id: string } };

export async function DELETE(req: Request, { params }: Params) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!verifyCsrfToken(req.headers)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  await prisma.comment.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: Params) {
  const body = await req.json();
  const likes = Number(body.likes ?? 0);
  const updated = await prisma.comment.update({ where: { id: params.id }, data: { likes } });
  return NextResponse.json(updated);
}
