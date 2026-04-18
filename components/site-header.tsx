import Link from "next/link";
import { AuthControls } from "@/components/auth-controls";
import { ThemeToggle } from "@/components/theme-toggle";

const navClass =
  "rounded-full px-3 py-1.5 transition hover:bg-black/5 hover:text-black dark:hover:bg-white/10 dark:hover:text-white";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-white/90 backdrop-blur dark:border-white/20 dark:bg-zinc-950/90">
      <div className="mx-auto w-full max-w-5xl px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="rounded-full px-2 py-1 text-xl font-black tracking-tight">
              BlogMMO
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <AuthControls />
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
            <Link href="/blog" className={navClass}>Blog</Link>
            <Link href="/guides" className={navClass}>Guides</Link>
            <Link href="/admin" className={navClass}>Admin</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
