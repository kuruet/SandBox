import rateLimit from "express-rate-limit";

export const actionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 actions per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
});
