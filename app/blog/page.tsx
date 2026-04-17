import Link from "next/link";
import { prisma } from "@/lib/db";

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
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Blog</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Danh sách bài viết đã publish ({total} bài).
        </p>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <article key={post.id} className="rounded-lg border p-4 dark:border-white/20">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("vi-VN")
                : "Chưa publish"}
            </p>
            <p className="mt-3 text-gray-700 dark:text-gray-200">
              {post.excerpt ?? "Chưa có mô tả ngắn."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full border px-2 py-1 text-xs dark:border-white/20"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-4 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Đọc chi tiết →
            </Link>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-between border-t pt-4 dark:border-white/20">
        <Link
          href={currentPage > 1 ? `/blog?page=${currentPage - 1}` : "/blog?page=1"}
          className={`rounded border px-3 py-2 text-sm ${
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
          className={`rounded border px-3 py-2 text-sm ${
            currentPage >= totalPages ? "pointer-events-none opacity-40" : ""
          }`}
        >
          Trang sau →
        </Link>
      </div>
    </main>
  );
}
