import { PodcastEpisode } from "@/app/types/podcastepisode"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface EpisodeCardCompactProps {
  episode: PodcastEpisode
  className?: string
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
const EpisodeCardCompact = ({
  episode,
  className
}: EpisodeCardCompactProps) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-sm flex flex-col transform transition-transform duration-300 hover:scale-105">
      <Card>
        <div className="relative aspect-square">
          <Link href={`/channel/${episode.id}`}>
            <img
              src={episode.thumbnail || "/placeholder-image.jpg"}
              alt={episode.title}
              className="w-full h-48 object-cover"
            />
          </Link>
        </div>
        <div className="p-2">
          <h3 className="font-medium line-clamp-1 text-sm">{episode.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {episode.description}
          </p>
          <div className="flex flex-wrap gap-2 py-3">
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
        </div>
      </Card>
    </div>
  )
}

export default EpisodeCardCompact
