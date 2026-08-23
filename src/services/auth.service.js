import { eq } from "drizzle-orm";

import { db } from "../db/index.js";

import { users, authSessions } from "../db/schema/index.js";

import { hashPassword, verifyPassword } from "../utils/password.js";

import ApiError from "../utils/ApiError.js";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

// --------------------------------
// Register
// --------------------------------

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    throw ApiError.conflict("An account with this email already exists");
  }

  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    });

  return user;
};

// --------------------------------
// Login
// --------------------------------

export const loginUser = async ({ email, password }) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const passwordValid = await verifyPassword(user.passwordHash, password);

  if (!passwordValid) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
};

// --------------------------------
// Create auth session
// --------------------------------

export const createAuthSession = async (userId) => {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const [session] = await db
    .insert(authSessions)
    .values({
      userId,
      expiresAt,
    })
    .returning({
      id: authSessions.id,
      userId: authSessions.userId,
      expiresAt: authSessions.expiresAt,
    });

  return session;
};

// --------------------------------
// Get user from session
// --------------------------------

export const getUserFromSession = async (sessionId) => {
  const result = await db.query.authSessions.findFirst({
    where: eq(authSessions.id, sessionId),

    with: {
      user: true,
    },
  });

  if (!result) {
    return null;
  }

  if (new Date() > result.expiresAt) {
    await db.delete(authSessions).where(eq(authSessions.id, sessionId));

    return null;
  }

  return result.user;
};

// --------------------------------
// Delete session
// --------------------------------

export const deleteAuthSession = async (sessionId) => {
  await db.delete(authSessions).where(eq(authSessions.id, sessionId));
};
