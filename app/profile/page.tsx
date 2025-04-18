import type { Metadata } from "next"
import NavBar from "@/components/nav-bar"
import SpaceBackground from "@/components/space-background"
import UserProfile from "@/components/user-profile"
import AuthCheck from "@/components/auth/auth-check"

export const metadata: Metadata = {
  title: "Cosmic Profile",
  description: "View your cosmic achievements and progress",
}

export default function ProfilePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <SpaceBackground />
      <NavBar />

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-12 relative z-10">
        <AuthCheck>
          <UserProfile />
        </AuthCheck>
      </main>
    </div>
  )
}
