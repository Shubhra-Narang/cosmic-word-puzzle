import type { Metadata } from "next"
import WordPuzzleGame from "@/components/word-puzzle-game"
import NavBar from "@/components/nav-bar"
import SpaceBackground from "@/components/space-background"
import LevelLadder from "@/components/level-ladder"
import AuthCheck from "@/components/auth/auth-check"

export const metadata: Metadata = {
  title: "Play Cosmic Word Puzzle",
  description: "Decode galactic transmissions and earn cosmic points",
}

export default function GamePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <SpaceBackground />
      <NavBar />

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-12 relative z-10">
        <AuthCheck>
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <WordPuzzleGame />
            </div>
            <div className="lg:col-span-1">
              <LevelLadder />
            </div>
          </div>
        </AuthCheck>
      </main>
    </div>
  )
}
