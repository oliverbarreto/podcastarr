"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mic, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/UserContext"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navbar() {
  const router = useRouter()
  const { userInfo } = useUser()

  const handleProfileClick = () => {
    router.push("/profile")
  }

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="flex items-center">
          <Mic className="h-6 w-6 mr-2" />
          <span className="font-bold">PodcastARR</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Link
            href="/channel"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Channel
          </Link>
          <Link
            href="/stats"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Stats
          </Link>
          <ThemeToggle />
          <Button
            onClick={handleProfileClick}
            className="rounded-full p-0 w-8 h-8 overflow-hidden"
          >
            {userInfo?.logoUrl ? (
              <img
                src={userInfo.logoUrl}
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  )
}
