import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function HomePage() {
  // Hotfix: fallback to stable reader while v2 runtime is being repaired.
  redirect("/personal-blog-full/index.html");
}
