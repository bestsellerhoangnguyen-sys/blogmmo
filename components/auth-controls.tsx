"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthControls() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-sm text-gray-500">Checking session...</p>;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700">Hi, {session.user.email}</span>
        <button
          className="rounded bg-black px-3 py-2 text-sm text-white"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      className="rounded bg-black px-3 py-2 text-sm text-white"
      onClick={() => signIn(undefined, { callbackUrl: "/" })}
    >
      Login
    </button>
  );
}
