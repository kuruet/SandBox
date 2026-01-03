import express from "express";
import { requireAdmin } from "../../middleware/admin.middleware.js";
import { getAllVendorsController, getVendorFilesController , updateVendorStatusController, updateVendorFileStatusController} from "../controllers/adminVendor.controller.js";

const router = express.Router();

/**
 * GET /admin/vendors
 * Admin-only: Fetch all vendors (paginated, read-only)
 */
router.get("/vendors", requireAdmin, getAllVendorsController);

router.get(
  "/vendors/:vendorId/files",
  requireAdmin,
  getVendorFilesController
);

router.patch(
  "/vendors/:vendorId/status",
  requireAdmin,
  updateVendorStatusController
);

router.patch(
  "/vendors/:vendorId/files/:fileId/status",
  requireAdmin,
  updateVendorFileStatusController
);

export default router;
