import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { verifyCsrfToken } from "@/lib/csrf";

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
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return NextResponse.json({
    tags: tags.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      count: t._count.posts,
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

  const created = await prisma.tag.create({ data: { name, slug } });
  return NextResponse.json({ id: created.id, name: created.name, slug: created.slug }, { status: 201 });
}
