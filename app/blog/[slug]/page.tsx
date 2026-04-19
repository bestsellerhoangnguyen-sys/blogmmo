import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site";
import { ArticleLayout } from "@/components/article-layout";
import { ReadingProgress } from "@/components/reading-progress";
import { Toc } from "@/components/toc";
import { extractToc, renderMarkdown } from "@/lib/markdown";
import { ShareActions } from "@/components/share-actions";
import { AuthorBox } from "@/components/author-box";

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
  const toc = extractToc(post.content || "");
  const html = await renderMarkdown(post.content || "");

  const relatedPosts = await prisma.post.findMany({
    where: {
      published: true,
      id: { not: post.id },
      tags: {
        some: {
          name: { in: post.tags.map((t) => t.name) },
        },
      },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
    include: { tags: true },
  });

  return (
    <>
      <ReadingProgress />

      <div className="grid gap-4 lg:grid-cols-[1fr_260px] lg:items-start">
        <ArticleLayout
          title={post.title}
          excerpt={post.excerpt}
          publishedAt={post.publishedAt}
          updatedAt={post.updatedAt}
          readingMinutes={readingMinutes}
          tags={post.tags.map((tag) => tag.name)}
          actions={<ShareActions title={post.title} url={`${siteConfig.url}/blog/${post.slug}`} />}
        >
          <div dangerouslySetInnerHTML={{ __html: html }} />

          <div className="mt-8 rounded-xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
            <p className="text-sm font-semibold">Tiếp theo nên đọc gì?</p>
            <div className="mt-2 flex flex-wrap gap-3 text-sm">
              <Link href="/guides" className="text-blue-600 hover:underline dark:text-blue-400">Xem Guides liên quan</Link>
              <Link href="/feed.xml" className="text-blue-600 hover:underline dark:text-blue-400">Subscribe RSS</Link>
            </div>
          </div>

          {relatedPosts.length > 0 ? (
            <div className="mt-8 space-y-3">
              <p className="text-base font-semibold">Bài liên quan</p>
              <div className="grid gap-2">
                {relatedPosts.map((item) => (
                  <Link
                    key={item.id}
                    href={`/blog/${item.slug}`}
                    className="rounded-lg border px-3 py-2 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <AuthorBox updatedAt={post.updatedAt} publishedAt={post.publishedAt} />
        </ArticleLayout>

        <div className="lg:sticky lg:top-24">
          <Toc items={toc} />
        </div>
      </div>
    </>
  );
}
