import Link from "next/link"
import { Github, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full py-6 px-4 md:px-8 border-t border-purple-500/20 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-blue-200 text-sm">
          © {new Date().getFullYear()} Cosmic Word Puzzle. All rights reserved.
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/privacy" className="text-blue-200 hover:text-white text-sm">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-blue-200 hover:text-white text-sm">
            Terms of Service
          </Link>
          <Link href="#" className="text-blue-200 hover:text-white">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="#" className="text-blue-200 hover:text-white">
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
