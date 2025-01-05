"use server"

import type { PodcastEpisode } from "@/app/types/podcastepisode"

import { getNewlyAddedEpisodes, getRecentlyUpdatedEpisodes } from "@/lib/db/db"

export async function getLatestEpisodes(): Promise<{
  newlyAdded: PodcastEpisode[]
  recentlyUpdated: PodcastEpisode[]
}> {
  try {
    const [newlyAdded, recentlyUpdated] = await Promise.all([
      getNewlyAddedEpisodes(),
      getRecentlyUpdatedEpisodes()
    ])

    return {
      newlyAdded,
      recentlyUpdated
    }
  } catch (error) {
    console.error("Error fetching latest episodes:", error)
    return {
      newlyAdded: [],
      recentlyUpdated: []
    }
  }
}
