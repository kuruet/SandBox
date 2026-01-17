// src/controllers/publicVendor.controller.js
import Vendor from "../models/Vendor.js";
import { handlePublicUpload } from "../services/publicUpload.service.js";

/**
 * GET /public/vendors/qr/:qrId
 * Resolve shop name for QR upload page
 */
export const getPublicVendorInfo = async (req, res) => {
  try {
    const { qrId } = req.params;

    if (!qrId || typeof qrId !== "string") {
      return res.status(400).json({ message: "Invalid QR code" });
    }

    const vendor = await Vendor.findOne({ qrId }).select("shopName status");

    if (!vendor) {
      return res.status(404).json({ message: "Invalid QR code" });
    }

    if (vendor.status !== "active") {
      return res
        .status(403)
        .json({ message: "This shop is currently unavailable" });
    }

    return res.status(200).json({
      shopName: vendor.shopName,
    });
  } catch (error) {
    console.error("Public vendor lookup failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /public/vendors/qr/:qrId/upload
 * Handle public file uploads
 */
export const uploadFilesToVendor = async (req, res) => {
  try {
    const { qrId } = req.params;
    const { senderName } = req.body;

    // ── Input validation ─────────────────────────────
    if (!qrId || typeof qrId !== "string") {
      return res.status(400).json({ message: "Invalid QR code" });
    }

    if (!senderName || !senderName.trim()) {
      return res.status(400).json({ message: "Sender name is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files provided" });
    }

    // ── Vendor resolution ────────────────────────────
    const vendor = await Vendor.findOne({ qrId }).select(
      "_id vendorId status"
    );

    if (!vendor) {
      return res.status(404).json({ message: "Invalid QR code" });
    }

    if (vendor.status !== "active") {
      return res
        .status(403)
        .json({ message: "This shop is currently unavailable" });
    }

    // ── Upload handling (partial-safe) ───────────────
    const createdFiles = await handlePublicUpload({
      vendor,
      senderName: senderName.trim(),
      files: req.files,
    });

    // Defensive: should never happen, but production-safe
    if (!createdFiles || createdFiles.length === 0) {
      return res.status(400).json({
        message: "No files were uploaded",
        uploaded: [],
        failed: req.files.map((f) => ({
          fileName: f.originalname,
          reason: "Upload failed",
        })),
      });
    }

    // ── Full success ─────────────────────────────────
    if (createdFiles.length === req.files.length) {
      return res.status(201).json({
        message: "Files uploaded successfully",
        uploaded: createdFiles.map((f) => ({
          id: f._id,
          fileName: f.fileName,
        })),
        failed: [],
      });
    }

    // ── Partial success ──────────────────────────────
    const uploadedNames = new Set(
      createdFiles.map((f) => f.fileName)
    );

    const failed = req.files
      .filter((f) => !uploadedNames.has(f.originalname))
      .map((f) => ({
        fileName: f.originalname,
        reason: "Upload failed",
      }));

    return res.status(207).json({
      message: "Some files uploaded successfully",
      uploaded: createdFiles.map((f) => ({
        id: f._id,
        fileName: f.fileName,
      })),
      failed,
    });

  } catch (error) {
    console.error("Public upload failed:", error);
    return res.status(500).json({ message: "Upload failed" });
  }
};
