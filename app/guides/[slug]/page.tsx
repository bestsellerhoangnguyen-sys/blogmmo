import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { GuideProgress } from "@/components/guide-progress";

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
    <article className="mx-auto max-w-3xl space-y-4">
      <GuideProgress />
      <header className="space-y-2 border-b pb-4 dark:border-white/20">
        <h1 className="text-3xl font-bold">{guide.title}</h1>
        <p className="text-sm text-gray-500">Category: {guide.category.name}</p>
        <p className="text-gray-700 dark:text-gray-200">{guide.summary}</p>
      </header>

      <ol className="space-y-4">
        {guide.steps.map((step) => (
          <li key={step.id} className="rounded border p-4 dark:border-white/20">
            <h2 className="text-lg font-semibold">Bước {step.order}: {step.title}</h2>
            <p className="mt-2 whitespace-pre-wrap text-gray-700 dark:text-gray-200">{step.content}</p>
          </li>
        ))}
      </ol>
    </article>
  );
}
