"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getEpisodes } from "@/lib/db"
import { PodcastEpisode } from "@/app/types/podcasts"

export default function EpisodeDetails() {
  const { episodeId } = useParams()
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null)

  useEffect(() => {
    const fetchEpisode = async () => {
      const episodes = await getEpisodes()
      const foundEpisode = episodes.find((ep) => ep.id === Number(episodeId))
      setEpisode(foundEpisode || null)
    }
    if (episodeId) {
      fetchEpisode()
    }
  }, [episodeId])

  if (!episode) {
    return <div>Loading...</div>
  }

  return (
    <main className="container mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">{episode.title}</h1>
        <p className="text-xl text-muted-foreground">{episode.description}</p>
      </div>
      <div className="flex flex-col items-center">
        <img
          src={episode.thumbnail}
          alt={episode.title}
          className="w-1/2 rounded-lg mb-4"
        />
        <div className="w-1/2">
          <audio controls className="w-full mb-4">
            <source src={episode.url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <h2 className="text-2xl font-semibold mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2 justify-start">
            {episode.tags.map((tag, index) => (
              <span key={index} className="bg-gray-200 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
