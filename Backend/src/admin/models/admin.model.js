import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true, // Added to prevent "Admin Not Found" due to spaces
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false, // Security: Don't include password in normal searches
    },

    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },

    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
    },

    lockedUntil: {
      type: Date,
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Admin", adminSchema);