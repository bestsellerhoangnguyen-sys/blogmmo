import Link from "next/link";
import { PageHeader, Pill, Surface } from "@/components/ui";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const latestPosts = await prisma.post
    .findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    })
    .catch(() => []);

  return (
    <main className="space-y-5 sm:space-y-6">
      <section className="rounded-2xl border border-orange-500/40 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 p-5 text-white sm:p-7">
        <p className="text-[10px] uppercase tracking-[0.3em] text-orange-400">Design-driven Knowledge Hub</p>
        <h1 className="mt-2 text-3xl font-black leading-tight sm:text-5xl">BlogMMO</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
          Nơi tổng hợp kiến thức UI/UX và hướng dẫn triển khai website theo hướng thực chiến.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/blog" className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-black hover:bg-orange-400">Đọc Blog</Link>
          <Link href="/guides" className="rounded-xl border border-zinc-700 px-4 py-2 text-sm hover:bg-white/10">Xem Guides</Link>
        </div>
      </section>

      <PageHeader
        title="Khám phá nội dung"
        description="Truy cập nhanh các khu vực chính để viết, đọc, và quản trị nội dung."
      />

      <Surface>
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          <Link className="rounded-xl border border-orange-500/30 bg-zinc-950 p-4 text-zinc-100 transition hover:-translate-y-0.5 hover:border-orange-400/60" href="/blog">
            <p className="text-base font-semibold sm:text-lg">📚 Blog</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-400">Danh sách bài viết, phân trang, đọc chi tiết.</p>
          </Link>
          <Link className="rounded-xl border border-orange-500/30 bg-zinc-950 p-4 text-zinc-100 transition hover:-translate-y-0.5 hover:border-orange-400/60" href="/guides">
            <p className="text-base font-semibold sm:text-lg">🧭 Guides</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-400">Hướng dẫn theo bước, filter/search rõ ràng.</p>
          </Link>
          <Link className="rounded-xl border border-orange-500/30 bg-zinc-950 p-4 text-zinc-100 transition hover:-translate-y-0.5 hover:border-orange-400/60" href="/admin">
            <p className="text-base font-semibold sm:text-lg">⚙️ Admin</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-400">Quản trị nội dung bài viết và hướng dẫn.</p>
          </Link>
        </div>
      </Surface>

      <Surface>
        <div className="space-y-3">
          <h2 className="text-lg font-bold sm:text-xl">Bài mới nổi bật</h2>
          {latestPosts.length === 0 ? (
            <p className="text-sm text-zinc-500">Chưa có bài viết published.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="rounded-xl border border-black/10 p-3 transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10">
                  <div className="mb-2 h-24 rounded-lg bg-gradient-to-br from-orange-500/40 to-zinc-900" />
                  <p className="text-sm font-semibold leading-snug">{post.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("vi-VN") : "Draft"}</p>
                </Link>
              ))}
            </div>
          )}
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
