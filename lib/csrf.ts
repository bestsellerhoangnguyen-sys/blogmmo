import crypto from "crypto";
import { cookies } from "next/headers";

const CSRF_COOKIE = "blogmmo_csrf";

export function ensureCsrfToken() {
  const store = cookies();
  let token = store.get(CSRF_COOKIE)?.value;
  if (!token) {
    token = crypto.randomBytes(24).toString("hex");
    store.set(CSRF_COOKIE, token, {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
  }
  return token;
}

export function verifyCsrfToken(headers: Headers) {
  const store = cookies();
  const cookieToken = store.get(CSRF_COOKIE)?.value;
  const headerToken = headers.get("x-csrf-token");
  return !!cookieToken && !!headerToken && cookieToken === headerToken;
}
