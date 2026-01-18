import Vendor from "../models/Vendor.js";
import File from "../models/File.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import logger from "../config/logger.js";
import { getIO } from "../sockets/index.js";
import { createAuditLog } from "../admin/audit/audit.service.js";
import QRCode from "qrcode";


// import AuditLog from "../models/AuditLog.js";



/**
 * ---------------------------
 * Register Vendor
 * ---------------------------
 */
export const registerVendor = async (req, res) => {
  try {
    const { firstName, lastName, email, password, shopName } = req.body;

    if (!firstName || !lastName || !email || !password || !shopName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if vendor exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor already exists" });
    }

    

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


      // SYSTEM responsibility
  const vendorId = uuidv4();
  const qrId = uuidv4();

    // Create vendor
     const vendor = new Vendor({
    firstName,
    lastName,
    email,
    passwordHash: hashedPassword,
    shopName,
    vendorId,
    qrId,
    tokenInvalidBefore: null,
  });

    await vendor.save();

    res.status(201).json({
      message: "Vendor registered successfully",
      vendorId: vendor.vendorId,
      qrId: vendor.qrId,
    });
  } catch (error) {
    logger.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ---------------------------
 * Vendor Login
 * ---------------------------
 */
export const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email });
if (!vendor) {
  req.failedLogin = true;
  return res.status(400).json({ message: "Invalid credentials" });
}

    const isMatch = await bcrypt.compare(password, vendor.passwordHash);
if (!isMatch) {
  req.failedLogin = true;
  return res.status(400).json({ message: "Invalid credentials" });
}

