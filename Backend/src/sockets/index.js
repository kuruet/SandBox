import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import vendorSocket from "./vendor.socket.js";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // tighten later if needed
      methods: ["GET", "POST"],
    },
  });

  // 🔐 JWT authentication during handshake
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication token missing"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded?.vendorId) {
        return next(new Error("Invalid token payload"));
      }

      // ✅ Attach vendorId to socket (single source of truth)
      socket.vendorId = decoded.vendorId;

      next();
    } catch (err) {
      console.error("❌ Socket auth failed:", err.message);
      next(new Error("Unauthorized socket connection"));
    }
  });

  io.on("connection", (socket) => {
    // ✅ Enforce vendor-only room here (global guarantee)
    const vendorRoom = `vendor:${socket.vendorId}`;
    socket.join(vendorRoom);

    console.log(`🔌 Vendor socket connected → ${vendorRoom}`);

    // Existing vendor socket logic (UNCHANGED)
    vendorSocket(io, socket);

    // ✅ Graceful disconnect handling
    socket.on("disconnect", (reason) => {
      console.log(
        `🔌 Vendor socket disconnected → ${socket.vendorId} (${reason})`
      );
    });
  });

  console.log("🔌 Socket.IO initialized");
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
