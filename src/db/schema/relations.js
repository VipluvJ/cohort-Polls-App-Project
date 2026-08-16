import { relations } from "drizzle-orm";

import { users } from "./user.js";
import { authSessions } from "./auth-session.js";
import { polls } from "./poll.js";
import { options } from "./option.js";
import { votes } from "./vote.js";

// User
export const usersRelations = relations(users, ({ many }) => ({
  polls: many(polls),
  authSessions: many(authSessions),
}));

// Auth sessions
export const authSessionsRelations = relations(authSessions, ({ one }) => ({
  user: one(users, {
    fields: [authSessions.userId],
    references: [users.id],
  }),
}));

// Poll
export const pollsRelations = relations(polls, ({ one, many }) => ({
  user: one(users, {
    fields: [polls.userId],
    references: [users.id],
  }),

  options: many(options),

  votes: many(votes),
}));

// Option
export const optionsRelations = relations(options, ({ one, many }) => ({
  poll: one(polls, {
    fields: [options.pollId],
    references: [polls.id],
  }),

  votes: many(votes),
}));

// Vote
export const votesRelations = relations(votes, ({ one }) => ({
  option: one(options, {
    fields: [votes.optionId],
    references: [options.id],
  }),

  poll: one(polls, {
    fields: [votes.pollId],
    references: [polls.id],
  }),
}));
