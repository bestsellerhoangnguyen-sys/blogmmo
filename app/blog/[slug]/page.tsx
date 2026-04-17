import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site";

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
    <article className="mx-auto max-w-3xl space-y-4">
      <header className="space-y-2 border-b pb-4 dark:border-white/20">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-sm text-gray-500">
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleString("vi-VN")
            : "Draft"}
        </p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag.id} className="rounded-full border px-2 py-1 text-xs dark:border-white/20">
              #{tag.name}
            </span>
          ))}
        </div>
      </header>

      <p className="text-lg text-gray-700 dark:text-gray-200">{post.excerpt}</p>

      <section className="prose max-w-none dark:prose-invert">
        <pre className="whitespace-pre-wrap rounded-lg border bg-gray-50 p-4 text-sm dark:border-white/20 dark:bg-zinc-900">
          {post.content}
        </pre>
      </section>
    </article>
  );
}
