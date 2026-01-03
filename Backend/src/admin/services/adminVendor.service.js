import Vendor from "../../models/Vendor.js";
import File from "../../models/File.js";
import { createAuditLog } from "../audit/audit.service.js";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export async function fetchAllVendors({ page, limit }) {
  const safeLimit = Math.min(limit || DEFAULT_LIMIT, MAX_LIMIT);
  const skip = (page - 1) * safeLimit;

  // Fetch vendors (read-only)
  const vendors = await Vendor.find({})
    .select("vendorId shopName email status createdAt lastLoginAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(safeLimit)
    .lean();

  // Aggregate file stats per vendor
  const vendorIds = vendors.map(v => v.vendorId);

  const fileStats = await File.aggregate([
    { $match: { vendorId: { $in: vendorIds }, isDeleted: false } },
    {
      $group: {
        _id: "$vendorId",
        uploadCount: { $sum: 1 },
        storageUsed: { $sum: "$fileSize" },
        lastUploadAt: { $max: "$createdAt" },
      },
    },
  ]);

  const statsMap = new Map();
  fileStats.forEach(stat => statsMap.set(stat._id, stat));

  const enrichedVendors = vendors.map(vendor => {
    const stats = statsMap.get(vendor.vendorId) || {};
    return {
      ...vendor,
      uploadCount: stats.uploadCount || 0,
      storageUsed: stats.storageUsed || 0,
      lastUploadAt: stats.lastUploadAt || null,
    };
  });

  const total = await Vendor.countDocuments();

  return {
    data: enrichedVendors,
    pagination: {
      page,
      limit: safeLimit,
      total,
    },
  };
}





export async function getVendorFilesService({ vendorId, page, limit }) {
  // 1. Verify vendor exists
  const vendor = await Vendor.findOne({ vendorId });

  if (!vendor) {
    const err = new Error("Vendor not found");
    err.statusCode = 404;
    throw err;
  }

  // 2. Query filter (exclude soft-deleted files)
  const filter = {
    vendorId,
    isDeleted: { $ne: true },
  };

  // 3. Pagination calculation
  const skip = (page - 1) * limit;

  // 4. Fetch files
  const [files, total] = await Promise.all([
    File.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "fileName fileType fileSize senderName isPrinted createdAt"
      ),
    File.countDocuments(filter),
  ]);

  // 5. Return normalized response
  return {
    data: files,
    pagination: {
      page,
      limit,
      total,
    },
  };
}




export async function updateVendorStatusService({
  vendorId,
  newStatus,
  admin,
  ip,
}) {
  // 1. Find vendor
  const vendor = await Vendor.findOne({ vendorId });

  if (!vendor) {
    const err = new Error("Vendor not found");
    err.statusCode = 404;
    throw err;
  }

  // 2. Idempotency check
  if (vendor.status === newStatus) {
    return {
      message: `Vendor already ${newStatus}`,
      vendorId,
      status: vendor.status,
    };
  }

  const previousStatus = vendor.status;

  // 3. Update status
  vendor.status = newStatus;
  await vendor.save();

  // 4. Audit log (MANDATORY)
  await createAuditLog({
    actorType: "admin",
    actorId: admin.id,
    vendorId: vendor._id,
    action: "vendor.status_updated",
    targetType: "vendor",
    targetId: vendor._id,
    ipAddress: ip,
    metadata: {
      previousStatus,
      newStatus,
    },
  });

  // 5. Return response
  return {
    message: "Vendor status updated successfully",
    vendorId,
    status: vendor.status,
  };
}




export async function updateVendorFileStatusService({
  vendorId,
  fileId,
  action,
  admin,
  ip,
}) {
  // 1. Verify vendor exists
  const vendor = await Vendor.findOne({ vendorId });

  if (!vendor) {
    const err = new Error("Vendor not found");
    err.statusCode = 404;
    throw err;
  }

  // 2. Verify file exists and belongs to vendor
  const file = await File.findOne({
    _id: fileId,
    vendorId,
  });

  if (!file) {
    const err = new Error("File not found for this vendor");
    err.statusCode = 404;
    throw err;
  }

  // 3. Apply action (idempotent)
  let actionTaken = null;

  if (action === "soft_delete") {
    if (file.isDeleted) {
      return {
        message: "File already deleted",
        fileId,
        status: "deleted",
      };
    }

    file.isDeleted = true;
    file.deletedAt = new Date();
    actionTaken = "file.soft_deleted";
  }

  if (action === "mark_printed") {
    if (file.isPrinted) {
      return {
        message: "File already marked as printed",
        fileId,
        status: "printed",
      };
    }

    file.isPrinted = true;
    actionTaken = "file.marked_printed";
  }

  await file.save();

  // 4. Audit log (MANDATORY)
  await createAuditLog({
    actorType: "admin",
    actorId: admin.id,
    vendorId: vendor._id,
    action: actionTaken,
    targetType: "file",
    targetId: file._id,
    ipAddress: ip,
    metadata: {
      fileName: file.fileName,
      vendorId,
    },
  });

  // 5. Response
  return {
    message: "File status updated successfully",
    fileId,
    action,
  };
}
