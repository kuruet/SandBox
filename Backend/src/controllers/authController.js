// src/controllers/authController.js
import Vendor from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import logger from "../config/logger.js";

/**
 * Helper: split a "name" into firstName / lastName
 */
const splitName = (name) => {
  if (!name) return { firstName: "", lastName: "" };
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  const firstName = parts.shift();
  const lastName = parts.join(" ");
  return { firstName, lastName };
};


const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;

// ---------------------------
// Register Vendor Controller
// ---------------------------
export const registerVendor = async (req, res) => {
  try {
    // Accept either { name } or { firstName, lastName }
    const { name, firstName: fName, lastName: lName, email, password, shopName } = req.body;

    // Normalize names
    const { firstName, lastName } = fName || lName ? { firstName: fName || "", lastName: lName || "" } : splitName(name);

    // Validate required fields
    // Required fields
if (!firstName || !email || !password || !shopName) {
  return res.status(400).json({
    message: "First name, email, password and shop name are required",
  });
}

// Email validation
if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Invalid email format",
  });
}

// Password validation
if (!passwordRegex.test(password)) {
  return res.status(400).json({
    message:
      "Password must be at least 8 characters long and include uppercase, lowercase, number and special character",
  });
}


    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(409).json({ message: "Vendor already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate vendor UUIDs
    const vendorId = uuidv4();
    const qrId = uuidv4().split("-")[0]; // short qr id

    // Create new vendor document.
    // Use field names that are common: firstName, lastName, shopName, email, passwordHash, vendorId, qrId
    const vendor = new Vendor({
      vendorId,
      qrId,
      firstName,
      lastName,
      shopName,
      email,
      passwordHash: hashedPassword,
    });

    await vendor.save();

    return res.status(201).json({
      message: "Vendor registered successfully",
      vendorId: vendor.vendorId,
      qrId: vendor.qrId,
    });
  } catch (error) {
    logger.error("Register Error:", error);
    // If it's a Mongoose validation error, surface useful message
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", details: error.errors });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// Login Vendor Controller
// ---------------------------
export const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const vendor = await Vendor.findOne({ email }).lean();
    if (!vendor) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Support both `passwordHash` and legacy `password` fields
    const storedHash = vendor.passwordHash ?? vendor.password ?? null;
    if (!storedHash) return res.status(500).json({ message: "Password not set for this account" });

    const isMatch = await bcrypt.compare(password, storedHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      logger.error("JWT_SECRET is not set in environment");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const payload = {
      id: vendor._id,
      vendorId: vendor.vendorId,
      email: vendor.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Return useful vendor info (avoid sending passwordHash)
    const safeVendor = {
      vendorId: vendor.vendorId,
      firstName: vendor.firstName || "",
      lastName: vendor.lastName || "",
      shopName: vendor.shopName || "",
      email: vendor.email,
      qrId: vendor.qrId || null,
    };

    return res.status(200).json({
      message: "Login successful",
      token,
      vendor: safeVendor,
    });
  } catch (error) {
    logger.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
