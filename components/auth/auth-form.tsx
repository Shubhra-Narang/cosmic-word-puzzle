"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"
import { Rocket, LogIn } from "lucide-react"

interface AuthFormProps {
  mode: "login" | "signup"
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { login, signup } = useAuth()

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === "signup") {
        // Validate form
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Passwords don't match",
            description: "Please make sure your passwords match.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        // Sign up
        await signup(formData.username, formData.email, formData.password)
        toast({
          title: "Account created!",
          description: "Welcome to Cosmic Word Puzzle!",
        })
      } else {
        // Log in
        await login(formData.email, formData.password)
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        })
      }

      // Redirect to game
      router.push("/game")
    } catch (error) {
      toast({
        title: "Authentication error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-cosmic-dark/80 to-cosmic-blue/40 backdrop-blur-sm border border-purple-500/30 shadow-lg shadow-purple-900/30">
      <CardHeader>
        <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-teal-200 flex items-center">
          {mode === "login" ? (
            <>
              <LogIn className="h-5 w-5 mr-2 text-purple-400" />
              Login to Your Account
            </>
          ) : (
            <>
              <Rocket className="h-5 w-5 mr-2 text-purple-400" />
              Create Your Cosmic Account
            </>
          )}
        </CardTitle>
        <CardDescription className="text-blue-200">
          {mode === "login"
            ? "Enter your credentials to access your cosmic journey"
            : "Join the cosmic community and start your galactic adventure"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="username" className="text-blue-200">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="CosmicExplorer"
                value={formData.username}
                onChange={handleChange}
                required
                className="bg-cosmic-dark/60 border-purple-500/30 text-blue-100"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-blue-200">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="cosmic@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-cosmic-dark/60 border-purple-500/30 text-blue-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-blue-200">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-cosmic-dark/60 border-purple-500/30 text-blue-100"
            />
          </div>

          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-blue-200">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="bg-cosmic-dark/60 border-purple-500/30 text-blue-100"
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {mode === "login" ? "Logging in..." : "Creating account..."}
              </span>
            ) : (
              <span>{mode === "login" ? "Login" : "Create Account"}</span>
            )}
          </Button>

          <div className="text-center text-sm text-blue-200">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-purple-300 hover:text-purple-200">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/auth/login" className="text-purple-300 hover:text-purple-200">
                  Log in
                </Link>
              </>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
