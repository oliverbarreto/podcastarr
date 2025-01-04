import Link from "next/link"
import Image from "next/image"
import { PodcastEpisode } from "@/app/types/podcastepisode"

interface EpisodeCardCompactProps {
  episode: PodcastEpisode
}

const EpisodeCardCompact = ({ episode }: EpisodeCardCompactProps) => {
  return (
    <Link
      href={`/episode/${episode.id}`}
      className="group block rounded-lg overflow-hidden border bg-card hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-video relative">
        <Image
          src={episode.thumbnail}
          alt={episode.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary">
          {episode.title}
        </h3>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {episode.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <time className="text-xs text-muted-foreground">
          {new Date(episode.createdAt).toLocaleDateString()}
        </time>
      </div>
    </Link>
  )
}

export default EpisodeCardCompact
