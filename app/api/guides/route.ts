import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { verifyCsrfToken } from "@/lib/csrf";
import { logAdminAudit } from "@/lib/admin-audit";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const guides = await prisma.guide.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, steps: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(guides);
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    logAdminAudit({ action: "create", resource: "guide", status: "failure", detail: { reason: "forbidden" } });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!verifyCsrfToken(req.headers)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });

  const body = await req.json();
  const title = String(body.title ?? "").trim();
  const slug = String(body.slug ?? "").trim();
  const categorySlug = String(body.categorySlug ?? "").trim();

  if (!title || !slug || !categorySlug) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const category = await prisma.guideCategory.upsert({
    where: { slug: categorySlug },
    update: { name: body.categoryName ? String(body.categoryName) : categorySlug },
    create: { slug: categorySlug, name: body.categoryName ? String(body.categoryName) : categorySlug },
  });

  const guide = await prisma.guide.create({
    data: {
      title,
      slug,
      summary: body.summary ? String(body.summary) : null,
      published: Boolean(body.published),
      categoryId: category.id,
      steps: {
        create: Array.isArray(body.steps)
          ? body.steps.map((step: { title: string; content: string }, idx: number) => ({
              title: step.title,
              content: step.content,
              order: idx + 1,
            }))
          : [],
      },
    },
    include: { category: true, steps: true },
  });

  logAdminAudit({
    actor: session.user?.email,
    action: "create",
    resource: "guide",
    resourceId: guide.id,
    status: "success",
    detail: { slug: guide.slug, published: guide.published },
  });

  return NextResponse.json(guide, { status: 201 });
}
