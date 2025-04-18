import { cn } from "@/lib/utils"

interface WordRowProps {
  guess: string
  solution: string
  isPlaceholder?: boolean
}

export default function WordRow({ guess, solution, isPlaceholder = false }: WordRowProps) {
  // Create an array of the correct length based on the solution
  const letters = isPlaceholder
    ? Array(solution.length).fill("")
    : guess.split("").concat(Array(solution.length - guess.length).fill(""))

  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${solution.length}, minmax(0, 1fr))` }}>
      {letters.map((letter, index) => {
        // Determine the status of each letter
        let status = "empty"

        if (!isPlaceholder && letter) {
          if (letter === solution[index]) {
            status = "correct"
          } else if (solution.includes(letter)) {
            status = "present"
          } else {
            status = "absent"
          }
        }

        return (
          <div
            key={index}
            className={cn(
              "flex items-center justify-center border-2 font-bold text-base uppercase w-full aspect-square relative",
              isPlaceholder ? "border-purple-800/30 bg-cosmic-dark/20" : "border-purple-700/50",
              status === "correct" && "bg-gradient-to-br from-teal-600 to-teal-800 text-white border-teal-400/50",
              status === "present" && "bg-gradient-to-br from-purple-600 to-purple-800 text-white border-purple-400/50",
              status === "absent" && "bg-gradient-to-br from-gray-700 to-gray-900 text-gray-400 border-gray-600/30",
              "transition-all duration-300 transform hover:scale-105",
            )}
            style={{ maxHeight: "2.5rem" }}
          >
            {letter}

            {/* Star effect in corners for correct letters */}
            {status === "correct" && (
              <>
                <span className="absolute top-0 left-0 w-1 h-1 bg-teal-200 rounded-full"></span>
                <span className="absolute bottom-0 right-0 w-1 h-1 bg-teal-200 rounded-full"></span>
              </>
            )}

            {/* Subtle glow for present letters */}
            {status === "present" && <span className="absolute inset-0 rounded-sm bg-purple-500/10 blur-sm"></span>}
          </div>
        )
      })}
    </div>
  )
}
