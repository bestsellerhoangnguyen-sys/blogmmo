import { NextResponse, type NextRequest } from "next/server";

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60 * 1000);
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX || 120);
const AUTH_WINDOW_MS = Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 60 * 1000);
const AUTH_MAX_REQUESTS = Number(process.env.AUTH_RATE_LIMIT_MAX || 20);
const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimitKey(req: NextRequest) {
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";
  return `${ip}:${req.nextUrl.pathname}`;
}

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api")) {
    const isAuthEndpoint = req.nextUrl.pathname.startsWith("/api/auth");
    const windowMs = isAuthEndpoint ? AUTH_WINDOW_MS : WINDOW_MS;
    const maxReq = isAuthEndpoint ? AUTH_MAX_REQUESTS : MAX_REQUESTS;
    const key = rateLimitKey(req);
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || now > bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
    } else {
      bucket.count += 1;
      if (bucket.count > maxReq) {
        const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
        return NextResponse.json(
          { error: "Too many requests", retryAfterSeconds: retryAfter },
          { status: 429, headers: { "Retry-After": String(retryAfter) } }
        );
      }
    }
  }

  const res = NextResponse.next();
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https:; object-src 'none';"
  );
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
