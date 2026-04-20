"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { marked } from "marked";

type DemoPost = {
  id: string;
  title: string;
  status: "draft" | "published" | "archived";
  date: string;
  tags: string[];
};

type Mood = "Vui" | "Suy tư" | "Hoài niệm" | "Biết ơn" | "Tò mò";
type FontPreset = "serif" | "sans" | "mono";
type ThemePreset = "light" | "dark" | "sepia" | "solarized" | "pastel";

type Snapshot = {
  at: string;
  title: string;
  content: string;
};

const STORAGE_KEY = "blogmmo.personal-editor.v1";
const VERSION_KEY = "blogmmo.personal-editor.versions.v1";
const STREAK_KEY = "blogmmo.personal-editor.streak.v1";

const MOCK_POSTS: DemoPost[] = [
  {
    id: "p1",
    title: "Một buổi sáng ở Đà Lạt và câu chuyện về sự chậm rãi",
    status: "published",
    date: "2026-04-18",
    tags: ["doi-song", "suy-ngam"],
  },
  {
    id: "p2",
    title: "Checklist UI/UX cho landing page cá nhân",
    status: "published",
    date: "2026-04-16",
    tags: ["ui-ux", "product-design"],
  },
  {
    id: "p3",
    title: "Bản nháp: Hành trình tối giản digital life",
    status: "draft",
    date: "2026-04-20",
    tags: ["draft", "lifestyle"],
  },
  {
    id: "p4",
    title: "Ký ức chuyến đi biển năm ấy",
    status: "archived",
    date: "2025-12-04",
    tags: ["travel", "memory"],
  },
];

const DAILY_PROMPTS = [
  "Một điều nhỏ hôm nay khiến bạn thấy biết ơn là gì?",
  "Nếu viết thư cho chính mình 5 năm trước, bạn sẽ nói gì?",
  "Một thói quen nhỏ đã thay đổi cuộc sống của bạn ra sao?",
  "Nếu ngày mai bắt đầu lại từ đầu, bạn sẽ giữ điều gì?",
  "Khoảnh khắc yên bình nhất của tuần này là khi nào?",
];

const QUOTES = [
  "Write to discover what you think.",
  "Sự chân thật luôn có sức mạnh hơn sự trau chuốt quá mức.",
  "Một đoạn viết tử tế có thể cứu một ngày mệt mỏi.",
  "Viết là cách nhẹ nhàng nhất để tự trò chuyện với mình.",
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function statusLabel(status: DemoPost["status"]) {
  if (status === "draft") return "Nháp";
  if (status === "published") return "Đã đăng";
  return "Lưu trữ";
}

function themeClass(theme: ThemePreset) {
  switch (theme) {
    case "dark":
      return "bg-zinc-950 text-zinc-100";
    case "sepia":
      return "bg-amber-50 text-amber-950";
    case "solarized":
      return "bg-[#fdf6e3] text-[#586e75]";
    case "pastel":
      return "bg-rose-50 text-slate-800";
    default:
      return "bg-white text-zinc-900";
  }
}

function fontClass(font: FontPreset) {
  if (font === "mono") return "font-mono";
  if (font === "serif") return "font-serif";
  return "font-sans";
}

function safeDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("vi-VN");
  } catch {
    return iso;
  }
}

