import { Router } from "express";

import { createVoteController } from "../controllers/vote.controller.js";

import { validate } from "../middlewares/validate.js";

import { voteSchema, pollIdSchema } from "../validators/vote.validator.js";

const router = Router();

router.post(
  "/:pollId/votes",
  validate(pollIdSchema, "params"),
  validate(voteSchema, "body"),
  createVoteController,
);

export default router;
