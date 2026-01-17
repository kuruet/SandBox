// src/routes/publicVendor.routes.js
import express from "express";
import {
  getPublicVendorInfo,
  uploadFilesToVendor,
  
} from "../controllers/publicVendor.controller.js";
import { validatePublicUpload } from "../middleware/publicUpload.middleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { publicUploadLimiter } from "../middleware/rateLimiter.js";


const router = express.Router();

router.get("/qr/:qrId",publicUploadLimiter, getPublicVendorInfo);

router.post(
  "/qr/:qrId/upload",
  upload.array("files", 10),
  publicUploadLimiter,
  validatePublicUpload,
  uploadFilesToVendor
);



export default router;
