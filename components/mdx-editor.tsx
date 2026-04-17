"use client";

import { marked } from "marked";

export function MdxEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const html = marked.parse(value || "") as string;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <textarea
        className="min-h-[220px] w-full rounded border p-3 font-mono text-sm dark:border-white/20 dark:bg-zinc-900"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nhập markdown/mdx..."
      />
      <div className="min-h-[220px] rounded border p-3 dark:border-white/20">
        <p className="mb-2 text-xs text-gray-500">Preview</p>
        <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
