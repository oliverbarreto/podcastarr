import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"

import { UserProvider } from "@/context/UserContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PodcastARR | Your personal podcast platform",
  description: "Your personal podcast platform",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        href: "/favicon.svg"
      }
    ]
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
