import { eq } from "drizzle-orm"
import db from "@/lib/db/drizzle"

import {
  channelInfoTable,
  podcastEpisodesTable,
  type DBChannelInfo,
  type DBNewChannelInfo,
  type DBEpisode,
  type DBNewEpisode
} from "./schema"

import type { ChannelInfo } from "@/app/types/channelinfo"
import type { PodcastEpisode } from "@/app/types/podcastepisode"

// Convert DB type to ChannelInfo type
const dbChannelToChannelInfo = (dbChannel: DBChannelInfo): ChannelInfo => ({
  id: dbChannel.id,
  userName: dbChannel.userName,
  channelName: dbChannel.channelName ?? "",
  channelDescription: dbChannel.channelDescription ?? "",
  logoUrl: dbChannel.logoUrl ?? "",
  personalWebsite: dbChannel.personalWebsite ?? "",
  feedUrl: dbChannel.feedUrl ?? "",
  authorName: dbChannel.authorName ?? "",
  authorEmail: dbChannel.authorEmail ?? "",
  ownerName: dbChannel.ownerName ?? "",
  ownerEmail: dbChannel.ownerEmail ?? "",
  isExplicitContent: dbChannel.isExplicitContent,
  language: dbChannel.language ?? "en"
})

export const getChannelInfo = async (
  userName: string
): Promise<ChannelInfo | null> => {
  const channels = await db
    .select()
    .from(channelInfoTable)
    .where(eq(channelInfoTable.userName, userName))
    .limit(1)

  if (!channels.length) return null

  return dbChannelToChannelInfo(channels[0])
}

export const setChannelInfo = async (
  channelInfo: Omit<ChannelInfo, "id">
): Promise<ChannelInfo> => {
  const newChannel: DBNewChannelInfo = {
    userName: channelInfo.userName,
    channelName: channelInfo.channelName,
    channelDescription: channelInfo.channelDescription,
    logoUrl: channelInfo.logoUrl,
    personalWebsite: channelInfo.personalWebsite,
    feedUrl: channelInfo.feedUrl,
    authorName: channelInfo.authorName,
    authorEmail: channelInfo.authorEmail,
    ownerName: channelInfo.ownerName,
    ownerEmail: channelInfo.ownerEmail,
    isExplicitContent: channelInfo.isExplicitContent,
    language: channelInfo.language
  }

  const [result] = await db
    .insert(channelInfoTable)
    .values(newChannel)
    .onConflictDoUpdate({
      target: channelInfoTable.userName,
      set: newChannel
    })
    .returning()

  return dbChannelToChannelInfo(result)
}

// Convert DB Episode to PodcastEpisode type
const dbEpisodeToEpisode = (dbEpisode: DBEpisode): PodcastEpisode => ({
  id: dbEpisode.id,
  title: dbEpisode.title,
  description: dbEpisode.description ?? "",
  url: dbEpisode.url,
  thumbnail: dbEpisode.thumbnail ?? "",
  tags: JSON.parse(dbEpisode.tags),
  createdAt: new Date(dbEpisode.createdAt),
  updatedAt: new Date(dbEpisode.updatedAt)
})

// Get all episodes
export const getEpisodes = async (): Promise<PodcastEpisode[]> => {
  const episodes = await db
    .select()
    .from(podcastEpisodesTable)
    .orderBy(podcastEpisodesTable.createdAt, "desc")
    .limit(100)

  return episodes.map(dbEpisodeToEpisode)
}

// Get episodes by channel ID
export const getEpisodesByChannel = async (
  channelId: number
): Promise<PodcastEpisode[]> => {
  const episodes = await db
    .select()
    .from(podcastEpisodesTable)
    .where(eq(podcastEpisodesTable.channelId, channelId))
    .orderBy(podcastEpisodesTable.createdAt, "desc")
    .limit(100)

  return episodes.map(dbEpisodeToEpisode)
}

// Add new episode
export const addEpisode = async (
  episodeData: Omit<PodcastEpisode, "id" | "createdAt" | "updatedAt"> & {
    channelId: number
  }
): Promise<PodcastEpisode> => {
  const newEpisode: DBNewEpisode = {
    title: episodeData.title,
    description: episodeData.description,
    url: episodeData.url,
    thumbnail: episodeData.thumbnail,
    tags: JSON.stringify(episodeData.tags),
    channelId: episodeData.channelId
  }

  const [result] = await db
    .insert(podcastEpisodesTable)
    .values(newEpisode)
    .returning()

  return dbEpisodeToEpisode(result)
}

// Update existing episode
export const updateEpisode = async (
  id: number,
  episodeData: Partial<Omit<PodcastEpisode, "id" | "createdAt" | "updatedAt">>
): Promise<PodcastEpisode> => {
  const updateData: Partial<DBNewEpisode> = {
    ...(episodeData.title && { title: episodeData.title }),
    ...(episodeData.description && { description: episodeData.description }),
    ...(episodeData.url && { url: episodeData.url }),
    ...(episodeData.thumbnail && { thumbnail: episodeData.thumbnail }),
    ...(episodeData.tags && { tags: JSON.stringify(episodeData.tags) }),
    updatedAt: new Date().toISOString()
  }

  const [result] = await db
    .update(podcastEpisodesTable)
    .set(updateData)
    .where(eq(podcastEpisodesTable.id, id))
    .returning()

  return dbEpisodeToEpisode(result)
}

// Delete episode
export const deleteEpisode = async (id: number): Promise<void> => {
  await db.delete(podcastEpisodesTable).where(eq(podcastEpisodesTable.id, id))
}

// Get episode by ID
export const getEpisodeById = async (
  id: number
): Promise<PodcastEpisode | null> => {
  const [episode] = await db
    .select()
    .from(podcastEpisodesTable)
    .where(eq(podcastEpisodesTable.id, id))
    .limit(1)

  if (!episode) return null

  return dbEpisodeToEpisode(episode)
}

// Get newly added episodes (limit to 5)
export const getNewlyAddedEpisodes = async (
  limit: number = 5
): Promise<PodcastEpisode[]> => {
  const episodes = await db
    .select()
    .from(podcastEpisodesTable)
    .orderBy(podcastEpisodesTable.createdAt, "desc")
    .limit(limit)

  return episodes.map(dbEpisodeToEpisode)
}

// Get recently updated episodes (limit to 5)
export const getRecentlyUpdatedEpisodes = async (
  limit: number = 5
): Promise<PodcastEpisode[]> => {
  const episodes = await db
    .select()
    .from(podcastEpisodesTable)
    .orderBy(podcastEpisodesTable.updatedAt, "desc")
    .limit(limit)

  return episodes.map(dbEpisodeToEpisode)
}

// Get tag statistics
export const getTagStatistics = async (): Promise<
  Array<{ name: string; count: number }>
> => {
  const episodes = await db.select().from(podcastEpisodesTable)

  const tagCounts: { [key: string]: number } = {}
  episodes.forEach((episode) => {
    const tags = JSON.parse(episode.tags)
    tags.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

// Get episodes by tag
export const getEpisodesByTag = async (
  tag: string
): Promise<PodcastEpisode[]> => {
  const episodes = await db.select().from(podcastEpisodesTable)

  return episodes
    .filter((episode) => {
      const tags = JSON.parse(episode.tags)
      return tags.includes(tag)
    })
    .map(dbEpisodeToEpisode)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}
