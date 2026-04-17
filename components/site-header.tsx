import Link from "next/link";
import { AuthControls } from "@/components/auth-controls";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="border-b border-black/10 dark:border-white/20">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold">
            BlogMMO
          </Link>
          <nav className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <Link href="/blog">Blog</Link>
            <Link href="/guides">Guides</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AuthControls />
        </div>
      </div>
    </header>
  );
}
