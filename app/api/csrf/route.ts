import { NextResponse } from "next/server";
import crypto from "crypto";

const CSRF_COOKIE = "blogmmo_csrf";

export async function GET() {
  const token = crypto.randomBytes(24).toString("hex");
  const res = NextResponse.json({ token });
  res.cookies.set(CSRF_COOKIE, token, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
