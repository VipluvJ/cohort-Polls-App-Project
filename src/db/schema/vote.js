import { pgTable, uuid, varchar, timestamp, unique } from "drizzle-orm/pg-core";

import { polls } from "./poll.js";
import { options } from "./option.js";

export const votes = pgTable(
  "votes",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    pollId: uuid("poll_id")
      .references(() => polls.id, {
        onDelete: "cascade",
      })
      .notNull(),

    optionId: uuid("option_id")
      .references(() => options.id, {
        onDelete: "cascade",
      })
      .notNull(),

    sessionId: varchar("session_id", {
      length: 255,
    }).notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    uniqueVote: unique().on(table.pollId, table.sessionId),
  }),
);
