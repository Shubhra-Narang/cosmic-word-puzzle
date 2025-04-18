"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface DifficultySelectorProps {
  currentDifficulty: "easy" | "medium" | "hard" | "legendary"
  onSelect: (difficulty: "easy" | "medium" | "hard" | "legendary") => void
  onClose: () => void
}

export default function DifficultySelector({ currentDifficulty, onSelect, onClose }: DifficultySelectorProps) {
  const difficulties = [
    {
      value: "easy",
      label: "Easy",
      description: "5-letter words, 6 attempts",
      color: "green",
      points: "10-50 points",
    },
    {
      value: "medium",
      label: "Medium",
      description: "6-letter words, 6 attempts",
      color: "blue",
      points: "20-80 points",
    },
    {
      value: "hard",
      label: "Hard",
      description: "7-letter words, 5 attempts",
      color: "purple",
      points: "40-120 points",
    },
    {
      value: "legendary",
      label: "Legendary",
      description: "8-letter words, 5 attempts",
      color: "orange",
      points: "60-180 points",
    },
  ]

  return (
    <Card className="absolute top-16 right-4 z-50 w-64 bg-gradient-to-br from-cosmic-dark/95 to-cosmic-blue/95 backdrop-blur-md border border-purple-500/30 shadow-lg shadow-purple-900/30">
      <div className="flex justify-between items-center p-2 border-b border-purple-500/30">
        <h3 className="text-sm font-medium text-blue-200">Select Difficulty</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-200" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-2">
        <div className="space-y-2">
          {difficulties.map((difficulty) => (
            <Button
              key={difficulty.value}
              variant="ghost"
              className={`w-full justify-start text-left flex flex-col items-start p-2 h-auto ${
                currentDifficulty === difficulty.value
                  ? `bg-${difficulty.color}-900/30 text-${difficulty.color}-200`
                  : "text-blue-200 hover:bg-purple-900/20"
              }`}
              onClick={() => onSelect(difficulty.value as any)}
            >
              <span className="font-medium">{difficulty.label}</span>
              <span className="text-xs opacity-80">{difficulty.description}</span>
              <span className="text-xs opacity-80">{difficulty.points}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
