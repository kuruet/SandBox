import express from "express";
import adminAuthRoutes from "./routes/adminAuth.routes.js";
import adminVendorRoutes from "./routes/adminVendor.routes.js";
 import adminAnalyticsRoutes from "./routes/adminAnalytics.routes.js";

const router = express.Router();

// /admin/auth/...
router.use("/auth", adminAuthRoutes);

// /admin/vendors/...
router.use("/", adminVendorRoutes);

router.use("/analytics", adminAnalyticsRoutes);


export default router;
