import Link from "next/link";

export default function Home() {
  return (
    <main className="space-y-6">
      <section className="space-y-3 rounded-xl border p-6 dark:border-white/20">
        <h1 className="text-3xl font-bold">BlogMMO Project</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Đã hoàn thành nền tảng Day 1: auth cơ bản, layout tổng, dark mode và blog listing phân trang.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Link className="rounded-lg border p-4 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10" href="/blog">
          📚 Blog listing
        </Link>
        <Link className="rounded-lg border p-4 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10" href="/login">
          🔐 Login / Session
        </Link>
        <Link className="rounded-lg border p-4 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10" href="/guides">
          🧭 Guides (placeholder)
        </Link>
      </section>
    </main>
  );
}
