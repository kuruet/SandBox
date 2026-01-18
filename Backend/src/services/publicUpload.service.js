// src/services/publicUpload.service.js
import fs from "fs/promises";
import File from "../models/File.js";
import { getIO } from "../sockets/index.js";

export const handlePublicUpload = async ({
  vendor,
  senderName,
  files,
}) => {
  if (!files || files.length === 0) {
    throw new Error("No files provided");
  }

  const results = {
    success: [],
    failed: [],
  };

  for (const file of files) {
    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    );

    try {
      const newFile = await File.create({
        vendorId: vendor.vendorId,        // String UUID (LOCKED)
        senderName,

        originalName: file.originalname,
        fileName: file.originalname,
        fileType: file.mimetype,
        filePath: file.path,

        expiresAt,
        printed: false,
        isDeleted: false,
      });

      results.success.push(newFile);
    } catch (err) {
      // 🔥 CRITICAL: prevent orphan disk files
      try {
        await fs.unlink(file.path);
      } catch (cleanupErr) {
        console.error(
          "Failed to cleanup orphan upload file:",
          cleanupErr
        );
      }

      results.failed.push({
        fileName: file.originalname,
        reason: err?.message || "Upload persistence failed",
      });
    }
  }

  // 🔔 Realtime notify vendor ONLY for successful files
// 🔔 Realtime notify vendor (NON-BLOCKING)
if (results.success.length > 0) {
  try {
    const io = getIO();

    for (const file of results.success) {
      io.to(`vendor:${vendor.vendorId}`).emit("file:uploaded", {
        id: file._id,
        senderName: file.senderName,
        fileName: file.fileName,
        printed: file.printed,
        createdAt: file.createdAt,
      });
    }
  } catch (err) {
    console.warn(
      "⚠️ Socket emit failed (ignored):",
      err.message
    );
    // IMPORTANT: do NOT throw
  }
}


return results.success;
};
