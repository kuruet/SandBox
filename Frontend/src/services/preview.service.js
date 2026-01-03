import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import pdf from "pdf-poppler";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePdfPreviews = async (pdfPath, fileId) => {
  const outputDir = path.join(
    __dirname,
    "../../uploads/previews",
    fileId
  );

  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  const options = {
    format: "png",
    out_dir: outputDir,
    out_prefix: "page",
    page: null, // all pages
  };

  try {
    await pdf.convert(pdfPath, options);

    // Collect generated images
    const files = fs
      .readdirSync(outputDir)
      .filter((f) => f.endsWith(".png"))
      .map((f) =>
        path.join("uploads/previews", fileId, f).replace(/\\/g, "/")
      );

    return files;
  } catch (err) {
    console.error("PDF preview generation failed:", err);
    return [];
  }
};
