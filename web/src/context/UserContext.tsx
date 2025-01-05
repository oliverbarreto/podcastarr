"use client"

import { createContext, useContext, useState } from "react"
import type { ChannelInfo } from "@/app/types/channelinfo"

interface UserContextType {
  channelInfo: ChannelInfo | null
  updateChannelInfo: (info: ChannelInfo) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null)

  const updateChannelInfo = (info: ChannelInfo) => {
    setChannelInfo(info)
  }

  return (
    <UserContext.Provider value={{ channelInfo, updateChannelInfo }}>
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
