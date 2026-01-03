import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true, // e.g. "PRINT"
    },
    vendorId: {
      type: String,
      required: true,
    },
    fileSnapshot: {
      fileId: mongoose.Schema.Types.ObjectId,
      originalName: String,
      senderName: String,
      fileType: String,
      fileSize: Number,
      createdAt: Date,
    },
    ipAddress: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.model("AuditLog", auditLogSchema);
