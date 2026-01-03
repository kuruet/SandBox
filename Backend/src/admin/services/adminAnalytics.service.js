import Vendor from "../../models/Vendor.js";
import File from "../../models/File.js";

import {
  countAuditLogs,
  aggregateAuditLogs,
  findAuditLogs,
} from "../audit/audit.service.js";

/* =====================================================
   OVERVIEW ANALYTICS
   ===================================================== */
export async function computeOverviewAnalytics({ startDate }) {
  const [
    totalVendors,
    blockedVendors,
    uploadedFiles,
    printedFiles,
    deletedFiles,
    authFailures,
  ] = await Promise.all([
    Vendor.countDocuments(),
    Vendor.countDocuments({ status: "blocked" }),

    File.countDocuments({ createdAt: { $gte: startDate } }),
    File.countDocuments({ isPrinted: true, updatedAt: { $gte: startDate } }),
    File.countDocuments({ isDeleted: true, deletedAt: { $gte: startDate } }),

    countAuditLogs({
      action: { $regex: /auth\.failed/ },
      createdAt: { $gte: startDate },
    }),
  ]);

  return {
    vendors: {
      total: totalVendors,
      blocked: blockedVendors,
    },
    files: {
      uploaded: uploadedFiles,
      printed: printedFiles,
      deleted: deletedFiles,
    },
    security: {
      authFailures,
    },
  };
}

/* =====================================================
   VENDOR ANALYTICS
   ===================================================== */
export async function computeVendorAnalytics({ startDate }) {
  const activeVendorIds = await File.distinct("vendorId", {
    createdAt: { $gte: startDate },
  });

  const totalVendors = await Vendor.countDocuments();
  const blockedVendors = await Vendor.countDocuments({ status: "blocked" });

  return {
    totalVendors,
    blockedVendors,
    activeVendors: activeVendorIds.length,
  };
}

/* =====================================================
   FILE ANALYTICS
   ===================================================== */
export async function computeFileAnalytics({ startDate }) {
  const [totalUploads, softDeleted, printed] = await Promise.all([
    File.countDocuments({ createdAt: { $gte: startDate } }),
    File.countDocuments({ isDeleted: true, deletedAt: { $gte: startDate } }),
    File.countDocuments({ isPrinted: true, updatedAt: { $gte: startDate } }),
  ]);

  const storageAgg = await File.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: null,
        totalSize: { $sum: "$fileSize" },
        avgSize: { $avg: "$fileSize" },
      },
    },
  ]);

  return {
    uploads: totalUploads,
    softDeleted,
    printed,
    storage: storageAgg[0] || {
      totalSize: 0,
      avgSize: 0,
    },
  };
}

/* =====================================================
   SECURITY ANALYTICS
   ===================================================== */
export async function computeSecurityAnalytics({ startDate }) {
  const suspiciousEvents = await countAuditLogs({
    createdAt: { $gte: startDate },
    action: {
      $regex: /(auth\.failed|rate\.limit|unknown\.route)/,
    },
  });

  return {
    suspiciousEvents,
  };
}

/* =====================================================
   ADMIN ACTION ANALYTICS
   ===================================================== */
export async function computeAdminActionAnalytics({ startDate }) {
  return aggregateAuditLogs([
    {
      $match: {
        actorType: "admin",
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: "$action",
        count: { $sum: 1 },
      },
    },
  ]);
}

/* =====================================================
   AUDIT TIMELINE (READ-ONLY)
   ===================================================== */
export async function getAuditTimelineData({
  range,
  actorType,
  action,
  limit,
}) {
  const filter = {
    createdAt: { $gte: range.startDate },
  };

  if (actorType) filter.actorType = actorType;
  if (action) filter.action = action;

  return findAuditLogs(filter, { limit });
}
