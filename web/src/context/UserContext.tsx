"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react"
import { UserInfo } from "@/app/types/podcasts"
import { getUserInfo } from "@/lib/db"

interface UserContextType {
  userInfo: UserInfo | null
  updateUserInfo: (info: UserInfo) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  useEffect(() => {
    const loadUserInfo = async () => {
      const info = await getUserInfo()
      setUserInfo(info || null)
    }
    loadUserInfo()
  }, [])

  const updateUserInfo = (info: UserInfo) => {
    setUserInfo(info)
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
