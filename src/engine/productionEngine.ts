import { PlacedFacility, Inventory } from '../types/game.types';
import {
  calculateEffectiveProcessingTime,
  calculateEffectiveOutput,
} from '../utils/economics';

export interface ProductionUpdate {
  inventory: Inventory;
  facilities: PlacedFacility[];
}

/**
 * Process production for a single facility over deltaTime seconds
 */
export const processFacility = (
  facility: PlacedFacility,
  inventory: Inventory,
  deltaTime: number
): { facility: PlacedFacility; inventory: Inventory; consumed: any; produced: any } => {
  const recipe = facility.definition.recipe;
  const { assignedWorkers, appliedUpgrades } = facility;

  // Calculate effective processing time based on workers and upgrades
  const speedUpgrades = appliedUpgrades
    .filter((u) => u.effect.type === 'SPEED')
    .map((u) => u.effect.multiplier);

  const effectiveTime = calculateEffectiveProcessingTime(
    recipe.processingTime,
    assignedWorkers,
    speedUpgrades
  );

  // How much progress we make this tick (as a fraction of complete recipe)
  const progressDelta = deltaTime / effectiveTime;

  let newProgress = facility.productionProgress + progressDelta;
  let newInventory = { ...inventory };
  let consumed: any = {};
  let produced: any = {};

  // Check if we can complete cycles
  while (newProgress >= 1.0) {
    // Check if we have enough inputs
    const canProduce = recipe.inputs.every((input: { resourceType: string; quantity: number }) => {
      return (newInventory[input.resourceType] || 0) >= input.quantity;
    });

    if (!canProduce) {
      // Can't produce, stall at 100% progress
      newProgress = 1.0;
      break;
    }

    // Consume inputs
    recipe.inputs.forEach((input: { resourceType: string; quantity: number }) => {
      newInventory[input.resourceType] -= input.quantity;
      consumed[input.resourceType] = (consumed[input.resourceType] || 0) + input.quantity;
    });

    // Calculate effective output with efficiency upgrades
    const efficiencyUpgrades = appliedUpgrades
      .filter((u) => u.effect.type === 'EFFICIENCY')
      .map((u) => u.effect.multiplier);

    // Produce outputs
    recipe.outputs.forEach((output: { resourceType: string; quantity: number }) => {
      const effectiveQuantity = calculateEffectiveOutput(
        output.quantity,
        efficiencyUpgrades
      );
      newInventory[output.resourceType] =
        (newInventory[output.resourceType] || 0) + effectiveQuantity;
      produced[output.resourceType] = (produced[output.resourceType] || 0) + effectiveQuantity;
    });

    // Continue to next cycle
    newProgress -= 1.0;
  }

  return {
    facility: { ...facility, productionProgress: newProgress },
    inventory: newInventory,
    consumed,
    produced,
  };
};

/**
 * Update all facilities' production for the given time delta
 */
export const updateProduction = (
  facilities: PlacedFacility[],
  inventory: Inventory,
  deltaTime: number
): ProductionUpdate => {
  let currentInventory = { ...inventory };
  const updatedFacilities: PlacedFacility[] = [];

  for (const facility of facilities) {
    const result = processFacility(facility, currentInventory, deltaTime);
    updatedFacilities.push(result.facility);
    currentInventory = result.inventory;
  }

  return {
    inventory: currentInventory,
    facilities: updatedFacilities,
  };
};
