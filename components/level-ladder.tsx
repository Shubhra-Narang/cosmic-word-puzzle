"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth"
import { getLevelInfo } from "@/lib/game-utils"

export default function LevelLadder() {
  const { user } = useAuth()

  // Default to level 1 if no user or points
  const totalPoints = user?.totalPoints || 0
  const { currentLevel, nextLevel, pointsForNextLevel, progress } = getLevelInfo(totalPoints)

  // Define all levels for display
  const levels = [
    { level: 5, title: "Cosmic Oracle", points: 5000, color: "from-purple-600 to-pink-600" },
    { level: 4, title: "Galactic Sage", points: 2000, color: "from-orange-600 to-amber-600" },
    { level: 3, title: "Star Navigator", points: 1000, color: "from-blue-600 to-cyan-600" },
    { level: 2, title: "Nebula Explorer", points: 500, color: "from-teal-600 to-green-600" },
    { level: 1, title: "Space Cadet", points: 0, color: "from-indigo-600 to-purple-600" },
  ]

  return (
    <Card className="bg-gradient-to-br from-cosmic-dark/80 to-cosmic-blue/40 backdrop-blur-sm border border-purple-500/30 shadow-lg shadow-purple-900/30 h-full">
      <CardHeader className="py-3">
        <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-teal-200">
          <span className="font-press-start">Cosmic Rank</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 py-2">
        {/* Current level info */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-blue-200">
              <span className="font-press-start">Level {currentLevel}</span>
            </h3>
            <span className="text-sm text-blue-300">{totalPoints} points</span>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-md shadow-inner shadow-purple-900/50">
            <div className="text-center">
              <div className="text-lg font-bold">
                {levels.find((l) => l.level === currentLevel)?.title || "Space Cadet"}
              </div>
              <div className="text-xs opacity-80">
                {currentLevel < 5
                  ? `${pointsForNextLevel - totalPoints} points to next level`
                  : "Maximum level reached"}
              </div>
            </div>
          </div>

          {currentLevel < 5 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-blue-300">
                <span>Level {currentLevel}</span>
                <span>Level {nextLevel}</span>
              </div>
              <Progress
                value={progress}
                className="h-2 bg-cosmic-dark/60"
                indicatorClassName="bg-gradient-to-r from-purple-600 to-teal-600"
              />
            </div>
          )}
        </div>

        {/* Level ladder */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-blue-200">
            <span className="font-press-start">Cosmic Ladder</span>
          </h3>

          <div className="space-y-1">
            {levels.map((level) => (
              <div
                key={level.level}
                className={`p-1.5 rounded-md border ${
                  currentLevel === level.level
                    ? "border-purple-500 glow"
                    : currentLevel > level.level
                      ? "border-purple-500/50"
                      : "border-purple-500/20"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br ${level.color}`}
                    >
                      {level.level}
                    </div>
                    <span
                      className={`font-medium text-sm ${
                        currentLevel === level.level
                          ? "text-white"
                          : currentLevel > level.level
                            ? "text-blue-200"
                            : "text-blue-300/50"
                      }`}
                    >
                      {level.title}
                    </span>
                  </div>
                  <span className={`text-xs ${currentLevel >= level.level ? "text-blue-300" : "text-blue-300/50"}`}>
                    {level.points}+ pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
