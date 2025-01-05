import { eq } from "drizzle-orm"
import db from "@/lib/db/drizzle"
import { usersTable, type DBNewUser, type DBUser } from "@/lib/db/schema"
import { UserInfo } from "@/app/types/user"

// Convert DB type to UserInfo type
const dbUserToUserInfo = (dbUser: DBUser): UserInfo => ({
  id: dbUser.id,
  userName: dbUser.userName,
  channelName: dbUser.channelName ?? "",
  channelDescription: dbUser.channelDescription ?? "",
  logoUrl: dbUser.logoUrl ?? "",
  personalWebsite: dbUser.personalWebsite ?? "",
  feedUrl: dbUser.feedUrl ?? "",
  authorName: dbUser.authorName ?? "",
  authorEmail: dbUser.authorEmail ?? "",
  ownerName: dbUser.ownerName ?? "",
  ownerEmail: dbUser.ownerEmail ?? "",
  isExplicitContent: dbUser.is_explicit_content ?? false,
  language: dbUser.language ?? "en"
})

export const getUserInfo = async (
  userName: string
): Promise<UserInfo | null> => {
  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.userName, userName))
    .limit(1)

  if (!users.length) return null

  return dbUserToUserInfo(users[0])
}

export const setUserInfo = async (
  userInfo: Omit<UserInfo, "id">
): Promise<UserInfo> => {
  const newUser: DBNewUser = {
    userName: userInfo.userName,
    channelName: userInfo.channelName,
    channelDescription: userInfo.channelDescription,
    logoUrl: userInfo.logoUrl,
    personalWebsite: userInfo.personalWebsite,
    feedUrl: userInfo.feedUrl,
    authorName: userInfo.authorName,
    authorEmail: userInfo.authorEmail,
    ownerName: userInfo.ownerName,
    ownerEmail: userInfo.ownerEmail,
    isExplicitContent: userInfo.isExplicitContent,
    language: userInfo.language
  }

  const result = await db
    .insert(usersTable)
    .values(newUser)
    .onConflictDoUpdate({
      target: usersTable.userName,
      set: newUser
    })
    .returning()

  return dbUserToUserInfo(result[0])
}
