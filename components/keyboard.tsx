"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface KeyboardProps {
  onKeyPress: (key: string) => void
  guesses: string[]
  solution: string
}

export default function Keyboard({ onKeyPress, guesses, solution }: KeyboardProps) {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ]

  // Track letter statuses based on previous guesses
  const letterStatuses: Record<string, string> = {}

  guesses.forEach((guess) => {
    guess.split("").forEach((letter, i) => {
      // Don't downgrade a letter's status
      if (letterStatuses[letter] === "correct") return

      if (letter === solution[i]) {
        letterStatuses[letter] = "correct"
      } else if (solution.includes(letter) && letterStatuses[letter] !== "present") {
        letterStatuses[letter] = "present"
      } else if (!letterStatuses[letter]) {
        letterStatuses[letter] = "absent"
      }
    })
  })

  return (
    <div className="w-full space-y-1">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1">
          {row.map((key) => {
            const status = letterStatuses[key] || ""

            return (
              <Button
                key={key}
                onClick={() => onKeyPress(key)}
                className={cn(
                  "h-8 px-1 text-xs font-medium border border-purple-500/30 bg-cosmic-dark/60",
                  key === "ENTER" && "text-xs px-1 flex-grow-0 w-14",
                  key === "BACKSPACE" && "text-xs px-1 flex-grow-0 w-14",
                  status === "correct" &&
                    "bg-gradient-to-br from-teal-600 to-teal-800 text-white border-teal-400/50 hover:from-teal-700 hover:to-teal-900",
                  status === "present" &&
                    "bg-gradient-to-br from-purple-600 to-purple-800 text-white border-purple-400/50 hover:from-purple-700 hover:to-purple-900",
                  status === "absent" &&
                    "bg-gradient-to-br from-gray-700 to-gray-900 text-gray-400 border-gray-600/30 hover:from-gray-800 hover:to-gray-950",
                  "transform hover:scale-105 transition-all active:scale-95",
                )}
                variant="outline"
              >
                {key === "BACKSPACE" ? "⌫" : key}
              </Button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
