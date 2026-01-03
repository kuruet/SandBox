import express from "express";
import { generateVendorQR } from "../controllers/qrController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:qrId",  generateVendorQR); // JWT protected

export default router;
