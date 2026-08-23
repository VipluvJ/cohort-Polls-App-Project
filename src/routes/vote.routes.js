import { Router } from "express";

import { createVoteController } from "../controllers/vote.controller.js";

import { validate } from "../middlewares/validate.js";

import { voteSchema, pollIdSchema } from "../validators/vote.validator.js";
import { anonymousSession } from "../middlewares/session.js";

const router = Router();

router.post(
  "/:pollId/votes",

  (req, res, next) => {
    console.log("=== BEFORE VOTE VALIDATION ===");
    console.log("URL:", req.originalUrl);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);
    next();
  },
  anonymousSession,
  validate(pollIdSchema, "params"),
  validate(voteSchema, "body"),
  createVoteController,
);

export default router;
