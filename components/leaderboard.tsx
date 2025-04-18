"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Star } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { getLevelInfo } from "@/lib/game-utils"

// Mock leaderboard data - in a real app, this would come from a database
const MOCK_LEADERBOARD = [
  { id: "1", username: "CosmicMaster", totalPoints: 4850, gamesWon: 120, level: 4 },
  { id: "2", username: "StarGazer", totalPoints: 3200, gamesWon: 85, level: 4 },
  { id: "3", username: "GalacticQueen", totalPoints: 2800, gamesWon: 72, level: 4 },
  { id: "4", username: "NebulaNinja", totalPoints: 2100, gamesWon: 65, level: 4 },
  { id: "5", username: "CosmicCoder", totalPoints: 1950, gamesWon: 58, level: 3 },
  { id: "6", username: "AstralWanderer", totalPoints: 1700, gamesWon: 52, level: 3 },
  { id: "7", username: "VoidVoyager", totalPoints: 1500, gamesWon: 45, level: 3 },
  { id: "8", username: "PlanetaryPioneer", totalPoints: 1200, gamesWon: 40, level: 3 },
  { id: "9", username: "StellarSage", totalPoints: 900, gamesWon: 35, level: 2 },
  { id: "10", username: "MoonMystic", totalPoints: 750, gamesWon: 30, level: 2 },
]

export default function Leaderboard() {
  const { user } = useAuth()
  const [leaderboardData, setLeaderboardData] = useState(MOCK_LEADERBOARD)
  const [userRank, setUserRank] = useState<number | null>(null)

  // Update leaderboard when user points change
  useEffect(() => {
    // Simulate adding the current user to the leaderboard
    if (user?.username && user?.totalPoints !== undefined) {
      const newLeaderboard = [...MOCK_LEADERBOARD]

      // Check if user is already in the leaderboard
      const existingUserIndex = newLeaderboard.findIndex((entry) => entry.username === user.username)
      if (existingUserIndex >= 0) {
        newLeaderboard[existingUserIndex] = {
          ...newLeaderboard[existingUserIndex],
          totalPoints: user.totalPoints,
          gamesWon: user.gamesWon || 0,
          level: getLevelInfo(user.totalPoints).currentLevel,
        }
      } else {
        // Add user to leaderboard
        newLeaderboard.push({
          id: user.id || "user",
          username: user.username,
          totalPoints: user.totalPoints,
          gamesWon: user.gamesWon || 0,
          level: getLevelInfo(user.totalPoints).currentLevel,
        })
      }

      // Sort by points
      newLeaderboard.sort((a, b) => b.totalPoints - a.totalPoints)

      // Find user rank
      const rank = newLeaderboard.findIndex((entry) => entry.username === user.username) + 1
      setUserRank(rank)

      // Take top 10
      setLeaderboardData(newLeaderboard.slice(0, 10))
    }
  }, [user?.username, user?.totalPoints, user?.gamesWon, user?.id])

  return (
    <Card className="bg-gradient-to-br from-cosmic-dark/80 to-cosmic-blue/40 backdrop-blur-sm border border-purple-500/30 shadow-lg shadow-purple-900/30">
      <Tabs defaultValue="points" className="w-full">
        <TabsList className="grid grid-cols-2 bg-cosmic-dark/60 border-b border-purple-500/30">
          <TabsTrigger value="points" className="data-[state=active]:bg-purple-900/30">
            <Trophy className="h-4 w-4 mr-2" />
            <span className="font-press-start">Points</span>
          </TabsTrigger>
          <TabsTrigger value="wins" className="data-[state=active]:bg-purple-900/30">
            <Medal className="h-4 w-4 mr-2" />
            <span className="font-press-start">Wins</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="points" className="m-0">
          <LeaderboardTable
            data={leaderboardData}
            sortKey="totalPoints"
            valueLabel="Points"
            currentUser={user?.username}
            userRank={userRank}
          />
        </TabsContent>

        <TabsContent value="wins" className="m-0">
          <LeaderboardTable
            data={leaderboardData}
            sortKey="gamesWon"
            valueLabel="Wins"
            currentUser={user?.username}
            userRank={userRank}
          />
        </TabsContent>
      </Tabs>
    </Card>
  )
}

interface LeaderboardTableProps {
  data: Array<{
    id: string
    username: string
    totalPoints: number
    gamesWon: number
    level: number
  }>
  sortKey: "totalPoints" | "gamesWon"
  valueLabel: string
  currentUser?: string
  userRank?: number | null
}

function LeaderboardTable({ data, sortKey, valueLabel, currentUser, userRank }: LeaderboardTableProps) {
  // Sort data by the specified key
  const sortedData = [...data].sort((a, b) => b[sortKey] - a[sortKey])

  const user = useAuth().user

  return (
    <CardContent className="p-0">
      <div className="relative">
        <table className="w-full">
          <thead>
            <tr className="border-b border-purple-500/30">
              <th className="p-2 text-left text-xs font-medium text-blue-200 uppercase tracking-wider w-12">
                <span className="font-press-start">Rank</span>
              </th>
              <th className="p-2 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                <span className="font-press-start">Player</span>
              </th>
              <th className="p-2 text-right text-xs font-medium text-blue-200 uppercase tracking-wider">
                <span className="font-press-start">{valueLabel}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((entry, index) => (
              <tr
                key={entry.id}
                className={`border-b border-purple-500/10 ${
                  entry.username === currentUser
                    ? "bg-purple-900/30"
                    : index % 2 === 0
                      ? "bg-cosmic-dark/40"
                      : "bg-cosmic-dark/20"
                }`}
              >
                <td className="p-2 whitespace-nowrap">
                  {index === 0 ? (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                      <Trophy className="h-3 w-3" />
                    </div>
                  ) : index === 1 ? (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-gray-300 to-gray-500 text-white">
                      <Medal className="h-3 w-3" />
                    </div>
                  ) : index === 2 ? (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-amber-600 to-amber-800 text-white">
                      <Star className="h-3 w-3" />
                    </div>
                  ) : (
                    <div className="text-center text-blue-200">{index + 1}</div>
                  )}
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-2">
                      <div
                        className={`font-medium ${entry.username === currentUser ? "text-purple-200" : "text-blue-200"}`}
                      >
                        {entry.username}
                      </div>
                      <div className="text-xs text-blue-300">Level {entry.level}</div>
                    </div>
                  </div>
                </td>
                <td className="p-2 whitespace-nowrap text-right text-blue-200 font-medium">
                  {entry[sortKey].toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentUser && userRank && userRank > 10 && (
          <div className="border-t border-purple-500/30 p-2 bg-purple-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-center text-blue-200 w-8">{userRank}</div>
                <div className="ml-4">
                  <div className="font-medium text-purple-200">{currentUser}</div>
                  <div className="text-xs text-blue-300">Level {getLevelInfo(user?.totalPoints || 0).currentLevel}</div>
                </div>
              </div>
              <div className="text-right text-blue-200 font-medium">{user?.[sortKey]?.toLocaleString() || 0}</div>
            </div>
          </div>
        )}
      </div>
    </CardContent>
  )
}
