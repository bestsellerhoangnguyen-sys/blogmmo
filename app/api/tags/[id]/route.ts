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
  const color = body.color ? String(body.color).trim() : undefined;
  const description = body.description !== undefined ? (body.description ? String(body.description) : null) : undefined;
  const seoTitle = body.seoTitle !== undefined ? (body.seoTitle ? String(body.seoTitle) : null) : undefined;
  const seoDescription = body.seoDescription !== undefined ? (body.seoDescription ? String(body.seoDescription) : null) : undefined;
  const featured = body.featured !== undefined ? Boolean(body.featured) : undefined;

  const updated = await prisma.tag.update({
    where: { id: params.id },
    data: {
      ...(name ? { name } : {}),
      ...(slug ? { slug } : {}),
      ...(color ? { color } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(seoTitle !== undefined ? { seoTitle } : {}),
      ...(seoDescription !== undefined ? { seoDescription } : {}),
      ...(featured !== undefined ? { featured } : {}),
    },
  });

  return NextResponse.json({ id: updated.id, name: updated.name, slug: updated.slug, color: updated.color, description: updated.description, seoTitle: updated.seoTitle, seoDescription: updated.seoDescription, featured: updated.featured });
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!verifyCsrfToken(req.headers)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });

  await prisma.tag.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
