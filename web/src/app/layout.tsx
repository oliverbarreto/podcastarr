import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
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
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <UserProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              {children}
              <Toaster />
            </ThemeProvider>
          </UserProvider>
        </body>
      </html>
    </>
  )
}
