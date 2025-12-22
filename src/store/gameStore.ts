import { create } from 'zustand';
import {
  GameState,
  PlacedFacility,
  Upgrade,
} from '../types/game.types';
import { getLevelById } from '../data/levels';
import { updateProduction } from '../engine/productionEngine';
import {
  generateLevelEvents,
  checkAndTriggerEvents,
  applyEventToObjectives,
} from '../engine/eventEngine';
import { calculateGameResults, CostBreakdown } from '../utils/scoring';

interface GameStore extends GameState {
  // Tracking costs for scoring
  totalCosts: CostBreakdown;

  // Actions
  startLevel: (levelNumber: number) => void;
  purchaseResource: (resourceType: string, quantity: number) => void;
  purchaseFacility: (facilityId: string, position: number) => void;
  purchaseWorker: () => void;
  purchaseUpgrade: (facilityInstanceId: string, upgrade: Upgrade) => void;
  assignWorkers: (facilityInstanceId: string, workerCount: number) => void;
  startProduction: () => void;
  tick: (deltaTime: number) => void;
  endProduction: () => void;
  nextLevel: () => void;
  reset: () => void;
}

const initialState: GameState = {
  phase: 'PLANNING',
  currentLevel: 1,
  money: 0,
  levelDefinition: null,
  inventory: {},
  placedFacilities: [],
  availableWorkers: 0,
  totalWorkers: 0,
  productionTimer: 0,
  elapsedTime: 0,
  isProducing: false,
  events: [],
  triggeredEvents: [],
  results: null,
};

