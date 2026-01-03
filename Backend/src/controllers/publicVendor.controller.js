// src/controllers/publicVendor.controller.js
import Vendor from "../models/Vendor.js";
import { handlePublicUpload } from "../services/publicUpload.service.js";

/**
 * GET /public/vendors/:vendorId
 * Resolve shop name for QR upload page
 */
export const getPublicVendorInfo = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!vendorId || typeof vendorId !== "string") {
      return res.status(400).json({ message: "Invalid QR code" });
    }

    const vendor = await Vendor.findOne({ vendorId }).select(
      "shopName status"
    );

    if (!vendor) {
      return res.status(404).json({ message: "Invalid QR code" });
    }

    if (vendor.status !== "active") {
      return res
        .status(403)
        .json({ message: "This shop is currently unavailable" });
    }

    return res.json({
      shopName: vendor.shopName,
    });
  } catch (error) {
    console.error("Public vendor lookup failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /public/vendors/:vendorId/upload
 * Handle public file uploads
 */
export const uploadFilesToVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { senderName } = req.body;

    if (!vendorId || typeof vendorId !== "string") {
      return res.status(400).json({ message: "Invalid QR code" });
    }

    if (!senderName || !senderName.trim()) {
      return res.status(400).json({ message: "Sender name is required" });
    }

    const vendor = await Vendor.findOne({ vendorId }).select("_id status");

    if (!vendor) {
      return res.status(404).json({ message: "Invalid QR code" });
    }

    if (vendor.status !== "active") {
      return res
        .status(403)
        .json({ message: "This shop is currently unavailable" });
    }

    await handlePublicUpload({
      vendor,
      senderName: senderName.trim(),
      files: req.files,
    });

    return res.status(201).json({
      message: "Files uploaded successfully",
    });
  } catch (error) {
    console.error("Public upload failed:", error);
    return res.status(500).json({ message: "Upload failed" });
  }
};
