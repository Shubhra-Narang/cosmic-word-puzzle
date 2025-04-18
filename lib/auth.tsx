"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// User type definition
interface User {
  id?: string
  username?: string
  email?: string
  totalPoints?: number
  gamesPlayed?: number
  gamesWon?: number
  currentStreak?: number
  maxStreak?: number
  hintsUsed?: number
  totalAttempts?: number
  perfectGames?: number
  easyGamesPlayed?: number
  easyGamesWon?: number
  mediumGamesPlayed?: number
  mediumGamesWon?: number
  hardGamesPlayed?: number
  hardGamesWon?: number
  legendaryGamesPlayed?: number
  legendaryGamesWon?: number
  createdAt?: number
  [key: string]: any
}

// Auth context
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUserData: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user database - in a real app, this would be a database
const MOCK_USERS = [
  {
    id: "1",
    username: "CosmicPlayer",
    email: "cosmic@example.com",
    password: "password123", // In a real app, this would be hashed
    totalPoints: 350,
    gamesPlayed: 15,
    gamesWon: 10,
    currentStreak: 2,
    maxStreak: 5,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
  },
]

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("cosmicUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find user
    const foundUser = MOCK_USERS.find((u) => u.email === email && u.password === password)
    if (!foundUser) {
      throw new Error("Invalid email or password")
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = foundUser

    // Set user and store in localStorage
    setUser(userWithoutPassword)
    localStorage.setItem("cosmicUser", JSON.stringify(userWithoutPassword))
  }

  // Signup function
  const signup = async (username: string, email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    if (MOCK_USERS.some((u) => u.email === email)) {
      throw new Error("User with this email already exists")
    }

    // Create new user
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      username,
      email,
      password,
      totalPoints: 0,
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      createdAt: Date.now(),
    }

    // Add to mock database
    MOCK_USERS.push(newUser)

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = newUser

    // Set user and store in localStorage
    setUser(userWithoutPassword)
    localStorage.setItem("cosmicUser", JSON.stringify(userWithoutPassword))
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("cosmicUser")
  }

  // Update user data - improved to ensure leaderboard updates
  const updateUserData = (data: Partial<User>) => {
    if (!user) return

    // Create updated user with new data
    const updatedUser = { ...user, ...data }

    // Update current streak and max streak if needed
    if (data.gamesWon && data.gamesWon > user.gamesWon) {
      updatedUser.currentStreak = (user.currentStreak || 0) + 1
      updatedUser.maxStreak = Math.max(updatedUser.currentStreak, user.maxStreak || 0)
    } else if (data.gamesPlayed && data.gamesPlayed > user.gamesPlayed && !data.gamesWon) {
      // Reset streak on loss
      updatedUser.currentStreak = 0
    }

    // Update in mock database for leaderboard
    const userIndex = MOCK_USERS.findIndex((u) => u.id === user.id)
    if (userIndex >= 0) {
      // Preserve password in mock database
      const password = MOCK_USERS[userIndex].password
      MOCK_USERS[userIndex] = { ...updatedUser, password }
    }

    // Update state and localStorage
    setUser(updatedUser)
    localStorage.setItem("cosmicUser", JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
