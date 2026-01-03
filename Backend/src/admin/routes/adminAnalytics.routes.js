import express from "express";
import { requireAdmin } from "../../middleware/admin.middleware.js";
import {
  getOverviewAnalytics,
  getVendorAnalytics,
  getFileAnalytics,
  getSecurityAnalytics,
  getAdminActionAnalytics,
  getAuditTimeline,
} from "../controllers/adminAnalytics.controller.js";

const router = express.Router();

router.get("/overview", requireAdmin, getOverviewAnalytics);
router.get("/vendors", requireAdmin, getVendorAnalytics);
router.get("/files", requireAdmin, getFileAnalytics);
router.get("/security", requireAdmin, getSecurityAnalytics);
router.get("/admin-actions", requireAdmin, getAdminActionAnalytics);
router.get("/audit", requireAdmin, getAuditTimeline);

export default router;
