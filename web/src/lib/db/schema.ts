import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const channelInfoTable = sqliteTable("channel_info", {
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
  isExplicitContent: int("is_explicit_content").notNull().default(0),
  language: text("language").default("en")
})

export const episodesTable = sqliteTable("episodes", {
  id: int("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  thumbnail: text("thumbnail"),
  tags: text("tags").notNull(), // Store as JSON string
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  channelId: int("channel_id").references(() => channelInfoTable.id)
})

// Types for better type inference
export type DBChannelInfo = typeof channelInfoTable.$inferSelect
export type NewDBChannelInfo = typeof channelInfoTable.$inferInsert
export type DBEpisode = typeof episodesTable.$inferSelect
export type NewDBEpisode = typeof episodesTable.$inferInsert
