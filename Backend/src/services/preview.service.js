import fs from "fs";
import path from "path";
import { exec } from "child_process";

const POPPLER_PATH = "C:/poppler-25.12.0/Library/bin/pdftoppm.exe";

export const generatePdfPreviews = async (pdfPath, fileId) => {
  return new Promise((resolve, reject) => {
    try {
      const previewDir = path.join(
        process.cwd(),
        "uploads",
        "previews",
        fileId
      );

      // Ensure preview directory exists
      fs.mkdirSync(previewDir, { recursive: true });

      const outputPrefix = path.join(previewDir, "page");

      const command = `"${POPPLER_PATH}" -png -r 120 "${pdfPath}" "${outputPrefix}"`;

      exec(command, (error) => {
        if (error) {
          return reject(error);
        }

        // Read generated images
        const files = fs
          .readdirSync(previewDir)
          .filter((f) => f.endsWith(".png"))
          .map((f) =>
            `/uploads/previews/${fileId}/${f}`.replace(/\\/g, "/")
          );

        resolve(files);
      });
    } catch (err) {
      reject(err);
    }
  });
};
