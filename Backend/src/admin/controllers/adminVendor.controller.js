import { fetchAllVendors } from "../services/adminVendor.service.js";
import { getVendorFilesService } from "../services/adminVendor.service.js";
import { updateVendorStatusService } from "../services/adminVendor.service.js";
import { updateVendorFileStatusService } from "../services/adminVendor.service.js";

export async function getAllVendorsController(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await fetchAllVendors({
      page: Number(page),
      limit: Number(limit),
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}


export async function getVendorFilesController(req, res, next) {
  try {
    const { vendorId } = req.params;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);

    const result = await getVendorFilesService({
      vendorId,
      page,
      limit,
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}



export async function updateVendorStatusController(req, res, next) {
  try {
    const { vendorId } = req.params;
    const { status } = req.body;

    if (!["active", "blocked"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Allowed values: active, blocked",
      });
    }

    const result = await updateVendorStatusService({
      vendorId,
      newStatus: status,
      admin: req.admin,
      ip: req.ip,
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}


 
export async function updateVendorFileStatusController(req, res, next) {
  try {
    const { vendorId, fileId } = req.params;
    const { action } = req.body;

    if (!["soft_delete", "mark_printed"].includes(action)) {
      return res.status(400).json({
        message: "Invalid action. Allowed: soft_delete, mark_printed",
      });
    }

    const result = await updateVendorFileStatusService({
      vendorId,
      fileId,
      action,
      admin: req.admin,
      ip: req.ip,
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}


