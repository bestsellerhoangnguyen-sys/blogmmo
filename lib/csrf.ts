import { cookies } from "next/headers";

const CSRF_COOKIE = "blogmmo_csrf";

export function verifyCsrfToken(headers: Headers) {
  const store = cookies();
  const cookieToken = store.get(CSRF_COOKIE)?.value;
  const headerToken = headers.get("x-csrf-token");
  return !!cookieToken && !!headerToken && cookieToken === headerToken;
}
