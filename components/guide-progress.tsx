"use client";

import { useEffect, useState } from "react";

export function GuideProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      const percent = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
      setProgress(Math.round(percent));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-20 mb-4 bg-white/90 py-2 backdrop-blur dark:bg-zinc-950/90">
      <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
        <span>Tiến độ đọc guide</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 w-full rounded bg-gray-200 dark:bg-zinc-800">
        <div className="h-2 rounded bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
