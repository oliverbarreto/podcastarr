"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type { UserInfo } from "@/app/types/user"

interface UserContextType {
  userInfo: UserInfo | null
  updateUserInfo: (info: UserInfo) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const defaultUserInfo: UserInfo = {
  id: 0,
  userName: "defaultuser",
  channelName: "",
  channelDescription: "",
  logoUrl: "",
  personalWebsite: "",
  feedUrl: "",
  authorName: "",
  authorEmail: "",
  ownerName: "",
  ownerEmail: "",
  isExplicitContent: false,
  language: "en"
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching user data
    // In a real app, this would be an API call
    const initializeUser = async () => {
      try {
        // For now, just use default values
        setUserInfo(defaultUserInfo)
      } catch (error) {
        console.error("Error initializing user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeUser()
  }, [])

  const updateUserInfo = (info: UserInfo) => {
    setUserInfo(info)
  }

  if (isLoading) {
    return null // Or a loading spinner component
  }

  return (
    <UserContext.Provider value={{ userInfo, updateUserInfo }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
