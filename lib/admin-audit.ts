import { prisma } from "@/lib/db";

type AdminAuditEvent = {
  actor?: string | null;
  action: string;
  resource: string;
  resourceId?: string;
  status: "success" | "failure";
  detail?: Record<string, unknown>;
};

export function logAdminAudit(event: AdminAuditEvent) {
  const payload = {
    ts: new Date().toISOString(),
    ...event,
  };
  // Structured log for PM2/Nginx collection.
  console.log("[ADMIN-AUDIT]", JSON.stringify(payload));

  prisma.adminAuditLog
    .create({
      data: {
        actor: event.actor ?? null,
        action: event.action,
        resource: event.resource,
        resourceId: event.resourceId ?? null,
        status: event.status,
        detail: event.detail ? JSON.stringify(event.detail) : null,
      },
    })
    .catch((err) => {
      console.error("[ADMIN-AUDIT-DB-ERROR]", err?.message || err);
    });
}
