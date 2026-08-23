import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

import { users } from "./user.js";

export const polls = pgTable("polls", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  title: varchar("title", { length: 255 }).notNull(),

  description: text("description"),

  isActive: boolean("is_active").default(true).notNull(),

  isPublic: boolean("is_public").default(true).notNull(),

  expiresAt: timestamp("expires_at", {
    withTimezone: true,
  }),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
