"use client"

import { useState } from "react"
import EpisodeCardCompact from "@/components/episodecardcompact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import type { PodcastEpisode } from "@/app/types/podcastepisode"
import type { ChannelInfo } from "@/app/types/channelinfo"
import { useUser } from "@/context/UserContext"

export default function Home() {
  const { channelInfo } = useUser()
  const [newlyAdded, setNewlyAdded] = useState<PodcastEpisode[]>([])
  const [recentlyUpdated, setRecentlyUpdated] = useState<PodcastEpisode[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingEpisode, setEditingEpisode] = useState<PodcastEpisode | null>(
    null
  )

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
        <h2 className="text-2xl font-semibold mb-4">Newly Added</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {newlyAdded.map((episode) => (
            <EpisodeCardCompact key={episode.id} episode={episode} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Recently Updated</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {recentlyUpdated.map((episode) => (
            <EpisodeCardCompact key={episode.id} episode={episode} />
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
          <form className="grid gap-4 py-4">
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
          </form>
          <DialogFooter>
            <Button type="submit">
              {editingEpisode ? "Update" : "Add"} Episode
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
