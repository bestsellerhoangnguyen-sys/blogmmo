"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Breadcrumbs, PageHeader, Surface } from "@/components/ui";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  if (status === "loading") return <main className="text-sm text-zinc-500">Loading...</main>;

  if (!session?.user?.email) {
    return (
      <main className="space-y-4">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Account" }]} />
        <PageHeader title="Account" description="Vui lòng đăng nhập để quản lý tài khoản." />
        <Surface>
          <Link href="/login" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
            Đi tới trang đăng nhập
          </Link>
        </Surface>
      </main>
    );
  }

  const adminEmail = process.env.NEXT_PUBLIC_AUTH_ADMIN_EMAIL || "admin";
  const role = session.user.email === adminEmail ? "Admin" : "Viewer";

  async function changePassword() {
    setMsg("");
    const csrf = document.cookie
      .split("; ")
      .find((x) => x.startsWith("blogmmo_csrf="))
      ?.split("=")[1] || "";

    const res = await fetch("/api/account/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrf },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.error || "Đổi mật khẩu thất bại");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setMsg("Đổi mật khẩu thành công");
  }

  return (
    <main className="space-y-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Account" }]} />
      <PageHeader title="Account settings" description="Quản lý phiên đăng nhập và an toàn tài khoản." />

      <Surface>
        <h2 className="text-lg font-semibold">Profile</h2>
        <div className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          <p><span className="font-medium">Email:</span> {session.user.email}</p>
          <p><span className="font-medium">Tên hiển thị:</span> {session.user.name || "(chưa có)"}</p>
          <p><span className="font-medium">Role:</span> {role}</p>
        </div>
      </Surface>

      <Surface>
        <h2 className="text-lg font-semibold">Security</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Credentials mode đang dùng biến môi trường server cho admin. Đổi mật khẩu hiện được quản lý ở tầng vận hành (.env) để đảm bảo kiểm soát tập trung.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/admin" className="rounded-xl border px-3 py-2 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10">
            Mở Admin panel
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-xl bg-black px-3 py-2 text-sm text-white hover:bg-zinc-800 dark:bg-white dark:text-black"
          >
            Đăng xuất phiên hiện tại
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">Đổi mật khẩu</p>
          <input className="w-full rounded-xl border p-2 text-sm dark:border-white/20 dark:bg-zinc-900" type="password" placeholder="Mật khẩu hiện tại" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          <input className="w-full rounded-xl border p-2 text-sm dark:border-white/20 dark:bg-zinc-900" type="password" placeholder="Mật khẩu mới (>=8 ký tự)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <button onClick={changePassword} className="rounded-xl border px-3 py-2 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10">Cập nhật mật khẩu</button>
          {msg ? <p className="text-xs text-zinc-600 dark:text-zinc-300">{msg}</p> : null}
        </div>
      </Surface>
    </main>
  );
}
