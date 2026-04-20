import Link from "next/link";
import { prisma } from "@/lib/db";
import { Breadcrumbs, EmptyState, PageHeader, Pill, Surface } from "@/components/ui";

type GuidesPageProps = {
  searchParams?: {
    q?: string;
    category?: string;
  };
};

export const dynamic = "force-dynamic";

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const q = searchParams?.q?.trim() || "";
  const category = searchParams?.category?.trim() || "";

  const categories = await prisma.guideCategory.findMany({ orderBy: { name: "asc" } });
  const guides = await prisma.guide.findMany({
    where: {
      published: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { summary: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { category: true, steps: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="space-y-5 sm:space-y-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />

      <section className="rounded-2xl border border-orange-500/40 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 p-5 text-white sm:p-7">
        <p className="text-[10px] uppercase tracking-[0.26em] text-orange-400">Practical Playbooks</p>
        <h1 className="mt-2 text-3xl font-black leading-tight sm:text-5xl">Guides</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
          Bộ hướng dẫn từng bước để triển khai website, tối ưu UI/UX và vận hành nội dung.
        </p>
      </section>

      <PageHeader title="Kho hướng dẫn" description="Tra cứu hướng dẫn theo danh mục và từ khóa." />

      <form className="grid gap-3 rounded-2xl border border-orange-500/30 bg-zinc-950 p-4 dark:border-orange-500/30 sm:grid-cols-3 sm:p-5">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search guide..."
          className="rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-sm text-zinc-100"
        />
        <select
          name="category"
          defaultValue={category}
          className="rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-sm text-zinc-100"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <button className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-black hover:bg-orange-400">Filter</button>
      </form>

      {guides.length === 0 ? (
        <EmptyState title="Không có guide phù hợp" subtitle="Thử đổi từ khóa hoặc category để tìm lại." />
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {guides.map((guide) => (
            <Surface key={guide.id}>
              <div className="mb-3 h-28 rounded-xl bg-gradient-to-br from-orange-500/40 via-zinc-900 to-zinc-950" />
              <h2 className="text-lg font-black leading-tight sm:text-2xl">{guide.title}</h2>
              <p className="text-xs uppercase tracking-wide text-gray-500">Category: {guide.category.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-200 sm:text-base">{guide.summary ?? "No summary"}</p>
              <div className="mt-2 flex items-center gap-2">
                <Pill>{guide.steps.length} steps</Pill>
              </div>
              <Link href={`/guides/${guide.slug}`} className="mt-3 inline-block rounded-lg border border-orange-500/50 px-3 py-1.5 text-sm font-semibold text-orange-500 transition hover:bg-orange-500/10">
                Xem hướng dẫn
              </Link>
            </Surface>
          ))}
        </div>
      )}
    </main>
  );
}
