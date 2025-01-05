import { int, sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const usersTable = sqliteTable("users", {
  id: int("id").primaryKey({ autoIncrement: true }),
  userName: text("user_name").notNull().unique(),
  channelName: text("channel_name"),
  channelDescription: text("channel_description"),
  logoUrl: text("logo_url"),
  personalWebsite: text("personal_website"),
  feedUrl: text("feed_url"),
  authorName: text("author_name"),
  authorEmail: text("author_email"),
  ownerName: text("owner_name"),
  ownerEmail: text("owner_email"),
  is_explicit_content: integer("is_explicit_content").notNull().default(0), // Represents a boolean since there is no boolean type in sqlite
  language: text("language").default("en")
})

// Type for better type inference
export type DBUser = typeof usersTable.$inferSelect
export type DBNewUser = typeof usersTable.$inferInsert
