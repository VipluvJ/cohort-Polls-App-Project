import { Router } from "express";
import { createPollController } from "../controllers/poll.controller.js";
import { getAllPollsController } from "../controllers/poll.controller.js";
import { validate } from "../middlewares/validate.js";
import { createPollSchema } from "../validators/poll.validator.js";

const router = Router();

router.post("/", validate(createPollSchema), createPollController);

export default router;
