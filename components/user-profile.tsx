"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Rocket, Target, Award, Zap } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { getLevelInfo } from "@/lib/game-utils"

export default function UserProfile() {
  const { user } = useAuth()

  if (!user) {
    return <div className="text-center text-blue-200">Please log in to view your profile.</div>
  }

  const { currentLevel, nextLevel, pointsForNextLevel, progress } = getLevelInfo(user.totalPoints || 0)

  // Calculate stats
  const totalGames = user.gamesPlayed || 0
  const gamesWon = user.gamesWon || 0
  const winRate = totalGames > 0 ? Math.round((gamesWon / totalGames) * 100) : 0

  // Calculate achievements
  const achievements = [
    {
      id: "first_win",
      title: "First Contact",
      description: "Win your first game",
      icon: <Rocket className="h-5 w-5" />,
      unlocked: gamesWon >= 1,
      progress: Math.min(gamesWon, 1),
      total: 1,
    },
    {
      id: "win_streak",
      title: "Cosmic Streak",
      description: "Win 5 games in a row",
      icon: <Zap className="h-5 w-5" />,
      unlocked: (user.maxStreak || 0) >= 5,
      progress: Math.min(user.maxStreak || 0, 5),
      total: 5,
    },
    {
      id: "legendary_win",
      title: "Legendary Decoder",
      description: "Win a game on Legendary difficulty",
      icon: <Award className="h-5 w-5" />,
      unlocked: (user.legendaryGamesWon || 0) >= 1,
      progress: Math.min(user.legendaryGamesWon || 0, 1),
      total: 1,
    },
    {
      id: "perfect_game",
      title: "Perfect Transmission",
      description: "Win a game in just one attempt",
      icon: <Target className="h-5 w-5" />,
      unlocked: (user.perfectGames || 0) >= 1,
      progress: Math.min(user.perfectGames || 0, 1),
      total: 1,
    },
    {
      id: "master",
      title: "Cosmic Master",
      description: "Reach level 5",
      icon: <Star className="h-5 w-5" />,
      unlocked: currentLevel >= 5,
      progress: currentLevel,
      total: 5,
    },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-300">
        Cosmic Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1 bg-gradient-to-br from-cosmic-dark/80 to-cosmic-blue/40 backdrop-blur-sm border border-purple-500/30 shadow-lg shadow-purple-900/30">
          <CardHeader>
            <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-teal-200">
              {user.username || "Cosmic Explorer"}
            </CardTitle>
            <CardDescription className="text-blue-200">
              Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Level */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-blue-200">Level {currentLevel}</h3>
                <span className="text-sm text-blue-300">{user.totalPoints || 0} points</span>
              </div>

              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-md shadow-inner shadow-purple-900/50">
                <div className="text-center">
                  <div className="text-xl font-bold">{getLevelTitle(currentLevel)}</div>
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
                  <div className="text-xs text-center text-blue-300">
                    {pointsForNextLevel - (user.totalPoints || 0)} points to next level
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <StatCard
                icon={<Trophy className="h-4 w-4 text-yellow-400" />}
                value={user.totalPoints || 0}
                label="Points"
              />
              <StatCard icon={<Star className="h-4 w-4 text-purple-400" />} value={gamesWon} label="Wins" />
              <StatCard icon={<Rocket className="h-4 w-4 text-blue-400" />} value={totalGames} label="Games" />
              <StatCard icon={<Target className="h-4 w-4 text-teal-400" />} value={`${winRate}%`} label="Win Rate" />
            </div>
          </CardContent>
        </Card>

        {/* Stats and Achievements */}
        <Card className="md:col-span-2 bg-gradient-to-br from-cosmic-dark/80 to-cosmic-blue/40 backdrop-blur-sm border border-purple-500/30 shadow-lg shadow-purple-900/30">
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid grid-cols-2 bg-cosmic-dark/60 border-b border-purple-500/30">
              <TabsTrigger value="stats" className="data-[state=active]:bg-purple-900/30">
                <Trophy className="h-4 w-4 mr-2" />
                Statistics
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-900/30">
                <Award className="h-4 w-4 mr-2" />
                Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="p-6 space-y-6">
              <h3 className="text-xl font-bold text-blue-200">Game Statistics</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-blue-200">By Difficulty</h4>
                  <div className="space-y-2">
                    <DifficultyStatRow
                      label="Easy"
                      played={user.easyGamesPlayed || 0}
                      won={user.easyGamesWon || 0}
                      color="green"
                    />
                    <DifficultyStatRow
                      label="Medium"
                      played={user.mediumGamesPlayed || 0}
                      won={user.mediumGamesWon || 0}
                      color="blue"
                    />
                    <DifficultyStatRow
                      label="Hard"
                      played={user.hardGamesPlayed || 0}
                      won={user.hardGamesWon || 0}
                      color="purple"
                    />
                    <DifficultyStatRow
                      label="Legendary"
                      played={user.legendaryGamesPlayed || 0}
                      won={user.legendaryGamesWon || 0}
                      color="orange"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-blue-200">Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-200">Best Streak</span>
                      <span className="font-medium text-blue-100">{user.maxStreak || 0} games</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Current Streak</span>
                      <span className="font-medium text-blue-100">{user.currentStreak || 0} games</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Average Attempts</span>
                      <span className="font-medium text-blue-100">
                        {totalGames > 0 ? ((user.totalAttempts || 0) / totalGames).toFixed(1) : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Perfect Games</span>
                      <span className="font-medium text-blue-100">{user.perfectGames || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Hints Used</span>
                      <span className="font-medium text-blue-100">{user.hintsUsed || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="p-6">
              <h3 className="text-xl font-bold text-blue-200 mb-4">Cosmic Achievements</h3>

              <div className="grid grid-cols-1 gap-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-md border ${
                      achievement.unlocked
                        ? "border-purple-500 bg-purple-900/20"
                        : "border-purple-500/20 bg-cosmic-dark/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          achievement.unlocked ? "bg-gradient-to-br from-purple-600 to-indigo-600" : "bg-cosmic-dark/60"
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`font-medium ${achievement.unlocked ? "text-purple-200" : "text-blue-300"}`}>
                              {achievement.title}
                            </h4>
                            <p className="text-xs text-blue-300">{achievement.description}</p>
                          </div>
                          {achievement.unlocked && (
                            <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                              Unlocked
                            </Badge>
                          )}
                        </div>

                        {!achievement.unlocked && (
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-xs text-blue-300">
                              <span>Progress</span>
                              <span>
                                {achievement.progress} / {achievement.total}
                              </span>
                            </div>
                            <Progress
                              value={(achievement.progress / achievement.total) * 100}
                              className="h-1.5 bg-cosmic-dark/60"
                              indicatorClassName="bg-gradient-to-r from-purple-600/50 to-indigo-600/50"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) {
  return (
    <div className="bg-cosmic-dark/40 border border-purple-500/20 rounded-md p-3 flex flex-col items-center justify-center">
      <div className="flex items-center mb-1">{icon}</div>
      <div className="text-lg font-bold text-blue-100">{value}</div>
      <div className="text-xs text-blue-300">{label}</div>
    </div>
  )
}

function DifficultyStatRow({
  label,
  played,
  won,
  color,
}: { label: string; played: number; won: number; color: string }) {
  const winRate = played > 0 ? Math.round((won / played) * 100) : 0

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className={`text-${color}-400`}>{label}</span>
        <span className="text-blue-200">
          {won} / {played} ({winRate}%)
        </span>
      </div>
      <Progress value={winRate} className="h-2 bg-cosmic-dark/60" indicatorClassName={`bg-${color}-600`} />
    </div>
  )
}

function getLevelTitle(level: number): string {
  switch (level) {
    case 1:
      return "Space Cadet"
    case 2:
      return "Nebula Explorer"
    case 3:
      return "Star Navigator"
    case 4:
      return "Galactic Sage"
    case 5:
      return "Cosmic Oracle"
    default:
      return "Space Cadet"
  }
}
