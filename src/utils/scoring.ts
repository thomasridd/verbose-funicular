import { Objective, Inventory, GameResults } from '../types/game.types';

export interface CostBreakdown {
  resources: number;
  facilities: number;
  workers: number;
  upgrades: number;
}

export const calculateExcessPenalty = (
  produced: number,
  target: number
): number => {
  if (produced <= target) return 0;

  const excessPercentage = ((produced - target) / target) * 100;
  // -2% per 10% over target
  const penalty = (excessPercentage / 10) * 0.02;
  return Math.min(penalty, 1); // Cap at 100% penalty
};

export const calculateRevenue = (
  objectives: Objective[],
  inventory: Inventory
): { total: number; details: any[] } => {
  const details = objectives.map((objective) => {
    const produced = inventory[objective.resourceType] || 0;
    const target = objective.currentTarget || objective.targetQuantity;
    const penalty = calculateExcessPenalty(produced, target);
    const effectivePrice = objective.basePrice * (1 - penalty);
    const revenue = Math.min(produced, target) * objective.basePrice +
                   Math.max(0, produced - target) * effectivePrice;

    return {
      resourceType: objective.resourceType,
      target,
      produced,
      fulfillmentPercentage: Math.min(produced / target, 1),
      revenue,
      penalty,
    };
  });

  const total = details.reduce((sum, d) => sum + d.revenue, 0);
  return { total, details };
};

export const calculateTargetFulfillment = (
  objectives: Objective[],
  inventory: Inventory
): number => {
  const fulfillments = objectives.map((obj) => {
    const produced = inventory[obj.resourceType] || 0;
    const target = obj.currentTarget || obj.targetQuantity;
    return Math.min(produced / target, 1);
  });

  return fulfillments.reduce((sum, val) => sum + val, 0) / objectives.length;
};

export const calculateGameResults = (
  objectives: Objective[],
  inventory: Inventory,
  costs: CostBreakdown
): GameResults => {
  const { total: revenue, details } = calculateRevenue(objectives, inventory);
  const totalCosts =
    costs.resources + costs.facilities + costs.workers + costs.upgrades;
  const profit = revenue - totalCosts;
  const targetFulfillment = calculateTargetFulfillment(objectives, inventory);

  // Combined score: 60% profit, 40% target fulfillment
  const combinedScore = profit * 0.6 + targetFulfillment * 1000 * 0.4;

  // Capital boost for next level
  const capitalBoost = 500 + combinedScore * 0.1;

  const objectiveResults = details.map((d) => ({
    resourceType: d.resourceType,
    target: d.target,
    produced: d.produced,
    fulfillmentPercentage: d.fulfillmentPercentage,
    revenue: d.revenue,
  }));

  return {
    revenue,
    costs,
    profit,
    targetFulfillment,
    combinedScore,
    capitalBoost,
    objectiveResults,
  };
};
