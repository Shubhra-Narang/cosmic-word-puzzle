"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Gamepad2, Trophy, User, LogIn, LogOut, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth"

export default function NavBar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4 mr-2" /> },
    { href: "/game", label: "Play", icon: <Gamepad2 className="h-4 w-4 mr-2" /> },
    { href: "/leaderboard", label: "Leaderboard", icon: <Trophy className="h-4 w-4 mr-2" /> },
  ]

  if (user) {
    navItems.push({ href: "/profile", label: "Profile", icon: <User className="h-4 w-4 mr-2" /> })
  }

  return (
    <header className="w-full py-4 px-4 md:px-8 relative z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-300 font-press-start">
            Cosmic Puzzle
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "text-blue-200 hover:text-white hover:bg-purple-900/20",
                  pathname === item.href && "bg-purple-900/30 text-white",
                )}
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}

          {user ? (
            <Button
              variant="ghost"
              className="text-blue-200 hover:text-white hover:bg-purple-900/20"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className={cn(
                  "text-blue-200 hover:text-white hover:bg-purple-900/20",
                  pathname === "/auth/login" && "bg-purple-900/30 text-white",
                )}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden text-blue-200" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-cosmic-dark/95 to-cosmic-blue/95 backdrop-blur-md border-t border-purple-500/30 p-4 space-y-2 shadow-lg z-50">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={closeMenu}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-blue-200 hover:text-white hover:bg-purple-900/20",
                  pathname === item.href && "bg-purple-900/30 text-white",
                )}
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}

          {user ? (
            <Button
              variant="ghost"
              className="w-full justify-start text-blue-200 hover:text-white hover:bg-purple-900/20"
              onClick={() => {
                logout()
                closeMenu()
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Link href="/auth/login" onClick={closeMenu}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-blue-200 hover:text-white hover:bg-purple-900/20",
                  pathname === "/auth/login" && "bg-purple-900/30 text-white",
                )}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
