"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Register failed");
      return;
    }

    router.push("/login");
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Tạo tài khoản</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <input className="w-full rounded border p-2" placeholder="Tên" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full rounded border p-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full rounded border p-2" type="password" placeholder="Mật khẩu (>=8 ký tự)" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="w-full rounded bg-black p-2 text-white" type="submit" disabled={loading}>
          {loading ? "Đang tạo..." : "Tạo tài khoản"}
        </button>
      </form>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
        Đã có tài khoản? <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-400">Đăng nhập</Link>
      </p>
    </main>
  );
}
