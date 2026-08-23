import { Router } from "express";

import {
  registerController,
  loginController,
  logoutController,
  meController,
} from "../controllers/auth.controller.js";

import { validate } from "../middlewares/validate.js";

import { registerSchema, loginSchema } from "../validators/auth.validator.js";

import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/auth/register",
  validate(registerSchema, "body"),
  registerController,
);

router.post("/auth/login", validate(loginSchema, "body"), loginController);

router.post("/auth/logout", logoutController);

router.get("/auth/me", requireAuth, meController);

export default router;
