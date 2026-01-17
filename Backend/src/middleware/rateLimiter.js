import rateLimit, { ipKeyGenerator } from "express-rate-limit";

/**
 * 🔐 Login rate limiter
 * Max 5 attempts per 15 minutes per IP (IPv4 + IPv6 safe)
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  keyGenerator: ipKeyGenerator,
  message: {
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 🧠 Failed login conditional limiter
 * Applied only when req.failedLogin === true
 */
export const failedLoginLimiter = (req, res, next) => {
  if (!req.failedLogin) return next();
  return loginLimiter(req, res, next);
};

/**
 * 🌐 General API rate limiter
 * Safe default (IPv6 protected)
 */
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  keyGenerator: ipKeyGenerator,
  message: {
    message: "Too many requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 📦 Public QR + Upload rate limiter
 * Keyed by IP (IPv6-safe) + qrId
 * Prevents QR abuse & upload spam
 */
export const publicUploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // per IP + QR
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req);
    const qrId = req.params?.qrId || "no-qr";
    return `${ip}:${qrId}`;
  },

  handler: (req, res) => {
    return res.status(429).json({
      message: "Too many uploads. Please wait.",
    });
  },
});
