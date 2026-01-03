export function parseAnalyticsRange(range = "7d") {
  const now = new Date();
  let startDate;

  switch (range) {
    case "24h":
      startDate = new Date(now - 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
      break;
    case "7d":
    default:
      startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
  }

  return { startDate, endDate: now };
}
