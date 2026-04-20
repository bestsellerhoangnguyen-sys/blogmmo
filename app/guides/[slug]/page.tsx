import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { GuideProgress } from "@/components/guide-progress";
import { Breadcrumbs, Surface } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function GuideDetailPage({ params }: { params: { slug: string } }) {
  const guide = await prisma.guide.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      steps: { orderBy: { order: "asc" } },
    },
  });

  if (!guide || !guide.published) notFound();

  return (
    <article className="mx-auto max-w-3xl space-y-4 sm:space-y-5">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: guide.title }]} />
      <GuideProgress />

      <Surface>
        <div className="mb-4 rounded-xl border border-orange-500/40 bg-gradient-to-br from-zinc-950 to-black p-4 text-white">
          <p className="text-[10px] uppercase tracking-[0.24em] text-orange-400">Step-by-step Guide</p>
          <p className="mt-2 text-lg font-extrabold leading-tight sm:text-2xl">{guide.title}</p>
        </div>

        <header className="space-y-2 border-b pb-4 dark:border-white/20">
          <h1 className="text-2xl font-black leading-tight sm:text-3xl">{guide.title}</h1>
          <p className="text-xs uppercase tracking-wide text-gray-500">Category: {guide.category.name}</p>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200 sm:text-base">{guide.summary}</p>
        </header>

        <ol className="mt-4 space-y-4">
          {guide.steps.map((step) => (
            <li key={step.id} className="rounded-xl border border-orange-500/30 bg-zinc-950/70 p-4 dark:border-orange-500/30 sm:p-5">
              <h2 className="text-lg font-bold text-orange-400">Bước {step.order}: {step.title}</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-200 sm:text-base">{step.content}</p>
            </li>
          ))}
        </ol>
      </Surface>
    </article>
  );
}
