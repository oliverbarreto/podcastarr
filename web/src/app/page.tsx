"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import EpisodeCardCompact from "@/components/episodecardcompact"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/context/UserContext"
import { getLatestEpisodes } from "./actions"
import type { PodcastEpisode } from "@/app/types/podcastepisode"

export default function Home() {
  const router = useRouter()
  const { toast } = useToast()
  const { channelInfo } = useUser()
  const [newlyAdded, setNewlyAdded] = useState<PodcastEpisode[]>([])
  const [recentlyUpdated, setRecentlyUpdated] = useState<PodcastEpisode[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadEpisodes = async () => {
      try {
        const episodes = await getLatestEpisodes()
        setNewlyAdded(episodes.newlyAdded)
        setRecentlyUpdated(episodes.recentlyUpdated)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load episodes",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadEpisodes()
  }, [toast])

  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading episodes...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="container max-w-5xl mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">
          {channelInfo?.channelName ||
            `Welcome ${channelInfo?.userName} to your Personal Podcast Channel`}
        </h1>
        <p className="text-xl text-muted-foreground">
          {channelInfo?.channelDescription || "Discover the latest episodes"}
        </p>
      </div>

      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Newly Added</h2>
          {newlyAdded.length > 0 && (
            <button
              onClick={() => router.push("/channel")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              View all
            </button>
          )}
        </div>
        {newlyAdded.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {newlyAdded.map((episode) => (
              <EpisodeCardCompact
                key={episode.id}
                episode={episode}
                onClick={() => router.push(`/channel/${episode.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No episodes found
          </div>
        )}
      </section>

      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recently Updated</h2>
          {recentlyUpdated.length > 0 && (
            <button
              onClick={() => router.push("/channel")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              View all
            </button>
          )}
        </div>
        {recentlyUpdated.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recentlyUpdated.map((episode) => (
              <EpisodeCardCompact
                key={episode.id}
                episode={episode}
                onClick={() => router.push(`/channel/${episode.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No episodes found
          </div>
        )}
      </section>
    </main>
  )
}
