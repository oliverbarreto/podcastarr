import { eq } from "drizzle-orm"
import db from "@/lib/db/drizzle"

import {
  channelInfoTable,
  // episodesTable,
  type DBChannelInfo,
  type NewDBChannelInfo
} from "./schema"

import type { ChannelInfo } from "@/app/types/channelinfo"
// import type { PodcastEpisode } from "@/app/types/podcastepisode"

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
  const newChannel: NewDBChannelInfo = {
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
