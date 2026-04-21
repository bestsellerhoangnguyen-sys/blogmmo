import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { verifyCsrfToken } from "@/lib/csrf";

type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!verifyCsrfToken(req.headers)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });

  const body = await req.json();
  const name = body.name ? String(body.name).trim() : undefined;
  const slug = body.slug ? String(body.slug).trim() : undefined;

  const updated = await prisma.tag.update({
    where: { id: params.id },
    data: { ...(name ? { name } : {}), ...(slug ? { slug } : {}) },
  });

  return NextResponse.json({ id: updated.id, name: updated.name, slug: updated.slug });
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!verifyCsrfToken(req.headers)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });

  await prisma.tag.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
