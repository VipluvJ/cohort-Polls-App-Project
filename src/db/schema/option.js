import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

import { polls } from "./poll.js";

export const options = pgTable("options", {
  id: uuid("id").defaultRandom().primaryKey(),

  pollId: uuid("poll_id")
    .references(() => polls.id, {
      onDelete: "cascade",
    })
    .notNull(),

  text: varchar("text", { length: 255 }).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
