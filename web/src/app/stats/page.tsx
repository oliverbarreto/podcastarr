"use client"

import { useState, useEffect } from "react"
import { getEpisodes, updateEpisode, deleteEpisode } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts"
import EpisodeCard from "@/components/episodecard"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type PodcastEpisode = {
  id: number
  title: string
  description: string
  url: string
  thumbnail: string
  tags: string[]
  createdAt: Date
}

type TagStat = {
  name: string
  count: number
  fill?: string
}

export default function StatsPage() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
  const [tagStats, setTagStats] = useState<TagStat[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [filteredEpisodes, setFilteredEpisodes] = useState<PodcastEpisode[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingEpisode, setEditingEpisode] = useState<PodcastEpisode | null>(
    null
  )

  useEffect(() => {
    const fetchEpisodes = async () => {
      const result = await getEpisodes()
      setEpisodes(result)

      const tagCounts: { [key: string]: number } = {}
      result.forEach((episode) => {
        episode.tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
      })

      const sortedTagStats = Object.entries(tagCounts)
        .map(([name, count]) => ({
          name,
          count,
          fill: "#8884d8" // default color
        }))
        .sort((a, b) => b.count - a.count)

      setTagStats(sortedTagStats)
    }
    fetchEpisodes()
  }, [])

  useEffect(() => {
    if (selectedTag) {
      const filtered = episodes
        .filter((episode) => episode.tags.includes(selectedTag))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      setFilteredEpisodes(filtered)
    } else {
      setFilteredEpisodes([])
    }
  }, [selectedTag, episodes])

  const handleClick = (data: any, index: number) => {
    const newData = [...tagStats]
    const clickedTag = data.name

    if (selectedTag === clickedTag) {
      // If clicking the same tag, reset all colors
      newData.forEach((item) => {
        item.fill = "#8884d8"
      })
      setSelectedTag(null)
    } else {
      // Set all bars to default color except the clicked one
      newData.forEach((item) => {
        item.fill = item.name === clickedTag ? "#6D28D9" : "#8884d8"
      })
      setSelectedTag(clickedTag)
    }

    setTagStats(newData)
  }

  const handleEdit = (episode: PodcastEpisode) => {
    setEditingEpisode(episode)
    setIsOpen(true)
  }

  const handleDelete = async (id: number) => {
    await deleteEpisode(id)
    setEpisodes((prevEpisodes) => {
      const updatedEpisodes = prevEpisodes.filter((ep) => ep.id !== id)
      updateAllTags(updatedEpisodes)
      return updatedEpisodes
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const episodeData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      url: formData.get("url") as string,
      thumbnail: formData.get("thumbnail") as string,
      tags: (formData.get("tags") as string).split(",").map((tag) => tag.trim())
    }

    if (editingEpisode) {
      const updatedEpisode = await updateEpisode(editingEpisode.id, episodeData)
      setEpisodes((prevEpisodes) =>
        prevEpisodes.map((ep) =>
          ep.id === updatedEpisode.id ? updatedEpisode : ep
        )
      )
      setEditingEpisode(null)
    }
    setIsOpen(false)
    updateAllTags([...episodes, episodeData])
  }

  const updateAllTags = (updatedEpisodes: PodcastEpisode[]) => {
    const tags = Array.from(
      new Set(updatedEpisodes.flatMap((episode) => episode.tags))
    )
    setTagStats(
      tags.map((tag) => ({
        name: tag,
        count: tagStats.find((t) => t.name === tag)?.count || 0,
        fill: "#8884d8"
      }))
    )
  }

  const clearFilter = () => {
    setSelectedTag(null)
    setFilteredEpisodes([])
    setTagStats((prevTagStats) =>
      prevTagStats.map((tagStat) => ({ ...tagStat, fill: "#8884d8" }))
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
                  {/* <CartesianGrid strokeDasharray="3 3" />
                <YAxis />
                <Tooltip />
                <Legend /> */}
                  <Bar
                    dataKey="count"
                    fill="#6D28D9"
                    onClick={handleClick}
                    cursor="pointer"
                  >
                    {tagStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill || "#8884d8"}
                      />
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
                  <EpisodeCard
                    key={episode.id}
                    episode={episode}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEpisode ? "Edit Episode" : "Add New Episode"}
            </DialogTitle>
            <DialogDescription>
              {editingEpisode
                ? "Edit the details of your podcast episode."
                : "Fill in the details for your new podcast episode."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingEpisode?.title}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingEpisode?.description}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  Audio URL
                </Label>
                <Input
                  id="url"
                  name="url"
                  defaultValue={editingEpisode?.url}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="thumbnail" className="text-right">
                  Thumbnail
                </Label>
                <Input
                  id="thumbnail"
                  name="thumbnail"
                  defaultValue={editingEpisode?.thumbnail}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">
                  Tags
                </Label>
                <Input
                  id="tags"
                  name="tags"
                  defaultValue={editingEpisode?.tags.join(", ")}
                  className="col-span-3"
                  placeholder="Separate tags with commas"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {editingEpisode ? "Update" : "Add"} Episode
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
