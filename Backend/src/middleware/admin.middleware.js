import jwt from "jsonwebtoken";
import logger from "../config/logger.js";
import dotenv from "dotenv";
dotenv.config();

import Admin from "../admin/models/admin.model.js";


console.log("ADMIN_JWT_SECRET:", process.env.ADMIN_JWT_SECRET);

/**
 * Admin authentication & authorization middleware
 * - Verifies JWT
 * - Ensures role === admin
 * - Ensures admin is active
 * - Attaches admin context to req.admin
 */
export async function requireAdmin(req, res, next) {
  try {
    // 1. Extract Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Missing or invalid Authorization header",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: "Invalid or expired admin token",
      });
    }
logger.info("ADMIN JWT SECRET:", process.env.ADMIN_JWT_SECRET);
logger.info("ADMIN TOKEN:", token);
    logger.info("DECODED ADMIN TOKEN:", decoded);
    // 3. Enforce role
    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Admin access required",
      });
    }

    // 4. Fetch admin from DB (fresh check)
    const admin = await Admin.findById(decoded.sub);

    if (!admin) {
      return res.status(401).json({
        message: "Admin account not found",
      });
    }

    // 5. Status check
    if (admin.status !== "active") {
      return res.status(403).json({
        message: "Admin account is disabled",
      });
    }

    // 6. Attach admin context to request
    req.admin = {
      id: admin._id,
      email: admin.email,
      role: "admin",
    };

    // 7. Continue
    next();
  } catch (error) {
    next(error);
  }
}
