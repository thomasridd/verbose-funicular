import { GameEvent, Objective, LevelDefinition } from '../types/game.types';
import {
  generateDemandShiftAll,
  generateDemandShiftSelective,
  selectRandomItems,
} from '../utils/economics';

/**
 * Generate events for a level
 */
export const generateLevelEvents = (
  levelDefinition: LevelDefinition
): GameEvent[] => {
  const events: GameEvent[] = [];

  // Event at 1 minute: All objectives shift ±20%
  events.push({
    triggerTime: 60,
    type: 'DEMAND_SHIFT_ALL',
    changes: levelDefinition.objectives.map((obj) => ({
      resourceType: obj.resourceType,
      multiplier: generateDemandShiftAll(),
    })),
  });

  // Event at 3 minutes: 2 random objectives shift +50% to +100%
  const selectedObjectives = selectRandomItems(levelDefinition.objectives, 2);
  events.push({
    triggerTime: 180,
    type: 'DEMAND_SHIFT_SELECTIVE',
    changes: selectedObjectives.map((obj) => ({
      resourceType: obj.resourceType,
      multiplier: generateDemandShiftSelective(),
    })),
  });

  return events;
};

/**
 * Check and trigger events based on elapsed time
 */
export const checkAndTriggerEvents = (
  elapsedTime: number,
  events: GameEvent[],
  triggeredEvents: GameEvent[]
): GameEvent[] => {
  const newlyTriggered: GameEvent[] = [];

  for (const event of events) {
    // Check if event should trigger and hasn't been triggered yet
    const alreadyTriggered = triggeredEvents.some(
      (te) => te.triggerTime === event.triggerTime && te.type === event.type
    );

    if (!alreadyTriggered && elapsedTime >= event.triggerTime) {
      newlyTriggered.push(event);
    }
  }

  return newlyTriggered;
};

/**
 * Apply event changes to objectives
 */
export const applyEventToObjectives = (
  objectives: Objective[],
  event: GameEvent
): Objective[] => {
  return objectives.map((obj) => {
    const change = event.changes.find((c) => c.resourceType === obj.resourceType);
    if (change) {
      const currentTarget = obj.currentTarget || obj.targetQuantity;
      return {
        ...obj,
        currentTarget: Math.round(currentTarget * change.multiplier),
      };
    }
    return obj;
  });
};
