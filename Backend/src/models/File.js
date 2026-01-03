import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    vendorId: {
      type: String,
      required: true,
      index: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    previewImages: [String],
    printed: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isDeleted: {
  type: Boolean,
  default: false,
  index: true,
},

  },
  
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);