const initialCosts: CostBreakdown = {
  resources: 0,
  facilities: 0,
  workers: 0,
  upgrades: 0,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  totalCosts: { ...initialCosts },

  startLevel: (levelNumber: number) => {
    const levelDef = getLevelById(levelNumber);
    if (!levelDef) {
      console.error(`Level ${levelNumber} not found`);
      return;
    }

    const events = generateLevelEvents(levelDef);

    set({
      phase: 'PLANNING',
      currentLevel: levelNumber,
      money: levelDef.startingMoney,
      levelDefinition: levelDef,
      inventory: {},
      placedFacilities: [],
      availableWorkers: 0,
      totalWorkers: 0,
      productionTimer: levelDef.timeLimit,
      elapsedTime: 0,
      isProducing: false,
      events,
      triggeredEvents: [],
      results: null,
      totalCosts: { ...initialCosts },
    });
  },

  purchaseResource: (resourceType: string, quantity: number) => {
    const state = get();
    const resource = state.levelDefinition?.availableResources.find(
      (r) => r.type === resourceType
    );

    if (!resource) return;

    const cost = resource.cost * quantity;
    if (state.money < cost) return;

    set({
      money: state.money - cost,
      inventory: {
        ...state.inventory,
        [resourceType]: (state.inventory[resourceType] || 0) + quantity,
      },
      totalCosts: {
        ...state.totalCosts,
        resources: state.totalCosts.resources + cost,
      },
    });
  },

  purchaseFacility: (facilityId: string, position: number) => {
    const state = get();
    if (state.phase !== 'PLANNING') return; // Can only buy facilities during planning

    const facilityDef = state.levelDefinition?.availableFacilities.find(
      (f) => f.id === facilityId
    );

    if (!facilityDef || state.money < facilityDef.cost) return;

    const newFacility: PlacedFacility = {
      instanceId: `${facilityId}-${Date.now()}-${Math.random()}`,
      facilityId: facilityDef.id,
      definition: facilityDef,
      assignedWorkers: 0,
      appliedUpgrades: [],
      productionProgress: 0,
      position,
    };

    set({
      money: state.money - facilityDef.cost,
      placedFacilities: [...state.placedFacilities, newFacility],
      totalCosts: {
        ...state.totalCosts,
        facilities: state.totalCosts.facilities + facilityDef.cost,
      },
    });
  },

  purchaseWorker: () => {
    const state = get();
    const workerCost = state.levelDefinition?.workerCost || 100;

    if (state.money < workerCost) return;

    set({
      money: state.money - workerCost,
      availableWorkers: state.availableWorkers + 1,
      totalWorkers: state.totalWorkers + 1,
      totalCosts: {
        ...state.totalCosts,
        workers: state.totalCosts.workers + workerCost,
      },
    });
  },

  purchaseUpgrade: (facilityInstanceId: string, upgrade: Upgrade) => {
    const state = get();
    if (state.money < upgrade.cost) return;

    const facilityIndex = state.placedFacilities.findIndex(
      (f) => f.instanceId === facilityInstanceId
    );

    if (facilityIndex === -1) return;

    const facility = state.placedFacilities[facilityIndex];
    const alreadyHasUpgrade = facility.appliedUpgrades.some(
      (u) => u.id === upgrade.id
    );

    if (alreadyHasUpgrade) return;

    const updatedFacilities = [...state.placedFacilities];
    updatedFacilities[facilityIndex] = {
      ...facility,
      appliedUpgrades: [...facility.appliedUpgrades, upgrade],
    };

    set({
      money: state.money - upgrade.cost,
      placedFacilities: updatedFacilities,
      totalCosts: {
        ...state.totalCosts,
        upgrades: state.totalCosts.upgrades + upgrade.cost,
      },
    });
  },

  assignWorkers: (facilityInstanceId: string, workerCount: number) => {
    const state = get();
    const facilityIndex = state.placedFacilities.findIndex(
      (f) => f.instanceId === facilityInstanceId
    );

    if (facilityIndex === -1) return;

    const facility = state.placedFacilities[facilityIndex];
    const currentWorkers = facility.assignedWorkers;
    const workerDelta = workerCount - currentWorkers;

    // Check if we have enough available workers
    if (workerDelta > state.availableWorkers) return;

    // Check capacity
    if (workerCount > facility.definition.workerCapacity) return;

    const updatedFacilities = [...state.placedFacilities];
    updatedFacilities[facilityIndex] = {
      ...facility,
      assignedWorkers: workerCount,
    };

    set({
      placedFacilities: updatedFacilities,
      availableWorkers: state.availableWorkers - workerDelta,
    });
  },

  startProduction: () => {
    const state = get();
    if (state.phase !== 'PLANNING') return;

    set({
      phase: 'PRODUCTION',
      isProducing: true,
      elapsedTime: 0,
    });
  },

  tick: (deltaTime: number) => {
    const state = get();
    if (!state.isProducing || state.phase !== 'PRODUCTION') return;

    // Update production
    const { inventory, facilities } = updateProduction(
      state.placedFacilities,
      state.inventory,
      deltaTime
    );

    const newElapsedTime = state.elapsedTime + deltaTime;
    const newTimer = Math.max(0, state.productionTimer - deltaTime);

    // Check for events
    const newlyTriggered = checkAndTriggerEvents(
      newElapsedTime,
      state.events,
      state.triggeredEvents
    );

    let updatedObjectives = state.levelDefinition?.objectives || [];

    // Apply newly triggered events
    for (const event of newlyTriggered) {
      updatedObjectives = applyEventToObjectives(updatedObjectives, event);
    }

    // Update level definition with new objectives
    const updatedLevelDef = state.levelDefinition
      ? { ...state.levelDefinition, objectives: updatedObjectives }
      : null;

    set({
      inventory,
      placedFacilities: facilities,
      elapsedTime: newElapsedTime,
      productionTimer: newTimer,
      triggeredEvents: [...state.triggeredEvents, ...newlyTriggered],
      levelDefinition: updatedLevelDef,
    });

    // Check if time is up
    if (newTimer <= 0) {
      get().endProduction();
    }
  },

  endProduction: () => {
    const state = get();
    if (!state.levelDefinition) return;

    set({ isProducing: false });

    const results = calculateGameResults(
      state.levelDefinition.objectives,
      state.inventory,
      state.totalCosts
    );

    set({
      phase: 'END',
      results,
      money: state.money + results.profit + results.capitalBoost,
    });
  },

  nextLevel: () => {
    const state = get();
    const nextLevelNumber = state.currentLevel + 1;
    const carryOverMoney = state.money;

    get().startLevel(nextLevelNumber);

    // Add carry-over money
    set((state) => ({ money: state.money + carryOverMoney }));
  },

  reset: () => {
    set({ ...initialState, totalCosts: { ...initialCosts } });
  },
}));
