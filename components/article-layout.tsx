import Link from "next/link";
import { ReactNode } from "react";
import { Breadcrumbs, Pill, Surface } from "@/components/ui";

type ArticleLayoutProps = {
  title: string;
  excerpt?: string | null;
  publishedAt?: Date | null;
  readingMinutes: number;
  tags?: string[];
  children: ReactNode;
};

export function ArticleLayout({
  title,
  excerpt,
  publishedAt,
  readingMinutes,
  tags = [],
  children,
}: ArticleLayoutProps) {
  return (
    <article className="mx-auto max-w-3xl space-y-4 sm:space-y-5">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: title }]} />

      <Surface>
        <header className="space-y-2 border-b pb-4 dark:border-white/20">
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>{publishedAt ? new Date(publishedAt).toLocaleString("vi-VN") : "Draft"}</span>
            <span>•</span>
            <span>{readingMinutes} phút đọc</span>
            <span>•</span>
            <Link href="/blog" className="hover:underline">← Quay lại Blog</Link>
          </div>
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Pill key={tag}>#{tag}</Pill>
              ))}
            </div>
          ) : null}
        </header>

        {excerpt ? <p className="mt-4 text-base leading-relaxed text-gray-700 dark:text-gray-200 sm:text-lg">{excerpt}</p> : null}

        <section className="prose mt-4 max-w-[68ch] dark:prose-invert">{children}</section>
      </Surface>
    </article>
  );
}
