"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MdxEditor } from "@/components/mdx-editor";
import { Breadcrumbs, EmptyState, PageHeader, Surface } from "@/components/ui";

type Post = { id: string; title: string; slug: string; published: boolean; excerpt?: string | null; content: string };
type Guide = { id: string; title: string; slug: string; published: boolean; summary?: string | null };
type AccountUser = { id: string; email: string; name?: string | null; role: string };
type AuditLog = { id: string; actor?: string | null; action: string; resource: string; resourceId?: string | null; status: string; detail?: string | null; createdAt: string };
type PostDraft = { title: string; slug: string; excerpt: string; content: string };
type GuideDraft = { title: string; slug: string; summary: string };

const inputClass = "w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500 dark:focus:ring-zinc-800";
const actionBtnClass = "rounded-xl border border-zinc-300 px-3 py-1.5 text-sm transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800";
const primaryBtnClass = "rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200";

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
  const [error, setError] = useState("");
  const [users, setUsers] = useState<AccountUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingGuideId, setEditingGuideId] = useState<string | null>(null);
  const [postDraft, setPostDraft] = useState<PostDraft | null>(null);
  const [guideDraft, setGuideDraft] = useState<GuideDraft | null>(null);

  async function loadData() {
    const [pRes, gRes, uRes, aRes] = await Promise.all([
      fetch("/api/posts"),
      fetch("/api/guides"),
      fetch("/api/admin/users"),
      fetch("/api/admin/audit-logs?limit=80"),
    ]);
    const [pData, gData, uData, aData] = await Promise.all([pRes.json(), gRes.json(), uRes.json(), aRes.json()]);
    setPosts(Array.isArray(pData) ? pData : []);
    setGuides(Array.isArray(gData) ? gData : []);
    setUsers(Array.isArray(uData) ? uData : []);
    setAuditLogs(Array.isArray(aData) ? aData : []);
  }

  async function updateUserRole(id: string, role: string) {
    const token = getCsrfTokenFromCookie();
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-csrf-token": token },
      body: JSON.stringify({ id, role }),
    });
    await loadData();
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
    setError("");
    if (!postTitle.trim() || !postSlug.trim() || !postContent.trim()) {
      setError("Post cần Title, Slug và Content trước khi tạo.");
      return;
    }

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
    setError("");
    if (!guideTitle.trim() || !guideSlug.trim() || !guideCategory.trim()) {
      setError("Guide cần Title, Slug, Category trước khi tạo.");
      return;
    }

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
    if (!confirm("Xác nhận xóa guide này?")) return;
    const token = getCsrfTokenFromCookie();
    await fetch(`/api/guides/${id}`, {
      method: "DELETE",
      headers: { "x-csrf-token": token },
    });
    await loadData();
  }

  function startEditGuide(guide: Guide) {
    setEditingGuideId(guide.id);
    setGuideDraft({ title: guide.title, slug: guide.slug, summary: guide.summary ?? "" });
  }

  function cancelEditGuide() {
    setEditingGuideId(null);
    setGuideDraft(null);
  }

  async function saveGuide(id: string, published: boolean) {
    setError("");
    if (!guideDraft || !guideDraft.title.trim() || !guideDraft.slug.trim()) {
      setError("Khi sửa guide cần đủ Title và Slug.");
      return;
    }

    const token = getCsrfTokenFromCookie();
    await fetch(`/api/guides/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-csrf-token": token },
      body: JSON.stringify({ ...guideDraft, published }),
    });
    cancelEditGuide();
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
    if (!confirm("Xác nhận xóa post này?")) return;
    const token = getCsrfTokenFromCookie();
    await fetch(`/api/posts/${id}`, {
      method: "DELETE",
      headers: { "x-csrf-token": token },
    });
    await loadData();
  }

  function startEditPost(post: Post) {
    setEditingPostId(post.id);
    setPostDraft({ title: post.title, slug: post.slug, excerpt: post.excerpt ?? "", content: post.content });
  }

  function cancelEditPost() {
    setEditingPostId(null);
    setPostDraft(null);
  }

  async function savePost(id: string, published: boolean) {
    setError("");
    if (!postDraft || !postDraft.title.trim() || !postDraft.slug.trim() || !postDraft.content.trim()) {
      setError("Khi sửa post cần đủ Title, Slug, Content.");
      return;
    }

    const token = getCsrfTokenFromCookie();
    await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-csrf-token": token },
      body: JSON.stringify({ ...postDraft, published }),
    });
    cancelEditPost();
    await loadData();
  }

  if (status === "loading") return <main className="text-sm text-zinc-500">Loading...</main>;
  if (!session)
    return (
      <main className="space-y-2">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p>Vui lòng đăng nhập để truy cập.</p>
      </main>
    );

  return (
    <main className="space-y-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Admin" }]} />
      <PageHeader title="Admin Panel" description="Quản lý nội dung bài viết và guide." />
      {error ? <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{error}</p> : null}

      <Surface>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Tạo post mới</h2>
          <input className={inputClass} placeholder="Title" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
          <input className={inputClass} placeholder="slug-bai-viet" value={postSlug} onChange={(e) => setPostSlug(e.target.value)} />
          <input className={inputClass} placeholder="Excerpt" value={postExcerpt} onChange={(e) => setPostExcerpt(e.target.value)} />
          <MdxEditor value={postContent} onChange={setPostContent} />
          <div className="flex flex-wrap items-center gap-3">
            <label className={actionBtnClass}>
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
            <button className={primaryBtnClass} onClick={createPost}>Create post</button>
          </div>
        </div>
      </Surface>

      <Surface>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Danh sách posts</h2>
          {posts.length === 0 ? <EmptyState title="Chưa có post" subtitle="Tạo bài viết đầu tiên để bắt đầu." /> : null}
          {posts.map((post) => (
            <div key={post.id} className="space-y-3 rounded-xl border p-3 dark:border-white/20">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-gray-500">/{post.slug}</p>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-xs ${post.published ? "border-green-300 text-green-700 dark:border-green-800 dark:text-green-300" : "border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"}`}>
                  {post.published ? "Published" : "Draft"}
                </span>
              </div>

              {editingPostId === post.id && postDraft ? (
                <div className="space-y-2 rounded-xl border border-dashed p-3 dark:border-white/20">
                  <input className={inputClass} value={postDraft.title} onChange={(e) => setPostDraft((prev) => prev ? { ...prev, title: e.target.value } : prev)} placeholder="Title" />
                  <input className={inputClass} value={postDraft.slug} onChange={(e) => setPostDraft((prev) => prev ? { ...prev, slug: e.target.value } : prev)} placeholder="Slug" />
                  <input className={inputClass} value={postDraft.excerpt} onChange={(e) => setPostDraft((prev) => prev ? { ...prev, excerpt: e.target.value } : prev)} placeholder="Excerpt" />
                  <MdxEditor value={postDraft.content} onChange={(value) => setPostDraft((prev) => prev ? { ...prev, content: value } : prev)} />
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <button className={actionBtnClass} onClick={() => togglePost(post.id, post.published)}>
                  {post.published ? "Unpublish" : "Publish"}
                </button>
                {editingPostId === post.id ? (
                  <>
                    <button className={primaryBtnClass} onClick={() => savePost(post.id, post.published)}>Save</button>
                    <button className={actionBtnClass} onClick={cancelEditPost}>Cancel</button>
                  </>
                ) : (
                  <button className={actionBtnClass} onClick={() => startEditPost(post)}>Edit</button>
                )}
                <button className={`${actionBtnClass} text-red-600 dark:text-red-400`} onClick={() => deletePost(post.id)}>
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
          <input className={inputClass} placeholder="Guide title" value={guideTitle} onChange={(e) => setGuideTitle(e.target.value)} />
          <input className={inputClass} placeholder="guide-slug" value={guideSlug} onChange={(e) => setGuideSlug(e.target.value)} />
          <input className={inputClass} placeholder="Summary" value={guideSummary} onChange={(e) => setGuideSummary(e.target.value)} />
          <input className={inputClass} placeholder="Category slug" value={guideCategory} onChange={(e) => setGuideCategory(e.target.value)} />
          <button className={primaryBtnClass} onClick={createGuide}>Create guide</button>
        </div>
      </Surface>

      <Surface>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Danh sách guides</h2>
          {guides.length === 0 ? <EmptyState title="Chưa có guide" subtitle="Tạo guide đầu tiên để bắt đầu." /> : null}
          {guides.map((g) => (
            <div key={g.id} className="space-y-3 rounded-xl border p-3 dark:border-white/20">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{g.title}</p>
                  <p className="text-sm text-gray-500">/{g.slug}</p>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-xs ${g.published ? "border-green-300 text-green-700 dark:border-green-800 dark:text-green-300" : "border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"}`}>
                  {g.published ? "Published" : "Draft"}
                </span>
              </div>

              {editingGuideId === g.id && guideDraft ? (
                <div className="space-y-2 rounded-xl border border-dashed p-3 dark:border-white/20">
                  <input className={inputClass} value={guideDraft.title} onChange={(e) => setGuideDraft((prev) => prev ? { ...prev, title: e.target.value } : prev)} placeholder="Title" />
                  <input className={inputClass} value={guideDraft.slug} onChange={(e) => setGuideDraft((prev) => prev ? { ...prev, slug: e.target.value } : prev)} placeholder="Slug" />
                  <input className={inputClass} value={guideDraft.summary} onChange={(e) => setGuideDraft((prev) => prev ? { ...prev, summary: e.target.value } : prev)} placeholder="Summary" />
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <button className={actionBtnClass} onClick={() => toggleGuide(g.id, g.published)}>
                  {g.published ? "Unpublish" : "Publish"}
                </button>
                {editingGuideId === g.id ? (
                  <>
                    <button className={primaryBtnClass} onClick={() => saveGuide(g.id, g.published)}>Save</button>
                    <button className={actionBtnClass} onClick={cancelEditGuide}>Cancel</button>
                  </>
                ) : (
                  <button className={actionBtnClass} onClick={() => startEditGuide(g)}>Edit</button>
                )}
                <button className={`${actionBtnClass} text-red-600 dark:text-red-400`} onClick={() => deleteGuide(g.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </Surface>

      <Surface>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Quản lý tài khoản</h2>
          {users.length === 0 ? <EmptyState title="Chưa có user" subtitle="User đăng ký sẽ xuất hiện ở đây." /> : null}
          {users.map((u) => (
            <div key={u.id} className="flex flex-col gap-2 rounded-xl border p-3 dark:border-white/20 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{u.name || u.email}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <select className="rounded-xl border p-2 text-sm dark:border-white/20 dark:bg-zinc-900" value={u.role} onChange={(e) => updateUserRole(u.id, e.target.value)}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </Surface>

      <Surface>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Lịch sử thao tác admin</h2>
          {auditLogs.length === 0 ? <EmptyState title="Chưa có log" subtitle="Thao tác admin sẽ xuất hiện tại đây." /> : null}
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="rounded-xl border p-3 text-sm dark:border-white/20">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{log.action}</span>
                  <span className="text-zinc-500">{log.resource}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-xs ${log.status === "success" ? "border-green-300 text-green-700 dark:border-green-800 dark:text-green-300" : "border-red-300 text-red-700 dark:border-red-800 dark:text-red-300"}`}>{log.status}</span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">{new Date(log.createdAt).toLocaleString("vi-VN")} • {log.actor || "system"}</p>
                {log.detail ? <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">{log.detail}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </Surface>
    </main>
  );
}
