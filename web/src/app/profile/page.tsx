"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
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

import { setUserInfo } from "@/lib/db"
import { UserInfo } from "../types/user"
import { useUser } from "@/context/UserContext"

export default function ProfilePage() {
  const { userInfo, updateUserInfo } = useUser()
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    if (!userInfo) return

    const updatedUserInfo: Omit<UserInfo, "id"> = {
      userName: userInfo.userName,
      channelName: formData.get("channelName") as string,
      channelDescription: formData.get("channelDescription") as string,
      logoUrl: formData.get("logoUrl") as string,
      personalWebsite: formData.get("personalWebsite") as string,
      feedUrl: formData.get("feedUrl") as string,
      authorName: formData.get("authorName") as string,
      authorEmail: formData.get("authorEmail") as string,
      ownerName: formData.get("ownerName") as string,
      ownerEmail: formData.get("ownerEmail") as string,
      isExplicitContent: formData.get("isExplicitContent") === "on",
      language: formData.get("language") as string
    }

    try {
      const savedUserInfo = await setUserInfo(updatedUserInfo)
      updateUserInfo(savedUserInfo)
      toast({
        title: "Profile updated",
        description: "Your profile information has been successfully updated."
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile information.",
        variant: "destructive"
      })
    }
  }

  if (!userInfo) {
    return (
      <div className="container max-w-3xl mx-auto py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">
              Loading profile information...
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

      <form onSubmit={handleSubmit} className="space-y-8">
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
                defaultValue={userInfo.channelName}
              />
            </div>
            <div>
              <Label htmlFor="channelDescription">Description</Label>
              <Textarea
                id="channelDescription"
                name="channelDescription"
                defaultValue={userInfo.channelDescription}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="personalWebsite">Personal Website</Label>
              <Input
                id="personalWebsite"
                name="personalWebsite"
                defaultValue={userInfo.personalWebsite}
                placeholder="http://your-website.com"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isExplicitContent"
                name="isExplicitContent"
                defaultChecked={userInfo.isExplicitContent}
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
                defaultValue={userInfo.logoUrl}
                placeholder="https://example.com/logo.png"
              />
            </div>{" "}
            <div className="flex justify-center">
              <div className="w-40 h-40 rounded-full overflow-hidden">
                {userInfo.logoUrl ? (
                  <img
                    src={userInfo.logoUrl}
                    alt="Channel Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
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
                defaultValue={userInfo.authorName}
              />
            </div>
            <div>
              <Label htmlFor="authorEmail">Author Email</Label>
              <Input
                id="authorEmail"
                name="authorEmail"
                type="email"
                defaultValue={userInfo.authorEmail}
              />
            </div>
            <div>
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                name="ownerName"
                defaultValue={userInfo.ownerName}
              />
            </div>
            <div>
              <Label htmlFor="ownerEmail">Owner Email</Label>
              <Input
                id="ownerEmail"
                name="ownerEmail"
                type="email"
                defaultValue={userInfo.ownerEmail}
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
                defaultValue={userInfo.feedUrl}
                placeholder="https://example.com/feed.xml"
              />
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select defaultValue={userInfo.language || "en"} name="language">
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
          <Button type="submit">Update Profile</Button>
        </div>
      </form>
    </div>
  )
}
