import Link from "next/link";
import { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-gradient-to-b from-white to-zinc-50 p-4 dark:border-white/20 dark:from-zinc-900 dark:to-zinc-950 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
      {items.map((item, idx) => (
        <div key={`${item.label}-${idx}`} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="hover:text-zinc-900 hover:underline dark:hover:text-white">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-zinc-700 dark:text-zinc-200">{item.label}</span>
          )}
          {idx < items.length - 1 ? <span>›</span> : null}
        </div>
      ))}
    </div>
  );
}

export function Surface({ children }: { children: ReactNode }) {
  return <section className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/20 dark:bg-zinc-900 sm:p-5">{children}</section>;
}

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
      <p className="text-base font-semibold">{title}</p>
      {subtitle ? <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p> : null}
    </div>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-zinc-300 px-2.5 py-1 text-xs text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">{children}</span>;
}
