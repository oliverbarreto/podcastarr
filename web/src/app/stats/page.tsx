"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, Cell, ResponsiveContainer } from "recharts"
import EpisodeCard from "@/components/episodecard"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { getStatsData, getFilteredEpisodes } from "./actions"
import type { PodcastEpisode } from "@/app/types/podcastepisode"

type TagStat = {
  name: string
  count: number
  fill: string
}

export default function StatsPage() {
  const { toast } = useToast()
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
  const [tagStats, setTagStats] = useState<TagStat[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [filteredEpisodes, setFilteredEpisodes] = useState<PodcastEpisode[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getStatsData()
        setEpisodes(data.episodes)
        setTagStats(data.tagStats)
      } catch (error) {
        toast({
          title: `Error fetching stats data: ${error}`,
          description: "Failed to load statistics",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadStats()
  }, [toast])

  const handleClick = async (data: any) => {
    const clickedTag = data.name

    if (selectedTag === clickedTag) {
      // Reset selection
      setTagStats((prev) => prev.map((tag) => ({ ...tag, fill: "#8884d8" })))
      setSelectedTag(null)
      setFilteredEpisodes([])
    } else {
      // Update selection
      try {
        const filtered = await getFilteredEpisodes(clickedTag)
        setFilteredEpisodes(filtered)
        setTagStats((prev) =>
          prev.map((tag) => ({
            ...tag,
            fill: tag.name === clickedTag ? "#6D28D9" : "#8884d8"
          }))
        )
        setSelectedTag(clickedTag)
      } catch (error) {
        toast({
          title: `Error fetching stats data: ${error}`,
          description: "Failed to load filtered episodes",
          variant: "destructive"
        })
      }
    }
  }

  const clearFilter = () => {
    setSelectedTag(null)
    setFilteredEpisodes([])
    setTagStats((prev) => prev.map((tag) => ({ ...tag, fill: "#8884d8" })))
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading statistics...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-row justify-between items-start">
        <h1 className="p-3 text-3xl font-bold mb-6">Podcast Statistics</h1>
        {selectedTag && filteredEpisodes.length > 0 && (
          <Button onClick={clearFilter}>Clear Filter</Button>
        )}
      </div>

      <div className="grid grid-cols-2 p-3 md:grid-cols-3 gap-6 mb-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Episodes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{episodes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{tagStats.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="p-3">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              Tag Distribution {selectedTag && `- Selected: ${selectedTag}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[150px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tagStats}>
                  <XAxis dataKey="name" />
                  <Bar
                    dataKey="count"
                    fill="#6D28D9"
                    onClick={handleClick}
                    cursor="pointer"
                  >
                    {tagStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedTag && filteredEpisodes.length > 0 && (
        <div className="p-3">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div className="flex flex-col md:flex-row md:items-center">
                <CardTitle>Episodes with tag: {selectedTag}</CardTitle>
                <p className="text-sm text-muted-foreground md:ml-4">
                  Found {filteredEpisodes.length} episode
                  {filteredEpisodes.length !== 1 ? "s" : ""}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredEpisodes.map((episode) => (
                  <EpisodeCard key={episode.id} episode={episode} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
