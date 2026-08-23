import { getUserFromSession } from "../services/auth.service.js";

import ApiError from "../utils/ApiError.js";

const AUTH_COOKIE = "authSession";

export const requireAuth = async (req, res, next) => {
  const sessionId = req.cookies[AUTH_COOKIE];

  if (!sessionId) {
    throw ApiError.unauthorized("Authentication required");
  }

  const user = await getUserFromSession(sessionId);

  if (!user) {
    throw ApiError.unauthorized("Invalid or expired session");
  }

  req.user = user;
  req.authSessionId = sessionId;

  next();
};
