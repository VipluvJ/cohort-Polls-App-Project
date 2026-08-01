import ApiResponse from "../utils/ApiResponse.js";
import { getAllPolls } from "../services/poll.service.js";
import { createPoll } from "../services/poll.service.js";

export const createPollController = async (req, res) => {
  const poll = await createPoll(req.body);
  return ApiResponse.created(res, "polls created successfully", poll);
};

export const getAllPollsController = async (req, res) => {
  const polls = await getAllpolls();
  return ApiResponse.ok(res, "polls fetched successfully", polls);
};