// ✅ Reset global logout lock on successful login
vendor.tokenInvalidBefore = null;
await vendor.save();


   const token = jwt.sign(
  {
    vendorId: vendor.vendorId,
    email: vendor.email,
    role: "vendor",           // REQUIRED for socket auth
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
    issuer: "sandbox",        // optional but good
  }
);


    res.status(200).json({
      message: "Login successful",
      token,
      vendor: {
        vendorId: vendor.vendorId,
        firstName: vendor.firstName,
        lastName: vendor.lastName,
        shopName: vendor.shopName,
        email: vendor.email,
        qrId: vendor.qrId,
      },
    });
  } catch (error) {
    logger.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ---------------------------
 * Vendor Dashboard
 * ---------------------------
 */
export const getVendorDashboard = async (req, res) => {
  try {
    const vendorId = req.vendor.vendorId; // from JWT

    const vendor = await Vendor.findOne({ vendorId });
if (!vendor) {
  return res.status(404).json({ message: "Vendor not found" });
}

// ✅ ENSURE QR EXISTS (lazy generation for new vendors)
// ✅ ENSURE QR EXISTS (lazy generation for new vendors)
// ✅ ALWAYS regenerate QR (production-safe)
const frontendUrl = process.env.FRONTEND_URL;

if (!frontendUrl) {
  throw new Error("FRONTEND_URL is not configured");
}

const uploadUrl = `${frontendUrl}/upload?qrId=${vendor.qrId}`;
const qrDataUrl = await QRCode.toDataURL(uploadUrl);

vendor.qrCodeUrl = qrDataUrl;
await vendor.save();




    const now = new Date();
    const softExpiry = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours from now
    const hardCap = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days

    // ✅ Exclude soft-deleted files + correct sorting
    const files = await File.find({
      vendorId,
      isDeleted: { $ne: true },
         $or: [
        // Unprinted files → visible up to 7 days
        {
          printed: false,
          createdAt: { $gte: hardCap },
        },
        // Printed files → visible up to 24h
        {
          printed: true,
          createdAt: { $gte: softExpiry },
        },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      vendor: {
        vendorId: vendor.vendorId,
        firstName: vendor.firstName,
        lastName: vendor.lastName,
        shopName: vendor.shopName,
        email: vendor.email,
        qrId: vendor.qrId,
        qrCodeUrl: vendor.qrCodeUrl,
      },
      files,
    });
  } catch (error) {
    logger.error("Dashboard API Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * ---------------------------
 * Get Vendor Files Only
 * ---------------------------
 */
export const getVendorFiles = async (req, res) => {
  try {
    const vendorId = req.vendor.vendorId;
    const files = await File.find({ vendorId }).sort({ uploadedAt: -1 });

    res.status(200).json({
      count: files.length,
      files,
    });
  } catch (error) {
    logger.error("Get Vendor Files Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ---------------------------
 * Mark Files as Printed
 * ---------------------------
 */
export const markFilesAsPrinted = async (req, res) => {
  try {
    const vendorId = req.vendor.vendorId; // from JWT
    const { fileId } = req.params;

    const file = await File.findOne({ _id: fileId, vendorId });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // ✅ FORCE printed state (no dependency on req.body)
    file.printed = true;
    await file.save();

  try {
  await createAuditLog({
    action: "PRINT",
    vendorId,
    fileSnapshot: {
      fileId: file._id,
      originalName: file.originalName,
      senderName: file.senderName,
      fileType: file.fileType,
      fileSize: file.fileSize,
      createdAt: file.createdAt,
    },
    ipAddress:
      req.headers["x-forwarded-for"]?.split(",")[0] || req.ip,
  });
} catch (err) {
  console.error("⚠️ Audit log failed (PRINT):", err);
  // IMPORTANT: never throw — audit must not break main flow
}



    // ✅ Emit real-time event
    const io = getIO();
    io.to(`vendor:${vendorId}`).emit("file:printed", {
      fileId: file._id,
    });

    res.status(200).json({
      message: "File marked as printed",
      file: {
        _id: file._id,
        printed: true,
      },
    });
  } catch (error) {
    logger.error("Mark Printed Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const bulkMarkAsPrinted = async (req, res) => {
  console.log("🔥 BULK PRINT HIT");

  try {
    const vendorId = req.vendor.vendorId;
    const { fileIds } = req.body;

    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({ message: "fileIds required" });
    }

    const files = await File.find({
      _id: { $in: fileIds },
      vendorId,
      printed: false,
      isDeleted: { $ne: true },
    });

    const io = getIO();

    for (const file of files) {
      file.printed = true;
      await file.save();

      await AuditLog.create({
  action: "PRINT",
  vendorId,
  fileSnapshot: {
    fileId: file._id,
    originalName: file.originalName,
    senderName: file.senderName,
    fileType: file.fileType,
    fileSize: file.fileSize,
    createdAt: file.createdAt,
  },
  ipAddress:
    req.headers["x-forwarded-for"]?.split(",")[0] || req.ip,
});


      io.to(`vendor:${vendorId}`).emit("file:printed", {
        fileId: file._id,
      });
    }

    res.status(200).json({
      message: "Files marked as printed",
      count: files.length,
    });
  } catch (err) {
    logger.error("Bulk print error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const bulkSoftDeleteFiles = async (req, res) => {
  console.log("🔥 BULK DELETE HIT");

  try {
    const vendorId = req.vendor.vendorId;
    const { fileIds } = req.body;

    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({ message: "fileIds required" });
    }

    const files = await File.find({
      _id: { $in: fileIds },
      vendorId,
      isDeleted: { $ne: true },
    });

    const io = getIO();

    for (const file of files) {
      file.isDeleted = true;
      await file.save();

      io.to(`vendor:${vendorId}`).emit("file:deleted", {
        fileId: file._id,
      });
    }

    res.status(200).json({
      message: "Files deleted",
      count: files.length,
    });
  } catch (err) {
    logger.error("Bulk delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const softDeleteFile = async (req, res) => {
  try {
    const vendorId = req.vendor.vendorId;
    const { fileId } = req.params;

    const file = await File.findOne({
      _id: fileId,
      vendorId,
      isDeleted: { $ne: true },
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // ✅ Soft delete
    file.isDeleted = true;
    await file.save();

    // ✅ Emit real-time event
    const io = getIO();
    io.to(`vendor:${vendorId}`).emit("file:deleted", {
      fileId: file._id,
    });

    res.status(200).json({
      message: "File deleted successfully",
      fileId: file._id,
    });
  } catch (error) {
    logger.error("Soft Delete Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const downloadVendorQR = async (req, res) => {
  try {
    const vendorId = req.vendor.vendorId;

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor || !vendor.qrCodeUrl) {
      return res.status(404).json({ message: "QR code not found" });
    }

    const qrData = vendor.qrCodeUrl;

    // ✅ Ensure this is a base64 PNG
    if (!qrData.startsWith("data:image/png;base64,")) {
      return res.status(400).json({ message: "Invalid QR format" });
    }

    const base64Data = qrData.replace(
      "data:image/png;base64,",
      ""
    );

    const qrBuffer = Buffer.from(base64Data, "base64");

    const safeShopName =
      vendor.shopName?.replace(/\s+/g, "-").toLowerCase() || "vendor";

    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="sandbox-qr-${safeShopName}.png"`
    );

    return res.send(qrBuffer);
  } catch (error) {
    logger.error("QR Download Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logoutVendor = async (req, res) => {
  const vendor = await Vendor.findOne({ vendorId: req.vendor.vendorId });
  if (!vendor) return res.status(404).json({ message: "Vendor not found" });

  // 🔴 REQUIRED LINE
    req.vendor.tokenInvalidBefore = new Date();
  await req.vendor.save();

  res.json({ message: "Logged out from all sessions" });
};

