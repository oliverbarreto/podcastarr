"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"
import {
  getEpisodes,
  addEpisode,
  updateEpisode,
  deleteEpisode,
  getUserInfo
} from "@/lib/db"
import { PodcastEpisode, UserInfo } from "@/app/types/podcasts"
import EpisodeCard from "@/components/episodecard"

const tagColors = [
  "bg-pink-500",
  "bg-purple-500",
  "bg-indigo-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-orange-500"
]

export default function Home() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingEpisode, setEditingEpisode] = useState<PodcastEpisode | null>(
    null
  )
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  const filteredEpisodes =
    selectedTags.length === 0
      ? episodes
      : episodes.filter((episode) =>
          episode.tags.some((tag) => selectedTags.includes(tag))
        )

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedEpisodes, fetchedUserInfo] = await Promise.all([
        getEpisodes(),
        getUserInfo()
      ])
      setEpisodes(fetchedEpisodes)
      const tags = Array.from(
        new Set(fetchedEpisodes.flatMap((episode) => episode.tags))
      )
      setAllTags(tags)
      setUserInfo(fetchedUserInfo || null)
    }
    fetchData()
  }, [])

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

    try {
      if (editingEpisode) {
        const updatedEpisode = await updateEpisode(
          editingEpisode.id,
          episodeData
        )
        setEpisodes((prevEpisodes) =>
          prevEpisodes.map((ep) =>
            ep.id === updatedEpisode.id ? updatedEpisode : ep
          )
        )
        setEditingEpisode(null)
      } else {
        const newEpisode = await addEpisode(episodeData)
        setEpisodes((prevEpisodes) => [...prevEpisodes, newEpisode])
        updateAllTags([...episodes, newEpisode])
      }
      setIsOpen(false)
    } catch (error) {
      console.error("Error submitting episode:", error)
    }
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

  const updateAllTags = (updatedEpisodes: PodcastEpisode[]) => {
    const tags = Array.from(
      new Set(updatedEpisodes.flatMap((episode) => episode.tags))
    )
    setAllTags(tags)
  }

  return (
    <main className="container max-w-5xl mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">
          {userInfo?.channelName ||
            `Welcome ${userInfo?.userName} to your Personal Podcast Channel`}
        </h1>
        <p className="text-xl text-muted-foreground">
          {userInfo?.channelDescription || "Discover the latest episodes"}
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Podcast Episodes</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Episode
            </Button>
          </DialogTrigger>
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

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Episodes</h2>
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
      </section>
    </main>
  )
}
