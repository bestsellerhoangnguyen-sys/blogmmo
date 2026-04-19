import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { verifyCsrfToken } from "@/lib/csrf";
import { logAdminAudit } from "@/lib/admin-audit";

type Params = { params: { id: string } };

export async function PATCH(req: Request, { params }: Params) {
  const session = await requireAdmin();
  if (!session) {
    logAdminAudit({ action: "update", resource: "guide", resourceId: params.id, status: "failure", detail: { reason: "forbidden" } });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!verifyCsrfToken(req.headers)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });

  const body = await req.json();
  const updated = await prisma.guide.update({
    where: { id: params.id },
    data: {
      title: body.title,
      slug: body.slug,
      summary: body.summary,
      published: body.published,
    },
  });

  logAdminAudit({
    actor: session.user?.email,
    action: "update",
    resource: "guide",
    resourceId: updated.id,
    status: "success",
    detail: { slug: updated.slug, published: updated.published },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await requireAdmin();
  if (!session) {
    logAdminAudit({ action: "delete", resource: "guide", resourceId: params.id, status: "failure", detail: { reason: "forbidden" } });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!verifyCsrfToken(req.headers)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });

  await prisma.guide.delete({ where: { id: params.id } });
  logAdminAudit({ actor: session.user?.email, action: "delete", resource: "guide", resourceId: params.id, status: "success" });
  return NextResponse.json({ ok: true });
}
