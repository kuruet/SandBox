// src/services/publicUpload.service.js
import File from "../models/File.js";
import { getIO } from "../sockets/index.js"; // your existing socket instance

export const handlePublicUpload = async ({
  vendor,
  senderName,
  files,
}) => {
  if (!files || files.length === 0) {
    throw new Error("No files provided");
  }

  const createdFiles = [];

  for (const file of files) {
    const newFile = await File.create({
      vendorId: vendor._id,
      senderName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      storagePath: file.path,
      printed: false,
      deleted: false,
    });

    createdFiles.push(newFile);
  }

  // 🔔 Notify vendor in real-time
  getIO.to(`vendor:${vendor._id}`).emit("file:uploaded", {
    id: createdFiles[0]._id,
    senderName: createdFiles[0].senderName,
    fileName: createdFiles[0].originalName,
    printed: false,
    createdAt: createdFiles[0].createdAt,
  });
};
