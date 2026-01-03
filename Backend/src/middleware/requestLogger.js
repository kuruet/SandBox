import logger from "../config/logger.js";

export const requestLogger = (req, res, next) => {
  logger.info(`[Request] ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
};
