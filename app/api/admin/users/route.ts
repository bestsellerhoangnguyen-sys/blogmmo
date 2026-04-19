import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { verifyCsrfToken } from "@/lib/csrf";
import { logAdminAudit } from "@/lib/admin-audit";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json(users);
}

export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    logAdminAudit({ action: "update", resource: "user", status: "failure", detail: { reason: "forbidden" } });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!verifyCsrfToken(req.headers)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });

  const body = await req.json();
  const id = String(body.id ?? "");
  const role = String(body.role ?? "USER").toUpperCase();

  if (!id || !["USER", "ADMIN"].includes(role)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
  });

  logAdminAudit({
    actor: session.user?.email,
    action: "update-role",
    resource: "user",
    resourceId: updated.id,
    status: "success",
    detail: { email: updated.email, role: updated.role },
  });

  return NextResponse.json(updated);
}
