import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { verifyCsrfToken } from "@/lib/csrf";
import { uploadImage } from "@/lib/storage";

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!verifyCsrfToken(req.headers)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploaded = await uploadImage(file.name, buffer);
  return NextResponse.json(uploaded, { status: 201 });
}
