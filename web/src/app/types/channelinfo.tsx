export type ChannelInfo = {
  id: number
  userName: string
  channelName: string
  channelDescription: string
  logoUrl: string
  personalWebsite: string
  feedUrl: string
  authorName: string
  authorEmail: string
  ownerName: string
  ownerEmail: string
  isExplicitContent: number // Changed from boolean to number for SQLite compatibility
  language: string
}
