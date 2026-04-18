"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MdxEditor } from "@/components/mdx-editor";
import { Breadcrumbs, EmptyState, PageHeader, Surface } from "@/components/ui";

type Post = { id: string; title: string; slug: string; published: boolean; excerpt?: string | null; content: string };
type Guide = { id: string; title: string; slug: string; published: boolean; summary?: string | null };

function getCsrfTokenFromCookie() {
  return document.cookie
    .split("; ")
    .find((x) => x.startsWith("blogmmo_csrf="))
    ?.split("=")[1] || "";
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [postTitle, setPostTitle] = useState("");
  const [postSlug, setPostSlug] = useState("");
  const [postContent, setPostContent] = useState("# New post");
  const [uploading, setUploading] = useState(false);
  const [postExcerpt, setPostExcerpt] = useState("");
  const [guideTitle, setGuideTitle] = useState("");
  const [guideSlug, setGuideSlug] = useState("");
  const [guideSummary, setGuideSummary] = useState("");
  const [guideCategory, setGuideCategory] = useState("general");

  async function loadData() {
    const [pRes, gRes] = await Promise.all([fetch("/api/posts"), fetch("/api/guides")]);
    const [pData, gData] = await Promise.all([pRes.json(), gRes.json()]);
    setPosts(Array.isArray(pData) ? pData : []);
    setGuides(Array.isArray(gData) ? gData : []);
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/csrf");
      loadData();
    }
  }, [status]);

  async function uploadImage(file: File) {
    const token = getCsrfTokenFromCookie();
    const form = new FormData();
    form.append("file", file);
    setUploading(true);
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "x-csrf-token": token },
      body: form,
    });
    setUploading(false);
    const data = await res.json();
    if (data.url) {
      setPostContent((prev) => `${prev}\n\n![uploaded image](${data.url})`);
    }
  }

  async function createPost() {
    const token = getCsrfTokenFromCookie();
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": token },
      body: JSON.stringify({ title: postTitle, slug: postSlug, content: postContent, excerpt: postExcerpt, published: false }),
    });
    setPostTitle("");
    setPostSlug("");
    setPostExcerpt("");
    setPostContent("# New post");
    await loadData();
  }

  async function createGuide() {
    const token = getCsrfTokenFromCookie();
    await fetch("/api/guides", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": token },
      body: JSON.stringify({
        title: guideTitle,
        slug: guideSlug,
        summary: guideSummary,
        categorySlug: guideCategory,
        categoryName: guideCategory,
        published: false,
        steps: [
          { title: "Bước 1", content: "Nội dung bước 1" },
          { title: "Bước 2", content: "Nội dung bước 2" },
        ],
      }),
    });
    setGuideTitle("");
    setGuideSlug("");
    setGuideSummary("");
    await loadData();
  }

  async function toggleGuide(id: string, published: boolean) {
    const token = getCsrfTokenFromCookie();
    await fetch(`/api/guides/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-csrf-token": token },
      body: JSON.stringify({ published: !published }),
    });
    await loadData();
  }

  async function deleteGuide(id: string) {
    const token = getCsrfTokenFromCookie();
    await fetch(`/api/guides/${id}`, {
      method: "DELETE",
      headers: { "x-csrf-token": token },
    });
    await loadData();
  }

  async function togglePost(id: string, published: boolean) {
    const token = getCsrfTokenFromCookie();
    await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-csrf-token": token },
      body: JSON.stringify({ published: !published }),
    });
    await loadData();
  }

  async function deletePost(id: string) {
    const token = getCsrfTokenFromCookie();
    await fetch(`/api/posts/${id}`, {
      method: "DELETE",
      headers: { "x-csrf-token": token },
    });
    await loadData();
  }

  if (status === "loading") return <main className="text-sm text-zinc-500">Loading...</main>;
  if (!session) return <main className="space-y-2"><h1 className="text-2xl font-bold">Admin</h1><p>Vui lòng đăng nhập để truy cập.</p></main>;

  return (
    <main className="space-y-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Admin" }]} />
      <PageHeader title="Admin Panel" description="Quản lý nội dung bài viết và guide." />

      <Surface>
        <div className="space-y-3">
        <h2 className="text-xl font-semibold">Tạo post mới</h2>
        <h2 className="text-xl font-semibold">Tạo post mới</h2>
        <input className="w-full rounded border p-2 dark:border-white/20 dark:bg-zinc-900" placeholder="Title" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
        <input className="w-full rounded border p-2 dark:border-white/20 dark:bg-zinc-900" placeholder="slug-bai-viet" value={postSlug} onChange={(e) => setPostSlug(e.target.value)} />
        <input className="w-full rounded border p-2 dark:border-white/20 dark:bg-zinc-900" placeholder="Excerpt" value={postExcerpt} onChange={(e) => setPostExcerpt(e.target.value)} />
        <MdxEditor value={postContent} onChange={setPostContent} />
        <div className="flex items-center gap-3">
          <label className="rounded border px-3 py-2 text-sm dark:border-white/20">
            {uploading ? "Uploading..." : "Upload image"}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadImage(f);
              }}
            />
          </label>
          <button className="rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black" onClick={createPost}>Create post</button>
        </div>
        </div>
      </Surface>

      <Surface>
        <div className="space-y-3">
        <h2 className="text-xl font-semibold">Danh sách posts</h2>
        {posts.map((post) => (
          <div key={post.id} className="flex items-center justify-between rounded border p-3 dark:border-white/20">
            <div>
              <p className="font-medium">{post.title}</p>
              <p className="text-sm text-gray-500">/{post.slug}</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded border px-3 py-1 text-sm" onClick={() => togglePost(post.id, post.published)}>
                {post.published ? "Unpublish" : "Publish"}
              </button>
              <button className="rounded border px-3 py-1 text-sm text-red-600" onClick={() => deletePost(post.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
        </div>
      </Surface>

      <Surface>
        <div className="space-y-3">
        <h2 className="text-xl font-semibold">Tạo guide mới</h2>
        <input className="w-full rounded border p-2 dark:border-white/20 dark:bg-zinc-900" placeholder="Guide title" value={guideTitle} onChange={(e) => setGuideTitle(e.target.value)} />
        <input className="w-full rounded border p-2 dark:border-white/20 dark:bg-zinc-900" placeholder="guide-slug" value={guideSlug} onChange={(e) => setGuideSlug(e.target.value)} />
        <input className="w-full rounded border p-2 dark:border-white/20 dark:bg-zinc-900" placeholder="Summary" value={guideSummary} onChange={(e) => setGuideSummary(e.target.value)} />
        <input className="w-full rounded border p-2 dark:border-white/20 dark:bg-zinc-900" placeholder="Category slug" value={guideCategory} onChange={(e) => setGuideCategory(e.target.value)} />
        <button className="rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black" onClick={createGuide}>Create guide</button>
        </div>
      </Surface>

      <Surface>
        <div className="space-y-3">
        <h2 className="text-xl font-semibold">Danh sách guides</h2>
        {guides.length === 0 ? <EmptyState title="Chưa có guide" subtitle="Tạo guide đầu tiên để bắt đầu." /> : null}
        {guides.map((g) => (
          <div key={g.id} className="flex items-center justify-between rounded border p-3 dark:border-white/20">
            <div>
              <p className="font-medium">{g.title}</p>
              <p className="text-sm text-gray-500">/{g.slug}</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded border px-3 py-1 text-sm" onClick={() => toggleGuide(g.id, g.published)}>
                {g.published ? "Unpublish" : "Publish"}
              </button>
              <button className="rounded border px-3 py-1 text-sm text-red-600" onClick={() => deleteGuide(g.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
        </div>
      </Surface>
    </main>
  );
}
