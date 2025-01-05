"use server"

import type { PodcastEpisode } from "@/app/types/podcastepisode"

import { getEpisodeById, updateEpisode, deleteEpisode } from "@/lib/db/db"

export async function getEpisode(id: number): Promise<{
  success: boolean
  data?: PodcastEpisode
  error?: unknown
}> {
  try {
    const episode = await getEpisodeById(id)
    if (!episode) {
      return { success: false, error: "Episode not found" }
    }
    return { success: true, data: episode }
  } catch (error) {
    console.error("Error fetching episode:", error)
    return { success: false, error }
  }
}

export async function updateEpisodeDetails(id: number, formData: FormData) {
  const values = Object.fromEntries(formData.entries())

  const episodeData = {
    title: values.title as string,
    description: values.description as string,
    url: values.url as string,
    thumbnail: values.thumbnail as string,
    tags: (values.tags as string).split(",").map((tag) => tag.trim())
  }

  try {
    const updatedEpisode = await updateEpisode(id, episodeData)
    return { success: true, data: updatedEpisode }
  } catch (error) {
    console.error("Error updating episode:", error)
    return { success: false, error }
  }
}

export async function removeEpisodeById(id: number) {
  try {
    await deleteEpisode(id)
    return { success: true }
  } catch (error) {
    console.error("Error deleting episode:", error)
    return { success: false, error }
  }
}
