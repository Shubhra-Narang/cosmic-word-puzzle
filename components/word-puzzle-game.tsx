"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, RefreshCw, Rocket, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import WordRow from "@/components/word-row"
import Keyboard from "@/components/keyboard"
import DifficultySelector from "@/components/difficulty-selector"
import { useAuth } from "@/lib/auth"
import { getDifficultyWords, calculateScore, getMaxAttempts } from "@/lib/game-utils"

export default function WordPuzzleGame() {
  const { toast } = useToast()
  const { user, updateUserData } = useAuth()
  const [dailyWord, setDailyWord] = useState("")
  const [guesses, setGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState("")
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing")
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "legendary">("easy")
  const [showDifficultySelector, setShowDifficultySelector] = useState(false)

  // Create a ref for the input field
  const inputRef = useRef<HTMLInputElement>(null)

  // Get max attempts based on difficulty
  const MAX_ATTEMPTS = getMaxAttempts(difficulty)

  // Initialize game - using useCallback to prevent unnecessary re-renders
  const initializeGame = useCallback(() => {
    const words = getDifficultyWords(difficulty)
    const randomIndex = Math.floor(Math.random() * words.length)
    const selectedWord = words[randomIndex]
    console.log("New word selected:", selectedWord) // Debug log
    setDailyWord(selectedWord)

    // Reset game state
    setGuesses([])
    setCurrentGuess("")
    setGameStatus("playing")
    setHintsUsed(0)

    // Focus the input field after a short delay
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
  }, [difficulty])

  // Initialize game on mount and when difficulty changes
  useEffect(() => {
    initializeGame()

    // Check if device is mobile
    setShowKeyboard(window.innerWidth < 768)
  }, [difficulty, initializeGame])

  // Focus input when game status changes to playing
  useEffect(() => {
    if (gameStatus === "playing" && inputRef.current) {
      inputRef.current.focus()
    }
  }, [gameStatus])

  // Handle submit guess
  const handleSubmitGuess = () => {
    if (gameStatus !== "playing") return

    if (currentGuess.length !== dailyWord.length) {
      toast({
        title: "Cosmic Anomaly",
        description: `Your transmission must be ${dailyWord.length} letters long.`,
        variant: "destructive",
      })
      return
    }

    if (!/^[A-Za-z]+$/.test(currentGuess)) {
      toast({
        title: "Invalid Transmission",
        description: "Your message must contain only Earth letters.",
        variant: "destructive",
      })
      return
    }

    const formattedGuess = currentGuess.toUpperCase()
    const newGuesses = [...guesses, formattedGuess]
    setGuesses(newGuesses)
    setCurrentGuess("")

    // Check if won
    if (formattedGuess === dailyWord) {
      setGameStatus("won")
      const earnedPoints = calculateScore(newGuesses.length, hintsUsed, difficulty)

      // Update user data with earned points
      if (user) {
        updateUserData({
          totalPoints: (user.totalPoints || 0) + earnedPoints,
          gamesWon: (user.gamesWon || 0) + 1,
          gamesPlayed: (user.gamesPlayed || 0) + 1,
          [`${difficulty}GamesWon`]: (user[`${difficulty}GamesWon`] || 0) + 1,
        })
      }

      toast({
        title: "Cosmic Discovery!",
        description: `You decoded the galactic message and earned ${earnedPoints} cosmic points!`,
        variant: "default",
      })
    }
    // Check if lost
    else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameStatus("lost")

      // Update user data
      if (user) {
        updateUserData({
          gamesPlayed: (user.gamesPlayed || 0) + 1,
        })
      }

      toast({
        title: "Mission Failed",
        description: `The cosmic code was ${dailyWord}. Try again with a new mission!`,
        variant: "destructive",
      })
    } else {
      // Focus the input field after submitting a guess
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 10)
    }
  }

  // Get hint function
  const getHint = () => {
    if (gameStatus !== "playing") return

    if (hintsUsed >= 3) {
      toast({
        title: "Cosmic Energy Depleted",
        description: "You've used all your cosmic insights for today.",
        variant: "destructive",
      })
      return
    }

    // Find a letter the player hasn't guessed correctly yet
    const correctPositions = new Set()

    guesses.forEach((guess) => {
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === dailyWord[i]) {
          correctPositions.add(i)
        }
      }
    })

    // Find a position to reveal
    let hintPosition
    let attempts = 0
    do {
      hintPosition = Math.floor(Math.random() * dailyWord.length)
      attempts++
      // Prevent infinite loop if all positions are already guessed
      if (attempts > 20) {
        hintPosition = -1
        break
      }
    } while (correctPositions.has(hintPosition))

    if (hintPosition === -1) {
      toast({
        title: "Cosmic Insight",
        description: "The stars are aligned! You've already discovered all the key positions.",
        variant: "default",
      })
    } else {
      toast({
        title: "Cosmic Insight",
        description: `The stars reveal position ${hintPosition + 1} contains "${dailyWord[hintPosition]}".`,
        variant: "default",
      })
    }

    setHintsUsed((prev) => prev + 1)

    // Focus the input field after using a hint
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 10)
  }

  // Reset game function
  const resetGame = () => {
    const words = getDifficultyWords(difficulty)
    const randomIndex = Math.floor(Math.random() * words.length)
    const newWord = words[randomIndex]
    console.log("New mission word:", newWord) // Debug log

    setDailyWord(newWord)
    setGuesses([])
    setCurrentGuess("")
    setGameStatus("playing")
    setHintsUsed(0)

    toast({
      title: "New Mission Started",
      description: "A new cosmic word awaits your decoding skills!",
      variant: "default",
    })

    // Focus the input field after resetting the game
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 10)
  }

  // Handle key press for virtual keyboard
  const handleKeyPress = (key: string) => {
    if (gameStatus !== "playing") return

    if (key === "ENTER") {
      handleSubmitGuess()
    } else if (key === "BACKSPACE") {
      setCurrentGuess((prev) => prev.slice(0, -1))
    } else if (/^[A-Za-z]$/.test(key) && currentGuess.length < dailyWord.length) {
      setCurrentGuess((prev) => prev + key)
    }

    // Focus the input field after pressing a key
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Toggle difficulty selector
  const toggleDifficultySelector = () => {
    setShowDifficultySelector(!showDifficultySelector)
  }

  // Change difficulty
  const changeDifficulty = (newDifficulty: "easy" | "medium" | "hard" | "legendary") => {
    if (gameStatus === "playing" && guesses.length > 0) {
      toast({
        title: "Mission in Progress",
        description: "You cannot change difficulty during an active mission.",
        variant: "destructive",
      })
      return
    }

    setDifficulty(newDifficulty)
    setShowDifficultySelector(false)
  }

  // Get badge color based on difficulty
  const getBadgeClass = () => {
    switch (difficulty) {
      case "easy":
        return "border-green-500/50 text-green-300"
      case "medium":
        return "border-blue-500/50 text-blue-300"
      case "hard":
        return "border-purple-500/50 text-purple-300"
      case "legendary":
        return "border-orange-500/50 text-orange-300"
      default:
        return "border-blue-500/50 text-blue-300"
    }
  }

  return (
    <div className="w-full">
      <Card className="bg-gradient-to-br from-cosmic-dark/80 to-cosmic-blue/40 backdrop-blur-sm border border-purple-500/30 shadow-lg shadow-purple-900/30 relative overflow-hidden">
        {/* Constellation lines in card background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <line x1="10%" y1="20%" x2="30%" y2="40%" stroke="white" strokeWidth="0.5" />
            <line x1="30%" y1="40%" x2="50%" y2="30%" stroke="white" strokeWidth="0.5" />
            <line x1="50%" y1="30%" x2="70%" y2="50%" stroke="white" strokeWidth="0.5" />
            <line x1="70%" y1="50%" x2="90%" y2="40%" stroke="white" strokeWidth="0.5" />
            <circle cx="10%" cy="20%" r="1" fill="white" />
            <circle cx="30%" cy="40%" r="1.5" fill="white" />
            <circle cx="50%" cy="30%" r="2" fill="white" />
            <circle cx="70%" cy="50%" r="1" fill="white" />
            <circle cx="90%" cy="40%" r="1.5" fill="white" />
          </svg>
        </div>

        <CardHeader className="py-3">
          <CardTitle className="flex justify-between items-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-teal-200">
            <span className="flex items-center">
              <Rocket className="h-5 w-5 mr-2 text-purple-400" />
              <span className="font-press-start">Galactic Challenge</span>
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getBadgeClass()}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-blue-200 hover:text-white hover:bg-purple-900/20"
                onClick={toggleDifficultySelector}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
          <CardDescription className="text-blue-200">
            Decode the {dailyWord.length}-letter cosmic transmission in {MAX_ATTEMPTS} attempts
          </CardDescription>
        </CardHeader>

        {showDifficultySelector && (
          <DifficultySelector
            currentDifficulty={difficulty}
            onSelect={changeDifficulty}
            onClose={() => setShowDifficultySelector(false)}
          />
        )}

        <CardContent className="space-y-2 py-2">
          {/* Previous guesses */}
          <div className="space-y-1">
            {guesses.map((guess, index) => (
              <WordRow key={index} guess={guess} solution={dailyWord} />
            ))}

            {/* Empty rows for remaining attempts */}
            {Array.from({ length: MAX_ATTEMPTS - guesses.length }).map((_, index) => (
              <WordRow key={`empty-${index}`} guess="" solution={dailyWord} isPlaceholder />
            ))}
          </div>

          {/* Game status alerts */}
          {gameStatus === "won" && (
            <Alert className="bg-purple-900/40 border-purple-500/50 py-2 mt-2">
              <AlertDescription className="text-purple-200 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-yellow-300" />
                Cosmic success! You decoded the message in {guesses.length}{" "}
                {guesses.length === 1 ? "attempt" : "attempts"}!
              </AlertDescription>
            </Alert>
          )}

          {gameStatus === "lost" && (
            <Alert className="bg-red-900/40 border-red-500/50 py-2 mt-2">
              <AlertDescription className="text-red-200">
                Mission failed! The cosmic code was <strong>{dailyWord}</strong>. Try again with a new mission!
              </AlertDescription>
            </Alert>
          )}

          {/* Current guess input */}
          {gameStatus === "playing" && (
            <div className="flex gap-2 mt-2">
              <Input
                ref={inputRef}
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmitGuess()
                }}
                placeholder={`Enter a ${dailyWord.length}-letter code`}
                maxLength={dailyWord.length}
                className="text-center uppercase font-bold text-lg bg-cosmic-dark/60 border-purple-500/30 text-purple-100 
                  focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 
                  hover:border-purple-400 hover:bg-cosmic-dark/70 transition-all"
                disabled={gameStatus !== "playing"}
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />
              <Button
                onClick={handleSubmitGuess}
                disabled={gameStatus !== "playing"}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 
                  text-white transform hover:scale-105 transition-all active:scale-95"
              >
                Transmit
              </Button>
            </div>
          )}

          {/* Virtual keyboard for mobile */}
          {showKeyboard && gameStatus === "playing" && (
            <Keyboard onKeyPress={handleKeyPress} guesses={guesses} solution={dailyWord} />
          )}
        </CardContent>
        <CardFooter className="flex justify-between py-3">
          <Button
            variant="outline"
            onClick={getHint}
            disabled={gameStatus !== "playing" || hintsUsed >= 3}
            className="flex gap-2 border-teal-500/30 text-teal-300 hover:bg-teal-900/20 hover:text-teal-200
              transform hover:scale-105 transition-all active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            Cosmic Insight ({3 - hintsUsed})
          </Button>

          <Button
            variant="outline"
            onClick={resetGame}
            className="flex gap-2 border-purple-500/30 text-purple-300 hover:bg-purple-900/20 hover:text-purple-200
              transform hover:scale-105 transition-all active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            New Mission
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
