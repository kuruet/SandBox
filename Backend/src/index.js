import dotenv from "dotenv";
dotenv.config();

// 🔐 Validate env FIRST
import { validateEnv } from "./config/env.js";
validateEnv();

import express from "express";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import http from "http";

import connectDB from "./config/db.js";
import logger from "./config/logger.js";

import authRoutes from "./routes/authRoutes.js";
import qrRoutes from "./routes/qrRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import adminModule from "./admin/index.js";
import fileAccessRoutes from "./routes/fileAccessRoutes.js";
import publicVendorRoutes from "./routes/publicVendor.routes.js";
import { startFileCleanupJob } from "./jobs/fileCleanup.job.js";
import { startExpiredFileCleanupJob } from "./jobs/cleanupExpiredFiles.job.js";

import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { initSocket } from "./sockets/index.js";

// Initialize Express
const app = express();

app.set('trust proxy', 1);


// Static files
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.use(express.json({ limit: "55mb" }));
app.use(express.urlencoded({ extended: true, limit: "55mb" }));


// CORS
// CORS (production-safe, env-driven)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(o => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow non-browser clients (curl, mobile apps if any)
      if (!origin) return callback(null, true);

      // Explicit allow-list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Reject everything else
      return callback(new Error("CORS not allowed"));
    },

    credentials: false, // JWT via Authorization header only
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// Core middleware
app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },

    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        frameAncestors: ["'self'", "http://localhost:5173"],
      },
    },
  })
);

app.disable("x-powered-by");

app.use(requestLogger);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/files", fileRoutes);

app.use("/api/file-access", fileAccessRoutes);
app.use("/public/vendors", publicVendorRoutes);


// ✅ ALL ADMIN ROUTES (AUTH + VENDORS)
app.use("/admin", adminModule);

// Error handler (last)
app.use(errorHandler);

// DB
// Server MUST start first
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// DB connects AFTER server is listening
connectDB()
  .then(() => {
    startFileCleanupJob();
    startExpiredFileCleanupJob();
    logger.info("Database connected");
  })
  .catch(err => {
    logger.error("Database connection failed", err);
  });


 app.get("/", (req, res) => {
  res.send("Sandbox Backend is running");
});
