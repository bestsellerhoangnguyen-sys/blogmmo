import Link from "next/link";
import { AuthControls } from "@/components/auth-controls";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 p-8">
      <header className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-bold">BlogMMO</h1>
        <AuthControls />
      </header>

      <section className="space-y-3">
        <p>Foundation đã sẵn sàng. Tiếp theo triển khai Blog + Guide modules.</p>
        <div className="flex gap-4">
          <Link className="rounded border px-3 py-2" href="/login">
            Go to Login
          </Link>
          <Link className="rounded border px-3 py-2" href="/blog">
            Blog (next step)
          </Link>
        </div>
      </section>
    </main>
  );
}
