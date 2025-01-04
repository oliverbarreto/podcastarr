"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { UserInfo } from "@/app/types/user"
import { getUserInfo, getEpisodes } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Mic,
  Mail,
  Globe,
  User,
  Info,
  AlertTriangle,
  BarChart
} from "lucide-react"
import { PodcastEpisode } from "@/app/types/podcastepisode"

export default function PublicProfilePage() {
  const { username } = useParams()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const [info, episodesData] = await Promise.all([
          getUserInfo(),
          getEpisodes()
        ])
        if (
          info &&
          info.userName.replace(/\s+/g, "").toLowerCase() === username
        ) {
          setUserInfo(info)
          setEpisodes(episodesData)
        }
      } catch (error) {
        console.error("Error fetching user info:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserInfo()
  }, [username])

  const getEpisodeStats = () => {
    if (episodes.length === 0) return null

    const sortedEpisodes = [...episodes].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    return {
      total: episodes.length,
      firstEpisode: sortedEpisodes[0].createdAt,
      lastEpisode: sortedEpisodes[sortedEpisodes.length - 1].createdAt
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!userInfo) {
    return (
      <div className="container max-w-3xl mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">
            Profile Not Found
          </h1>
          <p className="text-muted-foreground mt-2">
            The requested profile does not exist.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl mx-auto py-10">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-muted shrink-0">
            {userInfo.logoUrl ? (
              <img
                src={userInfo.logoUrl}
                alt={userInfo.channelName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold flex items-center gap-2 justify-center md:justify-start">
              <Mic className="w-8 h-8" />
              {userInfo.channelName}
            </h1>
            <p className="text-muted-foreground mt-2">
              {userInfo.channelDescription}
            </p>
          </div>
        </div>

        {/* Channel Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Channel Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Channel Name</h3>
                <p className="text-sm">{userInfo.channelName}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {userInfo.channelDescription}
                </p>
              </div>
            </div>
            {userInfo.personalWebsite && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <a
                  href={userInfo.personalWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {userInfo.personalWebsite}
                </a>
              </div>
            )}
            {userInfo.isExplicitContent && (
              <div className="flex items-center gap-2 text-yellow-500">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">
                  This channel may contain explicit content
                </span>
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              Language: {userInfo.language.toUpperCase()}
            </div>
          </CardContent>
        </Card>

        {/* Author Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Author</h3>
                <div className="space-y-2 text-sm">
                  <p>{userInfo.authorName}</p>
                  <p className="text-muted-foreground">
                    {userInfo.authorEmail}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Owner</h3>
                <div className="space-y-2 text-sm">
                  <p>{userInfo.ownerName}</p>
                  <p className="text-muted-foreground">{userInfo.ownerEmail}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feed Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Podcast Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <a
                href={userInfo.feedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {userInfo.feedUrl}
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Channel Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Channel Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {episodes.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h3 className="text-sm font-medium mb-1">Total Episodes</h3>
                  <p className="text-2xl font-bold">{episodes.length}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">First Episode</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(episodes[0]?.createdAt)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Latest Episode</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(episodes[episodes.length - 1]?.createdAt)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No episodes published yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
