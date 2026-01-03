import QRCode from "qrcode";
import Vendor from "../models/Vendor.js";
import logger from "../config/logger.js";

export const generateVendorQR = async (req, res) => {
  try {
    const { qrId } = req.params;

    if (!qrId) {
      return res.status(400).json({ message: "QR ID is required" });
    }

    // 🔥 FIX: lookup by qrId, NOT vendorId
    const vendor = await Vendor.findOne({ qrId });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Upload URL encoded with qrId only (public-safe)
    const uploadUrl = `${process.env.FRONTEND_URL}/upload?qrId=${qrId}`;

    // Generate QR code as Data URL
    const qrDataUrl = await QRCode.toDataURL(uploadUrl);

    // Cache QR in DB (optional but good)
    if (!vendor.qrCodeUrl) {
      vendor.qrCodeUrl = qrDataUrl;
      await vendor.save();
    }

    return res.status(200).json({
      qrCodeUrl: vendor.qrCodeUrl,
      uploadUrl,
    });

  } catch (error) {
    logger.error("QR Generation Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
