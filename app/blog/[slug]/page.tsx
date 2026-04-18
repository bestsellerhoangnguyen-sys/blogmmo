import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site";
import { Breadcrumbs, Pill, Surface } from "@/components/ui";

type BlogDetailProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { tags: true },
  });

  if (!post) {
    return {
      title: "Not found | BlogMMO",
    };
  }

  const title = `${post.title} | BlogMMO`;
  const description = post.excerpt ?? siteConfig.description;
  const url = `${siteConfig.url}/blog/${post.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url,
      publishedTime: post.publishedAt?.toISOString(),
      tags: post.tags.map((t) => t.name),
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { tags: true },
  });

  if (!post || !post.published) notFound();

  return (
    <article className="mx-auto max-w-3xl space-y-4 sm:space-y-5">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]} />

      <Surface>
        <header className="space-y-2 border-b pb-4 dark:border-white/20">
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{post.title}</h1>
          <p className="text-sm text-gray-500">
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleString("vi-VN")
              : "Draft"}
          </p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Pill key={tag.id}>#{tag.name}</Pill>
            ))}
          </div>
        </header>

        <p className="mt-4 text-base leading-relaxed text-gray-700 dark:text-gray-200 sm:text-lg">{post.excerpt}</p>

        <section className="prose mt-4 max-w-none dark:prose-invert">
          <pre className="whitespace-pre-wrap rounded-lg border bg-gray-50 p-4 text-sm dark:border-white/20 dark:bg-zinc-950">
            {post.content}
          </pre>
        </section>
      </Surface>
    </article>
  );
}
