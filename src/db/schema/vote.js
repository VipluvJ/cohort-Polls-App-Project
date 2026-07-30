import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

import { options } from "./option.js";

export const votes = pgTable("votes", {
  id: uuid("id").defaultRandom().primaryKey(),

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
});
