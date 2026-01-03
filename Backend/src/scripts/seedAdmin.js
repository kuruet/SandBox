import dotenv from "dotenv";
dotenv.config();


import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Admin from "../admin/models/admin.model.js";

import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔑 Load .env from project root
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});


await mongoose.connect(process.env.MONGODB_URI);


if (!process.env.MONGODB_URI) {
  throw new Error("MONGO_URI is missing in .env");
}

const exists = await Admin.findOne({ email: "kuruet71@gmail.com" });
if (exists) {
  console.log("Admin already exists");
  process.exit(0);
}

const passwordHash = await bcrypt.hash("doyoubleed@77", 12);

await Admin.create({
  email: "kuruet71@gmail.com",
  passwordHash,
  role: "admin",
  status: "active"
});

console.log("Admin seeded");
process.exit(0);
