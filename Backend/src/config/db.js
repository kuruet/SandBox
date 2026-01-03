// src/config/db.js
import mongoose from "mongoose";
import logger from "./logger.js";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not set in the .env file");
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000 // optional but recommended
    });

    logger.info("✅ MongoDB connected successfully");
  } catch (error) {
    logger.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
