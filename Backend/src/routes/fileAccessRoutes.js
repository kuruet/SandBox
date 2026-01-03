import express from "express";
import { downloadFile, getFilePreviewUrl } from "../controllers/fileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// JWT protected (normal API call)
router.get("/:fileId/preview-url", verifyToken, getFilePreviewUrl);

// iframe-safe (signed token)
router.get("/:fileId/download", downloadFile);

export default router;
