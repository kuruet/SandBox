// src/middleware/publicUpload.middleware.js

const MAX_FILES = 10;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

export const validatePublicUpload = (req, res, next) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "No files uploaded",
      });
    }

    if (files.length > MAX_FILES) {
      return res.status(400).json({
        message: `You can upload a maximum of ${MAX_FILES} files`,
      });
    }

    for (const file of files) {
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return res.status(400).json({
          message: "Only PDF and image files (JPG, PNG) are allowed",
        });
      }

      if (file.size > MAX_FILE_SIZE) {
        return res.status(400).json({
          message: "Each file must be under 50MB",
        });
      }
    }

    next();
  } catch (error) {
    console.error("Public upload validation failed:", error);
    return res.status(500).json({
      message: "File validation failed",
    });
  }
};
