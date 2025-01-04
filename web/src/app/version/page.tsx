import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mic, Headphones, Share2 } from "lucide-react"

export default function VersionPage() {
  return (
    <main>
      <section className="py-20 text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to PodcastApp</h1>
        <p className="text-xl mb-8">
          Manage and share your podcast episodes with ease
        </p>
        <Button asChild>
          <Link href="/channel">Get Started</Link>
        </Button>
      </section>

      <section className="py-20 bg-muted">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Mic className="h-12 w-12" />}
              title="Easy Recording"
              description="Record your episodes directly in the app"
            />
            <FeatureCard
              icon={<Headphones className="h-12 w-12" />}
              title="Listener Analytics"
              description="Get insights into your audience"
            />
            <FeatureCard
              icon={<Share2 className="h-12 w-12" />}
              title="Simple Sharing"
              description="Share your episodes across platforms"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  )
}
