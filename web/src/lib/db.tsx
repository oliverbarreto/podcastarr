import { PodcastEpisode } from "@/app/types/podcastepisode"
import { UserInfo } from "@/app/types/user"

// Mock storage
let storage: {
  episodes: PodcastEpisode[]
  userInfo: UserInfo | null
} = {
  episodes: [],
  userInfo: null
}

// Helper function to save storage to localStorage (only works in browser)
const saveStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("podcast-app-storage", JSON.stringify(storage))
  }
}

// Helper function to load storage from localStorage (only works in browser)
const loadStorage = () => {
  if (typeof window !== "undefined") {
    const savedStorage = localStorage.getItem("podcast-app-storage")
    if (savedStorage) {
      storage = JSON.parse(savedStorage)
    }
  }
}

// Load storage when module is imported
loadStorage()

export async function getEpisodes(): Promise<PodcastEpisode[]> {
  return storage.episodes
}

export async function addEpisode(
  episode: Omit<PodcastEpisode, "id" | "createdAt" | "updatedAt">
): Promise<PodcastEpisode> {
  const now = new Date()
  const newEpisode: PodcastEpisode = {
    id: Date.now(),
    ...episode,
    createdAt: now,
    updatedAt: now
  }
  storage.episodes.push(newEpisode)
  saveStorage()
  return newEpisode
}

export async function updateEpisode(
  id: number,
  episode: Omit<PodcastEpisode, "id" | "createdAt" | "updatedAt">
): Promise<PodcastEpisode> {
  const index = storage.episodes.findIndex((ep) => ep.id === id)
  if (index === -1) {
    throw new Error("Episode not found")
  }
  const updatedEpisode: PodcastEpisode = {
    ...storage.episodes[index],
    ...episode,
    updatedAt: new Date()
  }
  storage.episodes[index] = updatedEpisode
  saveStorage()
  return updatedEpisode
}

export async function deleteEpisode(id: number): Promise<void> {
  storage.episodes = storage.episodes.filter((ep) => ep.id !== id)
  saveStorage()
}

export async function getUserInfo(): Promise<UserInfo | undefined> {
  return storage.userInfo || undefined
}

export const setUserInfo = async (
  userInfo: Omit<UserInfo, "id">
): Promise<UserInfo> => {
  // Implementation remains the same
  // Make sure the function returns a Promise<UserInfo>
  if (storage.userInfo) {
    storage.userInfo = { ...storage.userInfo, ...userInfo }
  } else {
    storage.userInfo = { id: Date.now(), ...userInfo }
  }
  saveStorage()
  return storage.userInfo
}
