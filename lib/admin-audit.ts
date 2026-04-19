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
}
