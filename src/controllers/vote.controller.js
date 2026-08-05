import { createVote } from "../services/vote.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createVoteController = async (req, res) => {
  const { pollId } = req.params;
  const { optionId } = req.body;

  // Temporary until we implement proper anonymous sessions/auth
  const sessionId = req.headers["x-session-id"];

  const vote = await createVote({
    pollId,
    optionId,
    sessionId,
  });

  return ApiResponse.created(res, "Vote submitted successfully", vote);
};
