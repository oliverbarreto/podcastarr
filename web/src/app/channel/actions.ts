"use server"

import {
  getEpisodes,
  addEpisode,
  updateEpisode,
  deleteEpisode
} from "@/lib/db/db"
import type { PodcastEpisode } from "@/app/types/podcastepisode"

export async function getAllEpisodes(): Promise<PodcastEpisode[]> {
  try {
    return await getEpisodes()
  } catch (error) {
    console.error("Error fetching episodes:", error)
    return []
  }
}

export async function createEpisode(formData: FormData) {
  const values = Object.fromEntries(formData.entries())

  const episodeData = {
    title: values.title as string,
    description: values.description as string,
    url: values.url as string,
    thumbnail: values.thumbnail as string,
    tags: (values.tags as string).split(",").map((tag) => tag.trim()),
    channelId: 1 // We'll handle this properly with auth later
  }

  try {
    const newEpisode = await addEpisode(episodeData)
    return { success: true, data: newEpisode }
  } catch (error) {
    console.error("Error creating episode:", error)
    return { success: false, error }
  }
}

export async function editEpisode(id: number, formData: FormData) {
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

export async function removeEpisode(id: number) {
  try {
    await deleteEpisode(id)
    return { success: true }
  } catch (error) {
    console.error("Error deleting episode:", error)
    return { success: false, error }
  }
}
