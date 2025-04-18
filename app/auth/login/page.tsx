import type { Metadata } from "next"
import NavBar from "@/components/nav-bar"
import SpaceBackground from "@/components/space-background"
import AuthForm from "@/components/auth/auth-form"

export const metadata: Metadata = {
  title: "Login to Cosmic Word Puzzle",
  description: "Access your cosmic account",
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <SpaceBackground />
      <NavBar />

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-12 relative z-10">
        <div className="w-full max-w-md mx-auto">
          <AuthForm mode="login" />
        </div>
      </main>
    </div>
  )
}
