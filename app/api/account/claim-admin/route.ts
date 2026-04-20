import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { verifyCsrfToken } from "@/lib/csrf";
import { logAdminAudit } from "@/lib/admin-audit";

export async function POST(req: Request) {
  const session = await requireAuth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!verifyCsrfToken(req.headers)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });

  const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
  if (adminCount > 0) {
    return NextResponse.json({ error: "Admin đã tồn tại, không thể claim thêm bằng flow bootstrap." }, { status: 403 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role: "ADMIN" },
    select: { id: true, email: true, role: true },
  });

  logAdminAudit({
    actor: session.user.email,
    action: "claim-admin",
    resource: "user",
    resourceId: updated.id,
    status: "success",
    detail: { email: updated.email, role: updated.role },
  });

  return NextResponse.json({ ok: true, user: updated });
}
