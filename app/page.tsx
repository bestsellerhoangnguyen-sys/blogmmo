import Link from "next/link";
import { PageHeader, Pill, Surface } from "@/components/ui";

export default function Home() {
  return (
    <main className="space-y-6">
      <PageHeader
        title="BlogMMO"
        description="Nền tảng Blog + Guide, tối ưu để viết nhanh, đọc mượt và vận hành an toàn."
      />

      <Surface>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link className="rounded-xl border border-black/10 p-4 transition hover:-translate-y-0.5 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10" href="/blog">
            <p className="text-base font-semibold">📚 Blog</p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Danh sách bài viết, phân trang, đọc chi tiết.</p>
          </Link>
          <Link className="rounded-xl border border-black/10 p-4 transition hover:-translate-y-0.5 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10" href="/guides">
            <p className="text-base font-semibold">🧭 Guides</p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Hướng dẫn theo bước, filter/search rõ ràng.</p>
          </Link>
          <Link className="rounded-xl border border-black/10 p-4 transition hover:-translate-y-0.5 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10" href="/admin">
            <p className="text-base font-semibold">⚙️ Admin</p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Quản trị nội dung bài viết và hướng dẫn.</p>
          </Link>
        </div>
      </Surface>

      <div className="flex flex-wrap gap-2">
        <Pill>Next.js App Router</Pill>
        <Pill>Prisma + PostgreSQL</Pill>
        <Pill>Dark mode</Pill>
      </div>
    </main>
  );
}
