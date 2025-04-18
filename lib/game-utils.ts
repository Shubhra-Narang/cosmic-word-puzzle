// Word lists by difficulty
const EASY_WORDS = [
  "SPACE",
  "STARS",
  "COMET",
  "ORBIT",
  "LUNAR",
  "SOLAR",
  "VENUS",
  "EARTH",
  "PLUTO",
  "ALIEN",
  "ASTRO",
  "LIGHT",
  "QUARK",
  "ATOMS",
  "LASER",
  "WARP",
  "MOON",
  "MARS",
  "NOVA",
  "DUST",
]

const MEDIUM_WORDS = [
  "NEBULA",
  "GALAXY",
  "COSMIC",
  "METEOR",
  "QUASAR",
  "PULSAR",
  "SATURN",
  "ROCKET",
  "ASTRAL",
  "PLANET",
  "COSMOS",
  "FUSION",
  "PHOTON",
  "VACUUM",
  "ZENITH",
  "AURORA",
  "ECLIPSE",
  "GRAVITY",
  "JUPITER",
  "NEUTRON",
]

const HARD_WORDS = [
  "ASTEROID",
  "UNIVERSE",
  "SUPERNOVA",
  "TELESCOPE",
  "HYDROGEN",
  "STARSHIP",
  "WORMHOLE",
  "SPACETIME",
  "RADIATION",
  "SATELLITE",
  "CELESTIAL",
  "ANTIMATTER",
  "BLACKHOLE",
  "LIGHTYEAR",
  "STARDUST",
  "VOYAGER",
  "REDSHIFT",
  "PARALLAX",
  "SPECTRUM",
  "EXOPLANET",
]

const LEGENDARY_WORDS = [
  "ASTRONOMY",
  "COSMOLOGY",
  "SPACEFLIGHT",
  "GRAVITATION",
  "CONSTELLATION",
  "INTERSTELLAR",
  "ASTROPHYSICS",
  "PLANETARIUM",
  "OBSERVATORY",
  "EXTRATERRESTRIAL",
  "HELIOSPHERE",
  "SINGULARITY",
  "MAGNETOSPHERE",
  "SPECTROSCOPY",
  "THERMONUCLEAR",
  "GRAVITATIONAL",
  "SUPERCLUSTER",
  "PLANETESIMAL",
  "CRYOVOLCANISM",
  "BIOLUMINESCENCE",
]

// Get words based on difficulty
export function getDifficultyWords(difficulty: string): string[] {
  switch (difficulty) {
    case "easy":
      return EASY_WORDS
    case "medium":
      return MEDIUM_WORDS
    case "hard":
      return HARD_WORDS
    case "legendary":
      return LEGENDARY_WORDS
    default:
      return EASY_WORDS
  }
}

// Get word length based on difficulty
export function getWordLength(difficulty: string): number {
  switch (difficulty) {
    case "easy":
      return 5
    case "medium":
      return 6
    case "hard":
      return 7
    case "legendary":
      return 8
    default:
      return 5
  }
}

// Get max attempts based on difficulty
export function getMaxAttempts(difficulty: string): number {
  switch (difficulty) {
    case "easy":
      return 6
    case "medium":
      return 6
    case "hard":
      return 5
    case "legendary":
      return 5
    default:
      return 6
  }
}

// Get difficulty multiplier for scoring
export function getDifficultyMultiplier(difficulty: string): number {
  switch (difficulty) {
    case "easy":
      return 1
    case "medium":
      return 1.5
    case "hard":
      return 2
    case "legendary":
      return 3
    default:
      return 1
  }
}

// Calculate score based on attempts, hints, and difficulty
export function calculateScore(attempts: number, hints: number, difficulty: string): number {
  // Base score depends on attempts (fewer is better)
  const baseScore = 50 - (attempts - 1) * 10

  // Penalty for hints
  const hintPenalty = hints * 10

  // Apply difficulty multiplier
  const multiplier = getDifficultyMultiplier(difficulty)

  // Calculate final score (minimum 10 points)
  return Math.max(Math.round((baseScore - hintPenalty) * multiplier), 10)
}

// Get level info based on total points
export function getLevelInfo(totalPoints: number) {
  // Level thresholds
  const levels = [
    { level: 1, threshold: 0 },
    { level: 2, threshold: 500 },
    { level: 3, threshold: 1000 },
    { level: 4, threshold: 2000 },
    { level: 5, threshold: 5000 },
  ]

  // Find current level
  let currentLevel = 1
  let nextLevelThreshold = 500

  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalPoints >= levels[i].threshold) {
      currentLevel = levels[i].level
      nextLevelThreshold = i < levels.length - 1 ? levels[i + 1].threshold : levels[i].threshold
      break
    }
  }

  // Calculate progress to next level
  const currentLevelThreshold = levels.find((l) => l.level === currentLevel)?.threshold || 0
  const pointsForNextLevel = nextLevelThreshold
  const progress =
    currentLevel < 5
      ? ((totalPoints - currentLevelThreshold) / (nextLevelThreshold - currentLevelThreshold)) * 100
      : 100

  return {
    currentLevel,
    nextLevel: Math.min(currentLevel + 1, 5),
    pointsForNextLevel,
    progress,
  }
}
