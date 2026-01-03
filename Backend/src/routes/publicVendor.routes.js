// src/routes/publicVendor.routes.js
import express from "express";
import {
  getPublicVendorInfo,
  uploadFilesToVendor,
} from "../controllers/publicVendor.controller.js";
import { validatePublicUpload } from "../middleware/publicUpload.middleware.js";

const router = express.Router();

router.get("/:vendorId", getPublicVendorInfo);

router.post(
  "/:vendorId/upload",
  validatePublicUpload,
  uploadFilesToVendor
);

export default router;
