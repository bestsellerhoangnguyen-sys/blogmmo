import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log("[CSP-REPORT]", JSON.stringify(payload));
  } catch {
    // ignore malformed reports
  }
  return new NextResponse(null, { status: 204 });
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "csp-report" });
}
