import { Router } from "express";
import {
  createPollController,
  getActivePollsController,
  getPollByIdController,
} from "../controllers/poll.controller.js";
import { getAllPollsController } from "../controllers/poll.controller.js";
import { validate } from "../middlewares/validate.js";
import { createPollSchema } from "../validators/poll.validator.js";
import { getPollById } from "../services/poll.service.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  validate(createPollSchema, "body"),
  createPollController,
);
router.get("/get-all", getAllPollsController);

router.get("/active-polls", getActivePollsController);

router.get("/:pollId", getPollByIdController);

export default router;
