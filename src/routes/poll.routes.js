import { Router } from "express";
import {
  createPollController,
  getPollByIdController,
} from "../controllers/poll.controller.js";
import { getAllPollsController } from "../controllers/poll.controller.js";
import { validate } from "../middlewares/validate.js";
import { createPollSchema } from "../validators/poll.validator.js";
import { getPollById } from "../services/poll.service.js";

const router = Router();

router.post("/", validate(createPollSchema), createPollController);

router.get("/get-all", getAllPollsController);

router.get("/:id", getPollByIdController);

export default router;
