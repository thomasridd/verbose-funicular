import { LevelDefinition, FacilityDefinition } from '../types/game.types';

// Facility definitions for Level 1
const injectionMolder: FacilityDefinition = {
  id: 'injection-molder',
  name: 'Injection Molder',
  type: 'PROCESSOR',
  cost: 500,
  recipe: {
    inputs: [{ resourceType: 'Plastic Pellets', quantity: 10 }],
    outputs: [{ resourceType: 'Plastic Parts', quantity: 5 }],
    processingTime: 10,
  },
  workerCapacity: 2,
  upgradeOptions: [
    {
      id: 'speed-1',
      name: 'Speed Boost I',
      cost: 200,
      effect: { type: 'SPEED', multiplier: 1.5 },
    },
    {
      id: 'efficiency-1',
      name: 'Efficiency Boost I',
      cost: 250,
      effect: { type: 'EFFICIENCY', multiplier: 1.3 },
    },
  ],
};

const metalPress: FacilityDefinition = {
  id: 'metal-press',
  name: 'Metal Press',
  type: 'PROCESSOR',
  cost: 600,
  recipe: {
    inputs: [{ resourceType: 'Metal Scraps', quantity: 8 }],
    outputs: [{ resourceType: 'Metal Frames', quantity: 4 }],
    processingTime: 12,
  },
  workerCapacity: 2,
  upgradeOptions: [
    {
      id: 'speed-1',
      name: 'Speed Boost I',
      cost: 200,
      effect: { type: 'SPEED', multiplier: 1.5 },
    },
    {
      id: 'efficiency-1',
      name: 'Efficiency Boost I',
      cost: 250,
      effect: { type: 'EFFICIENCY', multiplier: 1.3 },
    },
  ],
};

const toyAssembler: FacilityDefinition = {
  id: 'toy-assembler',
  name: 'Toy Assembler',
  type: 'ASSEMBLER',
  cost: 800,
  recipe: {
    inputs: [
      { resourceType: 'Plastic Parts', quantity: 3 },
      { resourceType: 'Metal Frames', quantity: 1 },
    ],
    outputs: [{ resourceType: 'Toy Car', quantity: 1 }],
    processingTime: 8,
  },
  workerCapacity: 2,
  upgradeOptions: [
    {
      id: 'speed-1',
      name: 'Speed Boost I',
      cost: 300,
      effect: { type: 'SPEED', multiplier: 1.5 },
    },
  ],
};

const robotAssembler: FacilityDefinition = {
  id: 'robot-assembler',
  name: 'Robot Assembler',
  type: 'ASSEMBLER',
  cost: 900,
  recipe: {
    inputs: [
      { resourceType: 'Plastic Parts', quantity: 2 },
      { resourceType: 'Metal Frames', quantity: 2 },
    ],
    outputs: [{ resourceType: 'Toy Robot', quantity: 1 }],
    processingTime: 10,
  },
  workerCapacity: 2,
  upgradeOptions: [
    {
      id: 'speed-1',
      name: 'Speed Boost I',
      cost: 300,
      effect: { type: 'SPEED', multiplier: 1.5 },
    },
  ],
};

// Level 1 Definition
export const level1: LevelDefinition = {
  levelNumber: 1,
  startingMoney: 5000,
  timeLimit: 300, // 5 minutes
  objectives: [
    { resourceType: 'Toy Car', targetQuantity: 100, basePrice: 50 },
    { resourceType: 'Toy Robot', targetQuantity: 50, basePrice: 75 },
  ],
  availableResources: [
    { type: 'Plastic Pellets', cost: 5, category: 'RAW' },
    { type: 'Metal Scraps', cost: 8, category: 'RAW' },
  ],
  availableFacilities: [injectionMolder, metalPress, toyAssembler, robotAssembler],
  workerCost: 100,
};

// Level 2 Definition (slightly harder)
export const level2: LevelDefinition = {
  levelNumber: 2,
  startingMoney: 7000,
  timeLimit: 300,
  objectives: [
    { resourceType: 'Toy Car', targetQuantity: 150, basePrice: 50 },
    { resourceType: 'Toy Robot', targetQuantity: 80, basePrice: 75 },
  ],
  availableResources: [
    { type: 'Plastic Pellets', cost: 6, category: 'RAW' },
    { type: 'Metal Scraps', cost: 9, category: 'RAW' },
  ],
  availableFacilities: [injectionMolder, metalPress, toyAssembler, robotAssembler],
  workerCost: 120,
};

// Export all levels
export const levels: LevelDefinition[] = [level1, level2];

export const getLevelById = (levelNumber: number): LevelDefinition | undefined => {
  return levels.find((level) => level.levelNumber === levelNumber);
};
