import ApiResponse from "../utils/ApiResponse.js";
import { getAllPolls, getPollById } from "../services/poll.service.js";
import { createPoll } from "../services/poll.service.js";

export const createPollController = async (req, res) => {
  const poll = await createPoll(req.body);
  return ApiResponse.created(res, "polls created successfully", poll);
};

export const getAllPollsController = async (req, res) => {
  const polls = await getAllPolls();
  return ApiResponse.ok(res, "polls fetched successfully", polls);
};

export const getPollByIdController = async (req, res) => {
  const { id } = req.params;
  const polls = await getPollById(id);
  return ApiResponse.ok(res, "poll fetched successfully", polls);
};
