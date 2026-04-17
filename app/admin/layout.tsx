import { ensureCsrfToken } from "@/lib/csrf";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  ensureCsrfToken();
  return <>{children}</>;
}
