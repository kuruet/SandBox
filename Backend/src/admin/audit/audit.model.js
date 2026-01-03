import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    actorType: {
      type: String,
      enum: ["admin", "vendor"],
      required: true,
      index: true,
    },

    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    // Simplified: Service.js handles the logic, Model just stores it.
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false, 
      default: null,
    },

    action: {
      type: String,
      required: true,
      index: true,
    },

    targetType: {
      type: String,
      default: null,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    ipAddress: {
      type: String,
      required: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    strict: true,
    collection: "audit_logs",
  }
);

const AuditLog =
  mongoose.models.AuditLog ||
  mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;