export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 py-6 text-sm text-gray-600 dark:border-white/20 dark:text-gray-300">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 text-center sm:px-6 sm:text-left">
        <p>© {new Date().getFullYear()} BlogMMO. Built with Next.js 14.</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">UI refresh in progress · mobile-first polish.</p>
      </div>
    </footer>
  );
}
