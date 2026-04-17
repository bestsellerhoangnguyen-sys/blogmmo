export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 py-6 text-center text-sm text-gray-600 dark:border-white/20 dark:text-gray-300">
      © {new Date().getFullYear()} BlogMMO. Built with Next.js 14.
    </footer>
  );
}
