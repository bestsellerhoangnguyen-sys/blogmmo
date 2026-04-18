"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const next = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0;
      setProgress(next);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-[56px] z-20 h-1 w-full rounded-full bg-zinc-200/80 dark:bg-zinc-800/80 sm:top-[60px]">
      <div
        className="h-full rounded-full bg-blue-600 transition-[width] duration-150 dark:bg-blue-400"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
