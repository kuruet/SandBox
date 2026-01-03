import AuditLog from "./audit.model.js";

export async function createAuditLog({
  actorType,
  actorId,
  vendorId = null,
  action,
  targetType = null,
  targetId = null,
  ipAddress,
  metadata = {},
}) {
  // 1. Ensure basic fields exist
  if (!actorType || !actorId || !action || !ipAddress) {
    throw new Error("AUDIT_LOG_INVALID_INPUT");
  }

  // 2. ONLY require vendorId if the actor is a vendor
  if (actorType === "vendor" && !vendorId) {
    throw new Error("AUDIT_LOG_INVALID_VENDOR");
  }

  try {
    await AuditLog.create({
      actorType,
      actorId,
      vendorId: actorType === "vendor" ? vendorId : null, // Force null for admins
      action,
      targetType,
      targetId,
      ipAddress,
      metadata,
    });
  } catch (err) {
    // This log helps you see the REAL database error in your terminal
    console.error("DATABASE ERROR DURING AUDIT:", err.message);
    throw new Error("AUDIT_LOG_WRITE_FAILED");
  }
}


export async function countAuditLogs(filter) {
  return AuditLog.countDocuments(filter);
}

/**
 * Aggregate audit logs (used for analytics summaries)
 */
export async function aggregateAuditLogs(pipeline) {
  return AuditLog.aggregate(pipeline);
}

/**
 * Find audit logs for timelines / investigations
 */
export async function findAuditLogs(filter, options = {}) {
  const {
    limit = 50,
    sort = { createdAt: -1 },
    select = "actorType action targetType targetId ipAddress createdAt",
  } = options;

  return AuditLog.find(filter)
    .sort(sort)
    .limit(limit)
    .select(select);
}