import { getDashboard } from "../services/dashboard.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getDashboardController = async (req, res, next) => {
  try {
    const dashboard = await getDashboard(req.user.id);

    return ApiResponse.ok(res, "Dashboard fetched successfully", dashboard);
  } catch (error) {
    next(error);
  }
};
