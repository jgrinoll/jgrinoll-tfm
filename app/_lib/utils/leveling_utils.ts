const LEVEL_COEFFICIENT = 50;

// Leveling algorithm
// pages = 50 * (level - 1)^2
// level = √(pages / 50) + 1

export function calculateLevelFromPages(totalPages: number): number {
  if (totalPages < 0) return 1;
  
  const level = Math.floor(Math.sqrt(totalPages / LEVEL_COEFFICIENT)) + 1;
  
  return level;
}

export function getPagesNeededForLevel(level: number): number {
  return LEVEL_COEFFICIENT * (level - 1) * (level - 1);
}

export function getProgressToNextLevel(totalPages: number, currentLevel: number): {
  currentLevelPages: number;
  nextLevelPages: number;
  progressInLevel: number;
  percentageToNextLevel: number;
} {
  const currentLevelPages = getPagesNeededForLevel(currentLevel);
  const nextLevelPages = getPagesNeededForLevel(currentLevel + 1);
  const progressInLevel = totalPages - currentLevelPages;
  const pagesNeededInLevel = nextLevelPages - currentLevelPages;
  const percentageToNextLevel = (progressInLevel / pagesNeededInLevel) * 100;

  return {
    currentLevelPages,
    nextLevelPages,
    progressInLevel,
    percentageToNextLevel,
  };
}
