import express from "express";
import { uploadFiles, getFiles } from "../controllers/fileController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

// EXISTING — DO NOT TOUCH
router.post("/upload", upload.array("files", 10), uploadFiles);

// ✅ NEW — File listing API (Step 3.2)
router.get("/", verifyToken, getFiles);

export default router;
