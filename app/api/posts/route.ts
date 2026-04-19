import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { verifyCsrfToken } from "@/lib/csrf";
import { logAdminAudit } from "@/lib/admin-audit";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { tags: true },
  });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    logAdminAudit({ action: "create", resource: "post", status: "failure", detail: { reason: "forbidden" } });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!verifyCsrfToken(req.headers)) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  const body = await req.json();
  const title = String(body.title ?? "").trim();
  const slug = String(body.slug ?? "").trim();
  const content = String(body.content ?? "");

  if (!title || !slug || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      excerpt: body.excerpt ? String(body.excerpt) : null,
      content,
      published: Boolean(body.published),
      publishedAt: body.published ? new Date() : null,
    },
  });

  logAdminAudit({
    actor: session.user?.email,
    action: "create",
    resource: "post",
    resourceId: post.id,
    status: "success",
    detail: { slug: post.slug, published: post.published },
  });

  return NextResponse.json(post, { status: 201 });
}
