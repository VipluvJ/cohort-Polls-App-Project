import ApiResponse from "../utils/ApiResponse.js";
import {
  getActivePolls,
  getAllPolls,
  getPollById,
} from "../services/poll.service.js";

import { createPoll } from "../services/poll.service.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { polls, options } from "../db/schema/index.js";

export const createPollController = async (req, res) => {
  const poll = await createPoll({
    ...req.body,
    userId: req.user.id,
  });
  return ApiResponse.created(res, "polls created successfully", poll);
};

export const getAllPollsController = async (req, res) => {
  const allPolls = await getAllPolls();
  return ApiResponse.ok(res, "polls fetched successfully", allPolls);
};

export const getPollByIdController = async (req, res) => {
  console.log("GET POLL CONTROLLER HIT");
  console.log("ORIGINAL URL:", req.originalUrl);
  console.log("BASE URL:", req.baseUrl);
  console.log("PATH:", req.path);
  console.log("PARAMS:", req.params);
  console.log("POLL ID:", req.params.pollId);

  const { pollId } = req.params;
  const poll = await db.query.polls.findFirst({
    where: eq(polls.id, pollId),
    with: {
      options: true,
    },
  });
  console.log("POLL FOUND:", poll);

  const pollDetails = await getPollById(pollId);
  return ApiResponse.ok(res, "poll fetched successfully", pollDetails);
};

export const getActivePollsController = async (req, res, next) => {
  try {
    const polls = await getActivePolls();

    return res.status(200).json({
      success: true,
      message: "Active polls fetched successfully",
      data: polls,
    });
  } catch (error) {
    next(error);
  }
};
