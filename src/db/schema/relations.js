import { relations } from "drizzle-orm";

import { polls } from "./poll.js";
import { options } from "./option.js";
import { votes } from "./vote.js";

// One poll has many options
export const pollsRelations = relations(polls, ({ many }) => ({
  options: many(options),
}));

// One option belongs to one poll
// One option can have many votes
export const optionsRelations = relations(options, ({ one, many }) => ({
  poll: one(polls, {
    fields: [options.pollId],
    references: [polls.id],
  }),

  votes: many(votes),
}));

// One vote belongs to one option
export const votesRelations = relations(votes, ({ one }) => ({
  option: one(options, {
    fields: [votes.optionId],
    references: [options.id],
  }),
}));
