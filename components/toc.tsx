import Link from "next/link";
import { TocItem } from "@/lib/markdown";

export function Toc({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <aside className="rounded-2xl border border-black/10 bg-white p-4 text-sm shadow-sm dark:border-white/20 dark:bg-zinc-900">
      <p className="mb-2 text-sm font-semibold">Mục lục</p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={`${item.id}-${item.level}`} className={item.level === 3 ? "pl-3 text-xs" : ""}>
            <Link href={`#${item.id}`} className="text-zinc-600 hover:underline dark:text-zinc-300">
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
