import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { verifyCsrfToken } from "@/lib/csrf";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const approved = url.searchParams.get("approved");
  const where = approved === null ? {} : { approved: approved === "true" };
  const rows = await prisma.comment.findMany({ where, orderBy: { createdAt: "desc" }, take: 500 });
  return NextResponse.json({ comments: rows });
}

export async function POST(req: Request) {
  const body = await req.json();
  const postId = String(body.postId ?? "").trim();
  const author = String(body.author ?? "").trim();
  const email = String(body.email ?? "").trim();
  const content = String(body.content ?? "").trim();

  if (!postId || !author || !email || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const created = await prisma.comment.create({ data: { postId, author, email, content, approved: false } });
  return NextResponse.json(created, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!verifyCsrfToken(req.headers)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });

  const body = await req.json();
  const id = String(body.id ?? "");
  const approved = Boolean(body.approved);
  const updated = await prisma.comment.update({ where: { id }, data: { approved } });
  return NextResponse.json(updated);
}
