import logger from "../config/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(`[Error] ${req.method} ${req.originalUrl} - ${err.message}\n${err.stack}`);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
};