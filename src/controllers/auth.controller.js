import {
  registerUser,
  loginUser,
  createAuthSession,
  deleteAuthSession,
} from "../services/auth.service.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const AUTH_COOKIE = "authSession";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

export const registerController = async (req, res) => {
  console.log("REGISTER BODY:", req.body);

  const { name, email, password } = req.body;

  const user = await registerUser({
    name,
    email,
    password,
  });

  const session = await createAuthSession(user.id);

  res.cookie(AUTH_COOKIE, session.id, cookieOptions);

  return ApiResponse.created(res, "Account created successfully", {
    user,
  });
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await loginUser({
    email,
    password,
  });

  const session = await createAuthSession(user.id);

  res.cookie(AUTH_COOKIE, session.id, cookieOptions);

  return ApiResponse.ok(res, "Login successful", {
    user,
  });
};

export const logoutController = async (req, res) => {
  const sessionId = req.cookies[AUTH_COOKIE];

  if (sessionId) {
    await deleteAuthSession(sessionId);
  }

  res.clearCookie(AUTH_COOKIE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return ApiResponse.ok(res, "Logged out successfully");
};

export const meController = async (req, res) => {
  if (!req.user) {
    throw ApiError.unauthorized("You are not authenticated");
  }

  return ApiResponse.ok(res, "Authenticated user", {
    user: req.user,
  });
};
