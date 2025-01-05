"use server"

import { ChannelInfo } from "@/app/types/channelinfo"

import { getChannelInfo, setChannelInfo } from "@/lib/db/db"

export async function getCurrentChannel(
  userName: string = "defaultuser"
): Promise<ChannelInfo | null> {
  try {
    return await getChannelInfo(userName)
  } catch (error) {
    console.error("Error fetching channel:", error)
    return null
  }
}

export async function updateChannel(formData: FormData) {
  const values = Object.fromEntries(formData.entries())

  const channelInfo: Omit<ChannelInfo, "id"> = {
    userName: "defaultuser", // We'll handle auth later
    channelName: (values.channelName as string) || "",
    channelDescription: (values.channelDescription as string) || "",
    logoUrl: (values.logoUrl as string) || "",
    personalWebsite: (values.personalWebsite as string) || "",
    feedUrl: (values.feedUrl as string) || "",
    authorName: (values.authorName as string) || "",
    authorEmail: (values.authorEmail as string) || "",
    ownerName: (values.ownerName as string) || "",
    ownerEmail: (values.ownerEmail as string) || "",
    isExplicitContent: values.isExplicitContent ? 1 : 0,
    language: (values.language as string) || "en"
  }

  try {
    const updatedChannel = await setChannelInfo(channelInfo)
    return { success: true, data: updatedChannel }
  } catch (error) {
    console.error("Error updating channel:", error)
    return { success: false, error: error }
  }
}
