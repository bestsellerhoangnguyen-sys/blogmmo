import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { verifyCsrfToken } from "@/lib/csrf";
import { logAdminAudit } from "@/lib/admin-audit";

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  const categories = await prisma.guideCategory.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { guides: true } } },
  });

  return NextResponse.json({
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      color: "#c2410c",
      count: c._count.guides,
    })),
  });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!verifyCsrfToken(req.headers)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });

  const body = await req.json();
  const name = String(body.name ?? "").trim();
  const rawSlug = String(body.slug ?? "").trim();
  const slug = rawSlug || slugify(name);

  if (!name || !slug) return NextResponse.json({ error: "Missing name/slug" }, { status: 400 });

  const created = await prisma.guideCategory.create({
    data: { name, slug },
  });

  logAdminAudit({
    actor: session.user?.email,
    action: "create",
    resource: "category",
    resourceId: created.id,
    status: "success",
    detail: { name: created.name, slug: created.slug },
  });

  return NextResponse.json({ id: created.id, name: created.name, slug: created.slug, color: "#c2410c" }, { status: 201 });
}
