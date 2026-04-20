import Link from "next/link";

export const dynamic = "force-dynamic";

export default function SourceEditorPage() {
  return (
    <main className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-black/10 bg-white p-3 dark:border-white/20 dark:bg-zinc-900">
        <div>
          <h1 className="text-lg font-bold">Personal Editor Source (imported)</h1>
          <p className="text-xs text-zinc-500">Single-file HTML from provided source package.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/personal-editor-source/index.html" className="rounded-lg border px-3 py-1.5 text-xs hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10">
            Open direct file
          </Link>
          <Link href="/editor" className="rounded-lg border px-3 py-1.5 text-xs hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10">
            Back to React editor
          </Link>
        </div>
      </div>

      <div className="h-[calc(100vh-170px)] overflow-hidden rounded-xl border border-black/10 dark:border-white/20">
        <iframe
          title="Imported personal editor source"
          src="/personal-editor-source/index.html"
          className="h-full w-full bg-white"
        />
      </div>
    </main>
  );
}
