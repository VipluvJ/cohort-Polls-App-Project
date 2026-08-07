import { getPollResults } from "../services/result.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getPollResultsController = async (req, res) => {
  const { pollId } = req.params;

  const results = await getPollResults(pollId);

  return ApiResponse.ok(res, "Poll results fetched successfully", results);
};
