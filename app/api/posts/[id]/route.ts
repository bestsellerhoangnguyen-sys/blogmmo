import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { verifyCsrfToken } from "@/lib/csrf";
import { logAdminAudit } from "@/lib/admin-audit";

type Params = { params: { id: string } };

export async function PATCH(req: Request, { params }: Params) {
  const session = await requireAdmin();
  if (!session) {
    logAdminAudit({ action: "update", resource: "post", resourceId: params.id, status: "failure", detail: { reason: "forbidden" } });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!verifyCsrfToken(req.headers)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });

  const body = await req.json();

  const post = await prisma.post.update({
    where: { id: params.id },
    data: {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      published: body.published,
      publishedAt: body.published ? new Date() : null,
    },
  });

  logAdminAudit({
    actor: session.user?.email,
    action: "update",
    resource: "post",
    resourceId: post.id,
    status: "success",
    detail: { slug: post.slug, published: post.published },
  });

  return NextResponse.json(post);
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await requireAdmin();
  if (!session) {
    logAdminAudit({ action: "delete", resource: "post", resourceId: params.id, status: "failure", detail: { reason: "forbidden" } });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!verifyCsrfToken(req.headers)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });

  await prisma.post.delete({ where: { id: params.id } });
  logAdminAudit({ actor: session.user?.email, action: "delete", resource: "post", resourceId: params.id, status: "success" });
  return NextResponse.json({ ok: true });
}
