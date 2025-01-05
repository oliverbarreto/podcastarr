"use client"

import { useEffect } from "react"
import { useState } from "react"

// import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select"
import {
  User,
  Link as LinkIcon,
  Podcast,
  Info,
  Mail,
  Globe
} from "lucide-react"

import { useUser } from "@/context/UserContext"

import { getCurrentChannel, updateChannel } from "./actions"

export default function ProfilePage() {
  const { toast } = useToast()
  const { channelInfo, updateChannelInfo } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true

    const loadChannel = async () => {
      try {
        const channel = await getCurrentChannel()
        if (mounted && channel) {
          updateChannelInfo(channel)
        }
      } catch (error) {
        if (mounted) {
          toast({
            title: `Error ${error}`,
            description: "Failed to load channel information",
            variant: "destructive"
          })
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    if (isLoading) {
      loadChannel()
    }

    return () => {
      mounted = false
    }
  }, [isLoading, toast, updateChannelInfo])

  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">
              Loading channel information...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-5xl mx-auto py-10">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Podcast className="w-8 h-8" />
          Podcast Channel Information
        </h1>
        <p className="text-muted-foreground mt-2 py-4">
          Configure your podcast channel settings and information. This info
          will be used and visible by the podcast app.
        </p>
      </div>

      <form
        action={async (formData) => {
          if (isSubmitting) return
          setIsSubmitting(true)
          try {
            const result = await updateChannel(formData)
            if (result.success && result.data) {
              updateChannelInfo(result.data)
              toast({
                title: "Success",
                description: "Channel information updated successfully"
              })
            } else {
              toast({
                title: "Error",
                description: "Failed to update channel information",
                variant: "destructive"
              })
            }
          } finally {
            setIsSubmitting(false)
          }
        }}
        className="space-y-8"
      >
        {/* Channel Information Section */}
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Channel Information</h2>
          </div>
          <div className="grid gap-4 pl-7">
            <div>
              <Label htmlFor="channelName">Channel Name</Label>
              <Input
                id="channelName"
                name="channelName"
                defaultValue={channelInfo?.channelName}
                placeholder="My Awesome Podcast"
              />
            </div>
            <div>
              <Label htmlFor="channelDescription">Description</Label>
              <Textarea
                id="channelDescription"
                name="channelDescription"
                defaultValue={channelInfo?.channelDescription}
                placeholder="Tell us about your podcast..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="personalWebsite">Personal Website</Label>
              <Input
                id="personalWebsite"
                name="personalWebsite"
                defaultValue={channelInfo?.personalWebsite}
                placeholder="http://your-website.com"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isExplicitContent"
                name="isExplicitContent"
                defaultChecked={channelInfo?.isExplicitContent === 1}
              />
              <Label htmlFor="isExplicitContent">
                The channel episodes might contain explicit content
              </Label>
            </div>
          </div>
        </div>

        {/* Channel Image Section */}
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Channel Image</h2>
          </div>
          <div className="grid gap-4 pl-7">
            <div className="flex-1">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                defaultValue={channelInfo?.logoUrl}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="flex justify-center">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                {channelInfo?.logoUrl ? (
                  <img
                    src={channelInfo.logoUrl}
                    alt="Channel Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Author Information Section */}
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Author Information</h2>
          </div>
          <div className="grid gap-4 pl-7">
            <div>
              <Label htmlFor="authorName">Author Name</Label>
              <Input
                id="authorName"
                name="authorName"
                defaultValue={channelInfo?.authorName}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="authorEmail">Author Email</Label>
              <Input
                id="authorEmail"
                name="authorEmail"
                type="email"
                defaultValue={channelInfo?.authorEmail}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                name="ownerName"
                defaultValue={channelInfo?.ownerName}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <Label htmlFor="ownerEmail">Owner Email</Label>
              <Input
                id="ownerEmail"
                name="ownerEmail"
                type="email"
                defaultValue={channelInfo?.ownerEmail}
                placeholder="jane@example.com"
              />
            </div>
          </div>
        </div>

        {/* Feed Information Section */}
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Feed Information</h2>
          </div>
          <div className="grid gap-4 pl-7">
            <div>
              <Label htmlFor="feedUrl">Podcast Feed URL</Label>
              <Input
                id="feedUrl"
                name="feedUrl"
                defaultValue={channelInfo?.feedUrl}
                placeholder="https://example.com/feed.xml"
              />
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                name="language"
                defaultValue={channelInfo?.language || "en"}
              >
                <SelectTrigger id="language" className="w-full bg-background">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Available Languages</SelectLabel>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 py-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </div>
  )
}
