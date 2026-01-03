import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { downloadFile, getFilePreviewUrl } from "../controllers/fileController.js";
import { loginLimiter,  failedLoginLimiter } from "../middleware/rateLimiter.js";
import { vendorLoginValidator, fileIdParamValidator } from "../validators/vendorValidator.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { bulkMarkAsPrinted, softDeleteFile ,  bulkSoftDeleteFiles , downloadVendorQR } from "../controllers/vendorController.js";
import { actionLimiter } from "../config/rateLimiter.js";



import {
  getVendorDashboard,
  getVendorFiles,
  markFilesAsPrinted,
  loginVendor,       // <-- import loginVendor
  registerVendor     // optional if you want register API here too
} from "../controllers/vendorController.js";

const router = express.Router();

router.post("/login", failedLoginLimiter,  vendorLoginValidator, validateRequest,loginVendor);              // <-- add login route
router.post("/register",loginLimiter, registerVendor);       // optional
router.get("/dashboard", verifyToken, getVendorDashboard);
router.get("/files", verifyToken, getVendorFiles);
router.patch("/files/:fileId/printed", verifyToken,fileIdParamValidator, validateRequest, markFilesAsPrinted);
router.get("/:fileId/download",  downloadFile);
router.get("/:fileId/preview-url", verifyToken, getFilePreviewUrl);

router.get("/qr/download", verifyToken, downloadVendorQR);
router.patch("/files/bulk-print", verifyToken,actionLimiter, bulkMarkAsPrinted);
router.patch("/files/:fileId/delete", verifyToken, softDeleteFile);
router.patch("/files/bulk-delete", verifyToken, actionLimiter, bulkSoftDeleteFiles);


export default router;
