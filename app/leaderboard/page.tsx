import type { Metadata } from "next"
import NavBar from "@/components/nav-bar"
import SpaceBackground from "@/components/space-background"
import Leaderboard from "@/components/leaderboard"

export const metadata: Metadata = {
  title: "Cosmic Leaderboard",
  description: "See how you rank against other cosmic decoders",
}

export default function LeaderboardPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <SpaceBackground />
      <NavBar />

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-12 relative z-10">
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-300">
            Galactic Leaderboard
          </h1>
          <Leaderboard />
        </div>
      </main>
    </div>
  )
}
