"use client";

import { useState } from "react";

type ShareActionsProps = {
  title: string;
  url: string;
};

export function ShareActions({ title, url }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const shareX = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const shareFb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={copyLink}
        className="rounded-xl border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        {copied ? "Đã copy" : "Copy link"}
      </button>
      <a
        href={shareX}
        target="_blank"
        rel="noreferrer"
        className="rounded-xl border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        Share X
      </a>
      <a
        href={shareFb}
        target="_blank"
        rel="noreferrer"
        className="rounded-xl border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        Share FB
      </a>
    </div>
  );
}
