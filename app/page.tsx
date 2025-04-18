import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Rocket, Trophy, Users } from "lucide-react"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import SpaceBackground from "@/components/space-background"

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <SpaceBackground />
      <NavBar />

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-24 relative z-10">
        <div className="max-w-5xl w-full space-y-12 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-teal-300 to-blue-400 pb-2">
              Cosmic Word Puzzle
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto">
              Decode galactic transmissions, earn cosmic points, and ascend through the celestial ranks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <FeatureCard
              icon={<Rocket className="h-8 w-8 text-purple-400" />}
              title="Multiple Difficulty Levels"
              description="Challenge yourself with increasingly complex cosmic codes from Easy to Legendary"
            />
            <FeatureCard
              icon={<Trophy className="h-8 w-8 text-teal-400" />}
              title="Earn Cosmic Points"
              description="Gain points based on your performance and unlock new celestial ranks"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-blue-400" />}
              title="Compete Globally"
              description="See how you rank against other cosmic decoders on our galactic leaderboard"
            />
          </div>

          <div className="pt-8">
            <Link href="/game">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xl px-8 py-6 h-auto rounded-full shadow-lg shadow-purple-900/30 transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Begin Cosmic Journey
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gradient-to-br from-cosmic-dark/80 to-cosmic-blue/40 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 shadow-lg shadow-purple-900/30 transition-all duration-300 hover:scale-105 hover:shadow-purple-700/40">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-3 bg-cosmic-dark/50 rounded-full">{icon}</div>
        <h3 className="text-xl font-bold text-purple-200">{title}</h3>
        <p className="text-blue-200">{description}</p>
      </div>
    </div>
  )
}
