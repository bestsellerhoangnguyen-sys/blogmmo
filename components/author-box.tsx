export function AuthorBox({ updatedAt, publishedAt }: { updatedAt: Date; publishedAt?: Date | null }) {
  const isUpdated = publishedAt ? updatedAt.getTime() - publishedAt.getTime() > 1000 * 60 * 60 * 24 : false;

  return (
    <div className="mt-8 rounded-xl border border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/60">
      <p className="text-sm font-semibold">BlogMMO Editorial</p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        Nội dung được biên tập để dễ đọc, tập trung vào hướng dẫn thực chiến và ứng dụng thực tế.
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span>Updated: {new Date(updatedAt).toLocaleString("vi-VN")}</span>
        {isUpdated ? <span className="rounded-full border px-2 py-0.5">Recently updated</span> : null}
      </div>
    </div>
  );
}
