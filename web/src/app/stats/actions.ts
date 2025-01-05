"use server"

import { getEpisodes, getTagStatistics, getEpisodesByTag } from "@/lib/db/db"
import type { PodcastEpisode } from "@/app/types/podcastepisode"

export async function getStatsData(): Promise<{
  episodes: PodcastEpisode[]
  tagStats: Array<{ name: string; count: number }>
}> {
  try {
    const [episodes, tagStats] = await Promise.all([
      getEpisodes(),
      getTagStatistics()
    ])

    return {
      episodes,
      tagStats: tagStats.map((stat) => ({
        ...stat,
        fill: "#8884d8" // default color
      }))
    }
  } catch (error) {
    console.error("Error fetching stats data:", error)
    return {
      episodes: [],
      tagStats: []
    }
  }
}

export async function getFilteredEpisodes(
  tag: string
): Promise<PodcastEpisode[]> {
  try {
    return await getEpisodesByTag(tag)
  } catch (error) {
    console.error("Error fetching filtered episodes:", error)
    return []
  }
}
