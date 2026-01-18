import jwt from "jsonwebtoken";
import Vendor from "../models/Vendor.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    // 1️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.vendorId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // 2️⃣ Fetch vendor (INCLUDE tokenInvalidBefore)
    const vendor = await Vendor.findOne({
      vendorId: decoded.vendorId,
    }).select("-passwordHash tokenInvalidBefore status vendorId");

    if (!vendor) {
      return res.status(401).json({ message: "Vendor not found" });
    }

    if (vendor.status !== "active") {
      return res.status(403).json({ message: "Vendor blocked" });
    }

    // 3️⃣ 🔥 Cross-device logout enforcement
    if (
      vendor.tokenInvalidBefore &&
      decoded.iat * 1000 < vendor.tokenInvalidBefore.getTime()
    ) {
      return res.status(401).json({
        message: "Session expired",
      });
    }

    // 4️⃣ Attach vendor to request
    req.vendor = vendor;
    req.vendor.vendorId = vendor.vendorId;

    next();
  } catch (error) {
    console.error("JWT Middleware Error:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
