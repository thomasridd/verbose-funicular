/**
 * Calculate production speed multiplier based on worker count
 * No worker = 50% speed
 * 1 worker = 100% speed
 * 2 workers = 110% speed
 * 3+ workers = 115% speed
 */
export const calculateWorkerSpeedMultiplier = (workerCount: number): number => {
  if (workerCount === 0) return 0.5;
  if (workerCount === 1) return 1.0;
  if (workerCount === 2) return 1.1;
  return 1.15; // 3 or more workers
};

/**
 * Calculate effective processing time based on workers and upgrades
 */
export const calculateEffectiveProcessingTime = (
  baseTime: number,
  workerCount: number,
  speedUpgrades: number[] // array of speed multipliers
): number => {
  const workerMultiplier = calculateWorkerSpeedMultiplier(workerCount);
  const upgradeMultiplier = speedUpgrades.reduce((acc, mult) => acc * mult, 1);

  // Speed multipliers reduce the processing time
  return baseTime / (workerMultiplier * upgradeMultiplier);
};

/**
 * Calculate effective output quantity based on efficiency upgrades
 */
export const calculateEffectiveOutput = (
  baseOutput: number,
  efficiencyUpgrades: number[] // array of efficiency multipliers
): number => {
  const efficiencyMultiplier = efficiencyUpgrades.reduce(
    (acc, mult) => acc * mult,
    1
  );
  return Math.floor(baseOutput * efficiencyMultiplier);
};

/**
 * Generate random demand change for events
 */
export const generateDemandShiftAll = (): number => {
  // ±20% = 0.8 to 1.2
  return 0.8 + Math.random() * 0.4;
};

export const generateDemandShiftSelective = (): number => {
  // +50% to +100% = 1.5 to 2.0
  return 1.5 + Math.random() * 0.5;
};

/**
 * Select random items from array
 */
export const selectRandomItems = <T,>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
};
