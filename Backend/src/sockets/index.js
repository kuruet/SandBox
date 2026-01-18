import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Vendor from "../models/Vendor.js";
import vendorSocket from "./vendor.socket.js";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URLS
        ? process.env.FRONTEND_URLS.split(",")
        : [],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  /**
   * 🔐 JWT authentication + vendor enforcement
   */
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("UNAUTHORIZED"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🔒 Enforce vendor-only sockets
    if (!decoded?.vendorId) {
  return next(new Error("UNAUTHORIZED"));
}


      // 🔍 Verify vendor still active
      const vendor = await Vendor.findOne({
        vendorId: decoded.vendorId,
      }).select("vendorId status");

      if (!vendor || vendor.status !== "active") {
        return next(new Error("VENDOR_BLOCKED"));
      }

      // ✅ Single source of truth
      socket.vendorId = vendor.vendorId;

      next();
    } catch (err) {
      console.error("❌ Socket auth failed:", err.message);
      next(new Error("UNAUTHORIZED"));
    }
  });

  io.on("connection", (socket) => {
    // 🔒 Server-controlled room join
    const vendorRoom = `vendor:${socket.vendorId}`;
    socket.join(vendorRoom);

    console.log(`🔌 Vendor socket connected → ${vendorRoom}`);

    // ✅ Existing vendor logic (UNCHANGED)
    vendorSocket(io, socket);

    socket.on("disconnect", (reason) => {
      console.log(
        `❌ Vendor socket disconnected → ${socket.vendorId} (${reason})`
      );
    });
  });

  console.log("🔌 Socket.IO initialized (production-ready)");
};

/**
 * Safe IO accessor
 */
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

/**
 * 🚫 Admin utility — force disconnect vendor sockets
 * (used when vendor is blocked)
 */
export const disconnectVendorSockets = (vendorId) => {
  if (!io) return;

  const room = `vendor:${vendorId}`;

  io.to(room).emit("vendor:blocked", {
    message: "Your account has been blocked by admin.",
  });

  const sockets = io.sockets.adapter.rooms.get(room);
  if (!sockets) return;

  for (const socketId of sockets) {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      socket.disconnect(true);
    }
  }

  console.warn(`🚫 All sockets disconnected for vendor:${vendorId}`);
};
