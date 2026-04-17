"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const shouldDark =
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", shouldDark);
    setIsDark(shouldDark);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  if (!mounted) {
    return <button className="rounded border px-3 py-2 text-sm">Theme</button>;
  }

  return (
    <button className="rounded border px-3 py-2 text-sm" onClick={toggleTheme}>
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
