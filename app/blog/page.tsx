import Link from "next/link";
import { prisma } from "@/lib/db";
import { Breadcrumbs, EmptyState, PageHeader, Pill, Surface } from "@/components/ui";

const PAGE_SIZE = 5;

type BlogPageProps = {
  searchParams?: {
    page?: string;
  };
};

export const dynamic = "force-dynamic";

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = Math.max(1, Number(searchParams?.page ?? "1") || 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const [total, posts] = await Promise.all([
    prisma.post.count({ where: { published: true } }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      skip,
      take: PAGE_SIZE,
      include: {
        tags: true,
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="space-y-5 sm:space-y-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <section className="ui-fade-in rounded-2xl border border-orange-500/40 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 p-5 text-white sm:p-7">
        <p className="text-[10px] uppercase tracking-[0.26em] text-orange-400">Editorial Feed</p>
        <h1 className="mt-2 text-3xl font-black leading-tight sm:text-5xl">Blog</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
          Danh sách bài viết thực chiến về UI/UX, product thinking và triển khai website.
        </p>
      </section>

      <PageHeader
        title="Kho bài viết"
        description={`Danh sách bài viết đã publish (${total} bài).`}
      />

      {posts.length === 0 ? (
        <EmptyState title="Chưa có bài viết nào" subtitle="Khi có bài publish, danh sách sẽ xuất hiện ở đây." />
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {posts.map((post) => (
            <Surface key={post.id}>
              <div className="mb-3 h-28 rounded-xl bg-gradient-to-br from-orange-500/40 via-zinc-900 to-zinc-950" />
              <h2 className="text-lg font-black leading-tight sm:text-2xl">{post.title}</h2>
              <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("vi-VN")
                  : "Chưa publish"}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-200 sm:text-base">
                {post.excerpt ?? "Chưa có mô tả ngắn."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Pill key={tag.id}>#{tag.name}</Pill>
                ))}
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="ui-rise mt-4 inline-block rounded-lg border border-orange-500/50 px-3 py-1.5 text-sm font-semibold text-orange-500 transition hover:bg-orange-500/10"
              >
                Đọc chi tiết
              </Link>
            </Surface>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4 dark:border-white/20">
        <Link
          href={currentPage > 1 ? `/blog?page=${currentPage - 1}` : "/blog?page=1"}
          className={`rounded-xl border border-zinc-400/40 px-3 py-2 text-sm ${
            currentPage <= 1 ? "pointer-events-none opacity-40" : ""
          }`}
        >
          ← Trang trước
        </Link>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Trang {currentPage}/{totalPages}
        </span>
        <Link
          href={
            currentPage < totalPages
              ? `/blog?page=${currentPage + 1}`
              : `/blog?page=${totalPages}`
          }
          className={`rounded-xl border border-zinc-400/40 px-3 py-2 text-sm ${
            currentPage >= totalPages ? "pointer-events-none opacity-40" : ""
          }`}
        >
          Trang sau →
        </Link>
      </div>
    </main>
  );
}
