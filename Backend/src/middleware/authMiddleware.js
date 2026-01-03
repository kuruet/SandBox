import jwt from "jsonwebtoken";
import Vendor from "../models/Vendor.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    // Accept both "Bearer <token>" or just "<token>"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.vendorId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const vendor = await Vendor.findOne({
      vendorId: decoded.vendorId,
    }).select("-passwordHash");

    if (!vendor) {
      return res.status(401).json({ message: "Vendor not found" });
    }

    // ✅ Preserve existing behavior
    req.vendor = vendor;

    // ✅ Normalize critical fields for consistency
    req.vendor.vendorId = vendor.vendorId;

    next(); // pass control to next middleware/route
  } catch (error) {
    console.error("JWT Middleware Error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
