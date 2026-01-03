export function validateAnalyticsQuery(req, res, next) {
  const allowedRanges = ["24h", "7d", "30d"];
  const { range } = req.query;

  if (range && !allowedRanges.includes(range)) {
    return res.status(400).json({ message: "Invalid range parameter" });
  }

  next();
}
