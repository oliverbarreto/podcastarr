"use client"

import { useState, useEffect } from "react"
import {
  getEpisodes,
  getUserInfo,
  updateEpisode,
  deleteEpisode
} from "@/lib/db"
import { PodcastEpisode, UserInfo } from "@/app/types/podcasts"
import EpisodeCard from "@/components/episodecard"
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

export default function Home() {
  const [newlyAdded, setNewlyAdded] = useState<PodcastEpisode[]>([])
  const [recentlyUpdated, setRecentlyUpdated] = useState<PodcastEpisode[]>([])
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingEpisode, setEditingEpisode] = useState<PodcastEpisode | null>(
    null
  )

  useEffect(() => {
    const fetchData = async () => {
      const [episodes, userInfo] = await Promise.all([
        getEpisodes(),
        getUserInfo()
      ])
      setUserInfo(userInfo || null)
      setEpisodes(episodes)

      const sortedByCreatedAt = [...episodes].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      const sortedByUpdatedAt = [...episodes].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      setNewlyAdded(sortedByCreatedAt.slice(0, 5))
      setRecentlyUpdated(
        sortedByUpdatedAt
          .filter(
            (episode) =>
              new Date(episode.updatedAt).getTime() >
              new Date(episode.createdAt).getTime()
          )
          .slice(0, 5)
      )
    }
    fetchData()
  }, [])

  const handleEdit = (episode: PodcastEpisode) => {
    setEditingEpisode(episode)
    setIsOpen(true)
  }

  const handleDelete = async (id: number) => {
    await deleteEpisode(id)
    setEpisodes((prevEpisodes) => {
      const updatedEpisodes = prevEpisodes.filter((ep) => ep.id !== id)
      return updatedEpisodes
    })
    setNewlyAdded((prevEpisodes) => prevEpisodes.filter((ep) => ep.id !== id))
    setRecentlyUpdated((prevEpisodes) =>
      prevEpisodes.filter((ep) => ep.id !== id)
    )
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
      const sortedByCreatedAt = [...episodes]
        .map((ep) => (ep.id === updatedEpisode.id ? updatedEpisode : ep))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      const sortedByUpdatedAt = [...episodes]
        .map((ep) => (ep.id === updatedEpisode.id ? updatedEpisode : ep))
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
      setNewlyAdded(sortedByCreatedAt.slice(0, 5))
      setRecentlyUpdated(
        sortedByUpdatedAt
          .filter(
            (episode) =>
              new Date(episode.updatedAt).getTime() >
              new Date(episode.createdAt).getTime()
          )
          .slice(0, 5)
      )
      setEditingEpisode(null)
    }
    setIsOpen(false)
  }

  return (
    <main className="container mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">
          {userInfo?.channelName ||
            `Welcome ${userInfo?.userName} to your Personal Podcast Channel`}
        </h1>
        <p className="text-xl text-muted-foreground">
          {userInfo?.channelDescription || "Discover the latest episodes"}
        </p>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Newly Added</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {newlyAdded.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Recently Updated</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {recentlyUpdated.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </section>

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
    </main>
  )
}
