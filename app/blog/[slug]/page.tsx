import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site";
import { ArticleLayout } from "@/components/article-layout";
import { ReadingProgress } from "@/components/reading-progress";

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

  const wordCount = (post.content || "").trim().split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));

  return (
    <>
      <ReadingProgress />
      <ArticleLayout
        title={post.title}
        excerpt={post.excerpt}
        publishedAt={post.publishedAt}
        readingMinutes={readingMinutes}
        tags={post.tags.map((tag) => tag.name)}
      >
        <pre className="whitespace-pre-wrap rounded-lg border bg-gray-50 p-4 text-sm dark:border-white/20 dark:bg-zinc-950">
          {post.content}
        </pre>
      </ArticleLayout>
    </>
  );
}
