import { Router } from "express";

import { getPollResultsController } from "../controllers/result.controller.js";

import { validate } from "../middlewares/validate.js";
import { pollIdSchema } from "../validators/vote.validator.js";

const router = Router();

router.get(
  "/:pollId/results",
  validate(pollIdSchema, "params"),
  getPollResultsController,
);

export default router;
