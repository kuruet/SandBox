import {
  computeOverviewAnalytics,
  computeVendorAnalytics,
  computeFileAnalytics,
  computeSecurityAnalytics,
  computeAdminActionAnalytics,
  getAuditTimelineData,
} from "../services/adminAnalytics.service.js";

import { parseAnalyticsRange } from "../utils/analyticsRange.util.js";

export async function getOverviewAnalytics(req, res, next) {
  try {
    const range = parseAnalyticsRange(req.query.range);
    const data = await computeOverviewAnalytics(range);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getVendorAnalytics(req, res, next) {
  try {
    const range = parseAnalyticsRange(req.query.range);
    const data = await computeVendorAnalytics(range);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getFileAnalytics(req, res, next) {
  try {
    const range = parseAnalyticsRange(req.query.range);
    const data = await computeFileAnalytics(range);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getSecurityAnalytics(req, res, next) {
  try {
    const range = parseAnalyticsRange(req.query.range);
    const data = await computeSecurityAnalytics(range);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getAdminActionAnalytics(req, res, next) {
  try {
    const range = parseAnalyticsRange(req.query.range);
    const data = await computeAdminActionAnalytics(range);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getAuditTimeline(req, res, next) {
  try {
    const range = parseAnalyticsRange(req.query.range);
    const { actorType, action, limit = 50 } = req.query;

    const data = await getAuditTimelineData({
      range,
      actorType,
      action,
      limit: Math.min(Number(limit), 50),
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
}
