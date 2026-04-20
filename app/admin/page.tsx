import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await requireAdmin();
  if (!session) redirect("/login");
  redirect("/personal-blog-full/admin.html");
}
