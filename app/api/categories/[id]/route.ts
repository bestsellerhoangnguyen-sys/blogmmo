import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { verifyCsrfToken } from "@/lib/csrf";
import { logAdminAudit } from "@/lib/admin-audit";

type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!verifyCsrfToken(req.headers)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });

  const body = await req.json();
  const name = body.name ? String(body.name).trim() : undefined;
  const slug = body.slug ? String(body.slug).trim() : undefined;

  const updated = await prisma.guideCategory.update({
    where: { id: params.id },
    data: { ...(name ? { name } : {}), ...(slug ? { slug } : {}) },
  });

  logAdminAudit({
    actor: session.user?.email,
    action: "update",
    resource: "category",
    resourceId: updated.id,
    status: "success",
    detail: { name: updated.name, slug: updated.slug },
  });

  return NextResponse.json({ id: updated.id, name: updated.name, slug: updated.slug, color: "#c2410c" });
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!verifyCsrfToken(req.headers)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });

  const count = await prisma.guide.count({ where: { categoryId: params.id } });
  if (count > 0) return NextResponse.json({ error: "Category has guides" }, { status: 400 });

  await prisma.guideCategory.delete({ where: { id: params.id } });

  logAdminAudit({
    actor: session.user?.email,
    action: "delete",
    resource: "category",
    resourceId: params.id,
    status: "success",
  });

  return NextResponse.json({ ok: true });
}
