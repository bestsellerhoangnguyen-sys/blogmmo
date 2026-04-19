import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (!session?.user?.email) return null;

  const adminEmail = process.env.AUTH_ADMIN_EMAIL;
  if (!adminEmail) return session;

  return session.user.email === adminEmail ? session : null;
}

export function isMutationMethod(method: string) {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase());
}
