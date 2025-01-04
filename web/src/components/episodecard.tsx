import { useState } from "react"
import Link from "next/link"
import { PodcastEpisode } from "@/app/types/podcastepisode"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

interface EpisodeCardProps {
  episode: PodcastEpisode
  onEdit: (episode: PodcastEpisode) => void
  onDelete: (id: number) => void
}

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

export default function EpisodeCard({
  episode,
  onEdit,
  onDelete
}: EpisodeCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="border rounded-lg overflow-hidden shadow-sm flex flex-col transform transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/channel/${episode.id}`}>
        <img
          src={episode.thumbnail}
          alt={episode.title}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4 flex-grow flex flex-col">
        <h2 className="text-xl font-semibold mb-2">{episode.title}</h2>
        <p className="text-muted-foreground mb-4 flex-grow">
          {episode.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {episode.tags.map((tag, index) => (
            <span
              key={index}
              className={`${
                tagColors[index % tagColors.length]
              } text-white text-xs px-2 py-1 rounded-full`}
            >
              #{tag}
            </span>
          ))}
        </div>
        <audio controls className="w-full mb-4">
          <source src={episode.url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <div className="flex justify-between items-end mt-auto">
          <span className="text-sm text-muted-foreground">
            Created: {new Date(episode.createdAt).toLocaleString()}
          </span>
          <div
            className={`flex space-x-2 ${
              isHovered ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
          >
            <Button variant="outline" size="sm" onClick={() => onEdit(episode)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(episode.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
