import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { verifyCsrfToken } from "@/lib/csrf";
import { uploadImage } from "@/lib/storage";
import { logAdminAudit } from "@/lib/admin-audit";

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    logAdminAudit({ action: "upload", resource: "media", status: "failure", detail: { reason: "forbidden" } });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!verifyCsrfToken(req.headers)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploaded = await uploadImage(file.name, buffer);
  logAdminAudit({
    actor: session.user?.email,
    action: "upload",
    resource: "media",
    status: "success",
    detail: { name: file.name, url: uploaded.url },
  });
  return NextResponse.json(uploaded, { status: 201 });
}
