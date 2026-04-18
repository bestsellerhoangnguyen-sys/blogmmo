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
      <PageHeader title="Guides" description="Tra cứu hướng dẫn theo danh mục và từ khóa." />

      <form className="grid gap-3 rounded-2xl border p-4 dark:border-white/20 sm:grid-cols-3 sm:p-5">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search guide..."
          className="rounded-xl border p-2.5 text-sm dark:border-white/20 dark:bg-zinc-900"
        />
        <select
          name="category"
          defaultValue={category}
          className="rounded-xl border p-2.5 text-sm dark:border-white/20 dark:bg-zinc-900"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <button className="rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black">Filter</button>
      </form>

      {guides.length === 0 ? (
        <EmptyState title="Không có guide phù hợp" subtitle="Thử đổi từ khóa hoặc category để tìm lại." />
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {guides.map((guide) => (
            <Surface key={guide.id}>
              <h2 className="text-lg font-semibold leading-tight sm:text-xl">{guide.title}</h2>
              <p className="text-sm text-gray-500">Category: {guide.category.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-200 sm:text-base">{guide.summary ?? "No summary"}</p>
              <div className="mt-2 flex items-center gap-2">
                <Pill>{guide.steps.length} steps</Pill>
              </div>
              <Link href={`/guides/${guide.slug}`} className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                Xem hướng dẫn →
              </Link>
            </Surface>
          ))}
        </div>
      )}
    </main>
  );
}
