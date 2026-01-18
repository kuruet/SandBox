import path from "path";
import fs from "fs";
import mime from "mime-types";
import File from "../models/File.js";
import Vendor from "../models/Vendor.js";
import logger from "../config/logger.js";
import { generatePdfPreviews } from "../services/preview.service.js";
import { generatePreviewToken } from "../utils/filePreviewToken.util.js";
import { verifyPreviewToken } from "../utils/filePreviewToken.util.js";

import { getIO } from "../sockets/index.js";

/* ===============================
   Download File (unchanged)
================================ */




export const getFilePreviewUrl = async (req, res) => {
  console.log("🟣 [backend] preview-url HIT");
  console.log("🟣 req.params.fileId:", req.params.fileId);
  console.log("🟣 req.vendor.vendorId:", req.vendor.vendorId);

  const { fileId } = req.params;
  const vendorId = req.vendor.vendorId;

  const file = await File.findById(fileId);
  console.log("🟣 file found:", !!file);

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  console.log("🟣 file.vendorId:", file.vendorId);

  if (file.vendorId !== vendorId) {
    console.log("🔴 Vendor mismatch");
    return res.status(403).json({ message: "Access denied" });
  }

  const token = generatePreviewToken({ fileId, vendorId });
  console.log("🟣 Generated preview token");

  const previewUrl = `/api/file-access/${fileId}/download?token=${token}`;
  console.log("🟣 Returning previewUrl:", previewUrl);

  res.json({ previewUrl });
};





export const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { token } = req.query;

    console.log("🔥 downloadFile HIT", fileId);

    if (!token) {
      return res.status(401).json({ message: "Missing preview token" });
    }

    let payload;
    try {
      payload = verifyPreviewToken(token);
    } catch {
      return res.status(401).json({ message: "Invalid or expired preview token" });
    }

    if (payload.fileId !== fileId) {
      return res.status(403).json({ message: "Token does not match file" });
    }

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // ✅ UUID vs UUID
    if (file.vendorId !== payload.vendorId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const uploadsDir = path.join(process.cwd(), "uploads");
    const absolutePath = path.join(
      uploadsDir,
      path.basename(file.filePath)
    );

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({  message: "This file is no longer available"});
    }

    const mimeType =
      mime.lookup(file.originalName) || "application/octet-stream";

    const isPreviewable =
      mimeType === "application/pdf" || mimeType.startsWith("image/");

    if (isPreviewable) {
      res.removeHeader("X-Frame-Options");
    }

    res.setHeader("Content-Type", mimeType);
    res.setHeader(
      "Content-Disposition",
      `${isPreviewable ? "inline" : "attachment"}; filename="${encodeURIComponent(
        file.originalName
      )}"`
    );

    return res.sendFile(absolutePath);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Download failed" });
  }
};





/* ===============================
   Upload Files + Preview (Step 3.5)
================================ */
export const uploadFiles = async (req, res) => {
  try {
    const { vendorId, senderName } = req.body;

    if (!vendorId || !senderName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24);

    const savedFiles = [];

    for (const file of req.files) {
      const newFile = await File.create({
        vendorId,
        senderName,
        originalName: file.originalname,
        fileName: file.filename,
        fileType: file.mimetype,
        filePath: file.path,
        expiresAt: expiry,
      });

      savedFiles.push(newFile);

      const io = getIO();
io.to(`vendor:${vendorId}`).emit("file:new", {
  _id: newFile._id,
  vendorId: newFile.vendorId,
  senderName: newFile.senderName,
  originalName: newFile.originalName,
  fileType: newFile.fileType,
  filePath: newFile.filePath,
  printed: newFile.printed,
  previewImages: newFile.previewImages || [],
  createdAt: newFile.createdAt,
});


      // ===============================
      // Step 3.5 — Secure Preview (PDF only)
      // ===============================
      if (file.mimetype === "application/pdf") {
        try {
          const previewImages = await generatePdfPreviews(
            file.path,
            newFile._id.toString()
          );

          newFile.previewImages = previewImages;
          await newFile.save();

          const io = getIO();
          io.to(`vendor:${vendorId}`).emit("file:previewReady", {
            fileId: newFile._id,
            previewImages,
          });
        } catch (err) {
          logger.error("Preview generation failed", err);
          // IMPORTANT: upload must NOT fail if preview fails
        }
      }
    }

    // ✅ RESPONSE WAS MISSING — MUST EXIST
    return res.status(201).json({
      message: "Files uploaded successfully",
      count: savedFiles.length,
    });
  } catch (error) {
    logger.error("Upload Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   Step 3.2 — Production File Listing
================================ */
export const getFiles = async (req, res) => {
  try {
    const vendorId = req.vendor.vendorId;

    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      printed,
      search,
    } = req.query;

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.min(parseInt(limit), 50);

    const now = new Date();
    const softExpiry = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24h
    const hardCap = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days

    const filter = {
      vendorId,
      isDeleted: { $ne: true },
       $or: [
        {
          printed: false,
          createdAt: { $gte: hardCap },
        },
        {
          printed: true,
          createdAt: { $gte: softExpiry },
        },
      ],
    };

    if (printed === "true") filter.printed = true;
    if (printed === "false") filter.printed = false;

    if (search && search.trim() !== "") {
      filter.$or = [
        { originalName: { $regex: search, $options: "i" } },
        { senderName: { $regex: search, $options: "i" } },
      ];
    }

    const allowedSortFields = ["createdAt", "originalName", "printed"];
    const sortField = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const files = await File.find(filter)
      .sort({ [sortField]: sortDirection })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    const total = await File.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: files,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error("File listing error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch files",
    });
  }
};
