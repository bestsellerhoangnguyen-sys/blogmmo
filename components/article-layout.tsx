import Link from "next/link";
import { ReactNode } from "react";
import { Breadcrumbs, Pill, Surface } from "@/components/ui";

type ArticleLayoutProps = {
  title: string;
  excerpt?: string | null;
  publishedAt?: Date | null;
  updatedAt?: Date;
  readingMinutes: number;
  tags?: string[];
  actions?: ReactNode;
  children: ReactNode;
};

export function ArticleLayout({
  title,
  excerpt,
  publishedAt,
  updatedAt,
  readingMinutes,
  tags = [],
  actions,
  children,
}: ArticleLayoutProps) {
  const showUpdatedBadge =
    publishedAt && updatedAt
      ? updatedAt.getTime() - publishedAt.getTime() > 1000 * 60 * 60 * 24
      : false;

  return (
    <article className="mx-auto max-w-3xl space-y-4 sm:space-y-5">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: title }]} />

      <Surface>
        <div className="mb-4 rounded-xl border border-orange-500/40 bg-gradient-to-br from-zinc-950 to-black p-4 text-white">
          <p className="text-[10px] uppercase tracking-[0.24em] text-orange-400">Reader Mode</p>
          <p className="mt-2 text-lg font-extrabold leading-tight sm:text-2xl">{title}</p>
        </div>

        <header className="space-y-2 border-b pb-4 dark:border-white/20">
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>{publishedAt ? new Date(publishedAt).toLocaleString("vi-VN") : "Draft"}</span>
            <span>•</span>
            <span>{readingMinutes} phút đọc</span>
            {showUpdatedBadge ? (
              <>
                <span>•</span>
                <span className="rounded-full border px-2 py-0.5 text-xs">Updated</span>
              </>
            ) : null}
            <span>•</span>
            <Link href="/blog" className="hover:underline">← Quay lại Blog</Link>
          </div>
          {actions ? <div>{actions}</div> : null}
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Pill key={tag}>#{tag}</Pill>
              ))}
            </div>
          ) : null}
        </header>

        {excerpt ? <p className="mt-4 text-base leading-relaxed text-gray-700 dark:text-gray-200 sm:text-lg">{excerpt}</p> : null}

        <section className="reader-content prose mt-4 max-w-[68ch] dark:prose-invert">{children}</section>
      </Surface>
    </article>
  );
}
