"use server"

import { getUserInfo, setUserInfo } from "@/lib/db/db"
import { UserInfo } from "@/app/types/user"

export async function getCurrentUser(
  userName: string = "defaultuser"
): Promise<UserInfo | null> {
  try {
    return await getUserInfo(userName)
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function updateUser(data: FormData) {
  const values = Object.fromEntries(data.entries())

  const userInfo: Omit<UserInfo, "id"> = {
    userName: (values.userName as string) || "defaultuser",
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
    return await setUserInfo(userInfo)
  } catch (error) {
    console.error("Error updating user:", error)
    throw new Error("Failed to update user information")
  }
}
