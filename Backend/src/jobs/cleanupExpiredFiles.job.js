// src/jobs/cleanupExpiredFiles.job.js
import cron from "node-cron";
import fs from "fs/promises";
import File from "../models/File.js";

export const startExpiredFileCleanupJob = () => {
  // ⏱ Runs every 6 hours
  cron.schedule("0 */6 * * *", async () => {
    console.log("🧹 Cleanup job started");

    try {
      const now = new Date();

      // 1️⃣ Find expired, not-yet-deleted files
      const expiredFiles = await File.find({
        expiresAt: { $lte: now },
        isDeleted: false,
      });

      for (const file of expiredFiles) {
        try {
          // 2️⃣ Remove file from disk (safe)
          if (file.filePath) {
            await fs.unlink(file.filePath).catch(() => {
              // File may already be gone — acceptable
            });
          }

          // 3️⃣ Mark DB record deleted
          file.isDeleted = true;
          await file.save();
        } catch (fileErr) {
          console.error(
            `❌ Failed to cleanup file ${file._id}:`,
            fileErr.message
          );
        }
      }

      console.log(`🧹 Cleanup complete — ${expiredFiles.length} files processed`);
    } catch (err) {
      console.error("❌ Cleanup job failed:", err.message);
    }
  });
};