export default function PersonalEditorPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<"write" | "split" | "preview">("split");
  const [focusMode, setFocusMode] = useState(false);
  const [zenMode, setZenMode] = useState(false);

  const [title, setTitle] = useState("Bài viết mới chưa đặt tên");
  const [content, setContent] = useState("# Chào bạn\n\nHôm nay mình muốn viết về...");
  const [mood, setMood] = useState<Mood>("Suy tư");
  const [theme, setTheme] = useState<ThemePreset>("light");
  const [font, setFont] = useState<FontPreset>("serif");
  const [goalWords, setGoalWords] = useState(800);
  const [showDropcap, setShowDropcap] = useState(false);
  const [dailyPromptOn, setDailyPromptOn] = useState(true);
  const [showLofi, setShowLofi] = useState(false);

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [scheduleAt, setScheduleAt] = useState("");
  const [locationSignature, setLocationSignature] = useState("Viết tại Đà Lạt, một chiều mưa...");

  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState<"all" | "draft" | "published" | "archived">("all");

  const [versions, setVersions] = useState<Snapshot[]>([]);
  const [streak, setStreak] = useState(0);
  const [savedAt, setSavedAt] = useState<string>("");
  const [shortcutHelp, setShortcutHelp] = useState(false);

  const [slashOpen, setSlashOpen] = useState(false);
  const [slashKeyword, setSlashKeyword] = useState("");

  // Khôi phục nháp local ngay khi mở trang
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (typeof data.title === "string") setTitle(data.title);
        if (typeof data.content === "string") setContent(data.content);
        if (data.mood) setMood(data.mood);
        if (data.theme) setTheme(data.theme);
        if (data.font) setFont(data.font);
        if (typeof data.goalWords === "number") setGoalWords(data.goalWords);
        setShowDropcap(Boolean(data.showDropcap));
      } catch {
        // ignore broken data
      }
    }

    const rawVersions = localStorage.getItem(VERSION_KEY);
    if (rawVersions) {
      try {
        setVersions(JSON.parse(rawVersions));
      } catch {
        // ignore
      }
    }

    const rawStreak = localStorage.getItem(STREAK_KEY);
    if (rawStreak) {
      try {
        setStreak(Number(JSON.parse(rawStreak).count || 0));
      } catch {
        setStreak(0);
      }
    }
  }, []);

  const html = useMemo(() => {
    const parsed = marked.parse(content || "");
    return typeof parsed === "string" ? parsed : String(parsed);
  }, [content]);

  const wordCount = useMemo(() => {
    return (content || "").trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));
  const progress = Math.min(100, Math.round((wordCount / Math.max(goalWords, 1)) * 100));
  const slug = slugify(title || "untitled");

  const filteredPosts = useMemo(() => {
    return MOCK_POSTS.filter((p) => {
      if (folder !== "all" && p.status !== folder) return false;
      if (!search.trim()) return true;
      return p.title.toLowerCase().includes(search.toLowerCase());
    });
  }, [folder, search]);

  const dailyPrompt = useMemo(() => {
    const seed = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash + seed.charCodeAt(i) * 17) % 1000;
    return DAILY_PROMPTS[hash % DAILY_PROMPTS.length];
  }, []);

  const quote = useMemo(() => {
    const seed = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash + seed.charCodeAt(i) * 13) % 1000;
    return QUOTES[hash % QUOTES.length];
  }, []);

  // Auto-save nhẹ nhàng mỗi 2 giây sau khi người dùng dừng nhập
  useEffect(() => {
    const timer = setTimeout(() => {
      const snapshot = {
        title,
        content,
        mood,
        theme,
        font,
        goalWords,
        showDropcap,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      setSavedAt(new Date().toISOString());

      const v: Snapshot = {
        at: new Date().toISOString(),
        title,
        content,
      };
      setVersions((prev) => {
        const next = [v, ...prev].slice(0, 10);
        localStorage.setItem(VERSION_KEY, JSON.stringify(next));
        return next;
      });

      // cập nhật streak viết bài
      if (wordCount > 20) {
        const raw = localStorage.getItem(STREAK_KEY);
        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const parsed = raw ? JSON.parse(raw) : { lastDate: null, count: 0 };

        if (parsed.lastDate !== today) {
          if (parsed.lastDate === yesterday) {
            parsed.count += 1;
          } else {
            parsed.count = 1;
          }
          parsed.lastDate = today;
          localStorage.setItem(STREAK_KEY, JSON.stringify(parsed));
          setStreak(parsed.count);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, content, mood, theme, font, goalWords, showDropcap, wordCount]);

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key.toLowerCase() === "s") {
        e.preventDefault();
        setSavedAt(new Date().toISOString());
      }
      if (ctrl && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setContent((prev) => `${prev}\n[Link text](https://example.com)`);
      }
      if (ctrl && e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setPreviewMode((m) => (m === "preview" ? "split" : "preview"));
      }
      if (ctrl && e.key === "/") {
        e.preventDefault();
        setShortcutHelp((s) => !s);
      }
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  function injectMarkdown(token: string) {
    const map: Record<string, string> = {
      h1: "\n# Tiêu đề lớn\n",
      h2: "\n## Tiêu đề mục\n",
      quote: "\n> Một câu trích dẫn đáng nhớ.\n",
      divider: "\n---\n",
      code: "\n```ts\nconsole.log('hello writer')\n```\n",
      checklist: "\n- [ ] Việc cần làm 1\n- [ ] Việc cần làm 2\n",
      callout: "\n> [!NOTE]\n> Đây là ghi chú quan trọng.\n",
      youtube: "\n[YouTube](https://www.youtube.com/watch?v=...)\n",
      spotify: "\n[Spotify](https://open.spotify.com/track/...)\n",
      twitter: "\n[Twitter/X](https://x.com/... )\n",
      image: "\n![Caption ảnh](https://images.unsplash.com/...)\n",
    };
    setContent((prev) => `${prev}${map[token] || ""}`);
    setSlashOpen(false);
    setSlashKeyword("");
  }

  const slashItems = [
    ["h1", "Heading 1"],
    ["h2", "Heading 2"],
    ["quote", "Quote"],
    ["divider", "Divider"],
    ["code", "Code block"],
    ["checklist", "Checklist"],
    ["callout", "Callout"],
    ["image", "Image"],
    ["youtube", "Embed YouTube"],
    ["spotify", "Embed Spotify"],
    ["twitter", "Embed Twitter/X"],
  ].filter(([k, label]) => `${k} ${label}`.toLowerCase().includes(slashKeyword.toLowerCase()));

  function exportMarkdown() {
    const payload = `# ${title}\n\n${content}\n\n---\n${locationSignature}`;
    const blob = new Blob([payload], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug || "untitled"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportHtml() {
    const payload = `<!doctype html><html><head><meta charset=\"utf-8\"><title>${title}</title></head><body>${html}<hr><p>${locationSignature}</p></body></html>`;
    const blob = new Blob([payload], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug || "untitled"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPdfFallback() {
    window.print();
  }

  return (
    <div className={`min-h-screen ${themeClass(theme)} ${fontClass(font)}`}>
      {!zenMode ? (
        <header className="sticky top-0 z-20 border-b border-black/10 bg-white/70 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-zinc-950/70 sm:px-6">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button className="rounded-lg border px-2 py-1 text-xs" onClick={() => setSidebarOpen((s) => !s)}>
                Sidebar
              </button>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border text-xs">✍️</div>
              <p className="text-sm font-semibold">Personal Blog Editor</p>
            </div>

            <div className="flex items-center gap-2">
              <button className="rounded-lg border px-2 py-1 text-xs" onClick={() => setPreviewMode("split")}>Split</button>
              <button className="rounded-lg border px-2 py-1 text-xs" onClick={() => setPreviewMode("preview")}>Preview</button>
              <button className="rounded-lg border px-2 py-1 text-xs" onClick={() => setSettingsOpen(true)}>Cài đặt</button>
              <button className="rounded-lg border px-2 py-1 text-xs" onClick={() => setFocusMode((s) => !s)}>{focusMode ? "Tắt Focus" : "Focus"}</button>
              <button className="rounded-lg border px-2 py-1 text-xs" onClick={() => setZenMode(true)}>Zen</button>
              <button className="rounded-lg border px-3 py-1 text-xs font-semibold" onClick={() => setSavedAt(new Date().toISOString())}>Lưu nháp</button>
              <button className="rounded-lg bg-black px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-black">Xuất bản</button>
            </div>
          </div>
        </header>
      ) : null}

      <div className="mx-auto flex w-full max-w-7xl gap-4 px-3 py-4 sm:px-6">
        {!zenMode && sidebarOpen ? (
          <aside className="hidden w-72 shrink-0 space-y-3 rounded-xl border border-black/10 bg-white/50 p-3 dark:border-white/10 dark:bg-zinc-900/50 md:block">
            <input
              className="w-full rounded-lg border px-2 py-1 text-sm dark:border-white/20 dark:bg-zinc-900"
              placeholder="Tìm bài viết..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-1 text-xs">
              {(["all", "draft", "published", "archived"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFolder(f)}
                  className={`rounded-md border px-2 py-1 ${folder === f ? "bg-black text-white dark:bg-white dark:text-black" : ""}`}
                >
                  {f === "all" ? "Tất cả" : statusLabel(f)}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredPosts.map((post) => (
                <div key={post.id} className="rounded-lg border border-black/10 p-2 dark:border-white/10">
                  <p className="text-sm font-semibold leading-snug">{post.title}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">{post.date} • {statusLabel(post.status)}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-dashed p-2 text-xs text-zinc-500 dark:border-white/20 dark:text-zinc-400">
              Tag gợi ý: #doi-song #du-lich #suy-ngam #ui-ux
            </div>
          </aside>
        ) : null}

        <main className={`mx-auto w-full ${focusMode ? "max-w-3xl" : "max-w-5xl"}`}>
          {dailyPromptOn && !zenMode ? (
            <div className="mb-3 rounded-xl border border-amber-300/50 bg-amber-50/70 px-3 py-2 text-sm text-amber-900 dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-200">
              <span className="font-semibold">Prompt hôm nay:</span> {dailyPrompt}
            </div>
          ) : null}

          {!zenMode ? (
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span>Mood: {mood}</span>
              <span>•</span>
              <span>{wordCount} từ</span>
              <span>•</span>
              <span>{readingMinutes} phút đọc</span>
              <span>•</span>
              <span>Streak: {streak} ngày</span>
              {savedAt ? <><span>•</span><span>Đã lưu {safeDate(savedAt)}</span></> : null}
            </div>
          ) : null}

          <div className={`grid gap-3 ${previewMode === "split" ? "lg:grid-cols-2" : ""}`}>
            {previewMode !== "preview" ? (
              <section className="rounded-2xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-900/60">
                <input
                  className="mb-3 w-full border-none bg-transparent text-2xl font-black outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tiêu đề bài viết..."
                />

                <div className="mb-2 flex flex-wrap gap-2 text-xs">
                  {["H1", "H2", "Quote", "List", "Code", "Divider"].map((t) => (
                    <button key={t} className="rounded-md border px-2 py-1" onClick={() => injectMarkdown(t.toLowerCase())}>{t}</button>
                  ))}
                  <button className="rounded-md border px-2 py-1" onClick={() => setShowDropcap((s) => !s)}>
                    {showDropcap ? "Dropcap: ON" : "Dropcap: OFF"}
                  </button>
                </div>

                <textarea
                  className={`min-h-[62vh] w-full resize-y rounded-xl border border-black/10 bg-white p-4 text-[15px] leading-8 outline-none dark:border-white/10 dark:bg-zinc-900 ${focusMode ? "text-[17px]" : ""}`}
                  value={content}
                  onChange={(e) => {
                    const v = e.target.value;
                    setContent(v);
                    const match = v.match(/\/(\w*)$/);
                    if (match) {
                      setSlashOpen(true);
                      setSlashKeyword(match[1] || "");
                    } else {
                      setSlashOpen(false);
                      setSlashKeyword("");
                    }
                  }}
                  placeholder="Bắt đầu viết... gõ / để chèn nhanh"
                />

                {slashOpen ? (
                  <div className="mt-2 rounded-xl border border-black/10 bg-white p-2 text-sm shadow dark:border-white/20 dark:bg-zinc-900">
                    <p className="mb-1 text-xs text-zinc-500">Slash command</p>
                    <div className="grid gap-1 sm:grid-cols-2">
                      {slashItems.slice(0, 10).map(([k, label]) => (
                        <button
                          key={k}
                          className="rounded-md border px-2 py-1 text-left hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
                          onClick={() => injectMarkdown(k)}
                        >
                          /{k} — {label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>
            ) : null}

            {previewMode !== "write" ? (
              <section className="rounded-2xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-900/60">
                <article className="prose max-w-none dark:prose-invert">
                  <h1 className="mb-2">{title}</h1>
                  <p className="text-sm text-zinc-500">/{slug}</p>
                  <div className="my-4 h-px bg-zinc-300 dark:bg-zinc-700" />

                  {showDropcap ? (
                    <p className="text-[17px] leading-8">
                      <span className="float-left mr-2 text-5xl font-black leading-none">
                        {(content.trim()[0] || "V").toUpperCase()}
                      </span>
                      {content.trim().slice(1, 180)}...
                    </p>
                  ) : null}

                  <div dangerouslySetInnerHTML={{ __html: html }} />

                  <div className="mt-8 rounded-xl border border-dashed p-3 text-sm">
                    <p className="font-semibold">Chữ ký cuối bài</p>
                    <p className="mt-1 text-zinc-600 dark:text-zinc-300">{locationSignature}</p>
                    <p className="text-xs text-zinc-500">{new Date().toLocaleDateString("vi-VN")}</p>
                  </div>
                </article>
              </section>
            ) : null}
          </div>

          {!zenMode ? (
            <div className="mt-3 rounded-xl border border-black/10 bg-white/70 p-3 dark:border-white/10 dark:bg-zinc-900/60">
              <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
                <span>Mục tiêu từ/ngày: {goalWords}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div className="h-full rounded-full bg-orange-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : null}
        </main>
      </div>

      {settingsOpen ? (
        <div className="fixed inset-0 z-30 flex justify-end bg-black/40">
          <div className="h-full w-full max-w-md overflow-y-auto bg-white p-4 dark:bg-zinc-950">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Cài đặt bài viết</h2>
              <button className="rounded-md border px-2 py-1 text-xs" onClick={() => setSettingsOpen(false)}>Đóng</button>
            </div>

            <div className="space-y-4 text-sm">
              <section className="space-y-2 rounded-xl border p-3 dark:border-white/20">
                <p className="font-semibold">Mood & cảm hứng</p>
                <select className="w-full rounded-lg border p-2 dark:border-white/20 dark:bg-zinc-900" value={mood} onChange={(e) => setMood(e.target.value as Mood)}>
                  <option>Vui</option>
                  <option>Suy tư</option>
                  <option>Hoài niệm</option>
                  <option>Biết ơn</option>
                  <option>Tò mò</option>
                </select>

                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={dailyPromptOn} onChange={(e) => setDailyPromptOn(e.target.checked)} />
                  Bật daily prompt
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={showLofi} onChange={(e) => setShowLofi(e.target.checked)} />
                  Bật lo-fi mode (demo)
                </label>
                {showLofi ? <p className="text-xs text-zinc-500">♪ {quote}</p> : null}
              </section>

              <section className="space-y-2 rounded-xl border p-3 dark:border-white/20">
                <p className="font-semibold">Typography & Theme</p>
                <select className="w-full rounded-lg border p-2 dark:border-white/20 dark:bg-zinc-900" value={font} onChange={(e) => setFont(e.target.value as FontPreset)}>
                  <option value="serif">Serif (Lora/Merriweather vibe)</option>
                  <option value="sans">Sans (Inter/Nunito vibe)</option>
                  <option value="mono">Mono (JetBrains Mono vibe)</option>
                </select>
                <select className="w-full rounded-lg border p-2 dark:border-white/20 dark:bg-zinc-900" value={theme} onChange={(e) => setTheme(e.target.value as ThemePreset)}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="sepia">Sepia</option>
                  <option value="solarized">Solarized</option>
                  <option value="pastel">Pastel</option>
                </select>
              </section>

              <section className="space-y-2 rounded-xl border p-3 dark:border-white/20">
                <p className="font-semibold">Xuất bản & SEO</p>
                <input className="w-full rounded-lg border p-2 dark:border-white/20 dark:bg-zinc-900" placeholder="Meta title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
                <textarea className="w-full rounded-lg border p-2 dark:border-white/20 dark:bg-zinc-900" placeholder="Meta description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
                <input className="w-full rounded-lg border p-2 dark:border-white/20 dark:bg-zinc-900" type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} />
                <input className="w-full rounded-lg border p-2 dark:border-white/20 dark:bg-zinc-900" value={locationSignature} onChange={(e) => setLocationSignature(e.target.value)} />
                <p className="text-xs text-zinc-500">Slug: /{slug}</p>
              </section>

              <section className="space-y-2 rounded-xl border p-3 dark:border-white/20">
                <p className="font-semibold">Export</p>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-lg border px-3 py-1.5" onClick={exportMarkdown}>Xuất .md</button>
                  <button className="rounded-lg border px-3 py-1.5" onClick={exportHtml}>Copy HTML</button>
                  <button className="rounded-lg border px-3 py-1.5" onClick={exportPdfFallback}>PDF (print)</button>
                </div>
              </section>

              <section className="space-y-2 rounded-xl border p-3 dark:border-white/20">
                <p className="font-semibold">Version history (10 gần nhất)</p>
                <div className="max-h-48 space-y-2 overflow-auto">
                  {versions.length === 0 ? <p className="text-xs text-zinc-500">Chưa có snapshot.</p> : null}
                  {versions.map((v, idx) => (
                    <button
                      key={`${v.at}-${idx}`}
                      onClick={() => {
                        setTitle(v.title);
                        setContent(v.content);
                      }}
                      className="w-full rounded-lg border p-2 text-left text-xs hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
                    >
                      <p className="font-semibold">{v.title || "(Không tiêu đề)"}</p>
                      <p className="text-zinc-500">{safeDate(v.at)}</p>
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-2 rounded-xl border p-3 text-xs dark:border-white/20">
                <p className="font-semibold">Shortcuts</p>
                <ul className="space-y-1 text-zinc-500">
                  <li>Ctrl+S: Lưu nháp</li>
                  <li>Ctrl+K: Chèn link mẫu</li>
                  <li>Ctrl+Shift+P: Toggle preview</li>
                  <li>Ctrl+/: Mở/tắt trợ giúp phím tắt</li>
                </ul>
              </section>

              <p className="text-xs text-zinc-500">Demo React + Tailwind, hướng writing-first, unikey-friendly, offline local draft.</p>
            </div>
          </div>
        </div>
      ) : null}

      {shortcutHelp ? (
        <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-lg border bg-black px-3 py-2 text-xs text-white">
          Ctrl+S lưu • Ctrl+K link • Ctrl+Shift+P preview • Ctrl+/ shortcuts
        </div>
      ) : null}

      {zenMode ? (
        <button className="fixed bottom-4 right-4 rounded-lg border bg-black px-3 py-2 text-xs text-white" onClick={() => setZenMode(false)}>
          Thoát Zen
        </button>
      ) : null}

      <div className="fixed bottom-3 left-3 text-[11px] text-zinc-500 dark:text-zinc-400">
        {wordCount} từ • ~{readingMinutes} phút đọc
      </div>

      <div className="fixed bottom-3 right-3 text-[11px] text-zinc-500 dark:text-zinc-400">
        <Link href="/blog" className="hover:underline">RSS tự động từ /feed.xml</Link>
      </div>
    </div>
  );
}
