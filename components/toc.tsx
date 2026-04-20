import Link from "next/link";
import { TocItem } from "@/lib/markdown";

export function Toc({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <aside className="rounded-2xl border border-orange-500/40 bg-zinc-950 p-4 text-sm text-zinc-100 shadow-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-400">Mục lục</p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={`${item.id}-${item.level}`} className={item.level === 3 ? "pl-3 text-xs" : ""}>
            <Link href={`#${item.id}`} className="text-zinc-300 hover:text-orange-300 hover:underline">
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
