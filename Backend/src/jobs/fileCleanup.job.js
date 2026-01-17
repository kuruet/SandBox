// src/jobs/fileCleanup.job.js
import fs from "fs/promises";
import File from "../models/File.js";
import logger from "../config/logger.js";

export const startFileCleanupJob = () => {
  const SIX_HOURS = 6 * 60 * 60 * 1000;

  setInterval(async () => {
    try {
      const now = new Date();

      const filesToDelete = await File.find({
        $or: [
          { expiresAt: { $lte: now } },
          { isDeleted: true },
        ],
      });

      for (const file of filesToDelete) {
        try {
          // Delete file from disk
          await fs.unlink(file.filePath);
        } catch (err) {
          // File might already be gone — safe to ignore
          logger.warn(
            `Disk cleanup warning for file ${file._id}: ${err.message}`
          );
        }

        // Delete DB record
        await file.deleteOne();
      }

      if (filesToDelete.length > 0) {
        logger.info(
          `🧹 Cleanup job removed ${filesToDelete.length} files`
        );
      }
    } catch (error) {
      logger.error("❌ File cleanup job failed:", error);
    }
  }, SIX_HOURS);

  logger.info("🧹 File cleanup job started (every 6 hours)");
};
