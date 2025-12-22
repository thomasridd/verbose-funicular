// Resource types and categories
export type ResourceCategory = 'RAW' | 'INTERMEDIATE' | 'FINISHED';

export interface Resource {
  type: string;
  cost: number;
  basePrice?: number;
  category: ResourceCategory;
}

export interface ResourceQuantity {
  resourceType: string;
  quantity: number;
}

// Facility types
export type FacilityType = 'EXTRACTOR' | 'PROCESSOR' | 'ASSEMBLER';

export interface Recipe {
  inputs: ResourceQuantity[];
  outputs: ResourceQuantity[];
  processingTime: number; // seconds
}

export interface Upgrade {
  id: string;
  name: string;
  cost: number;
  effect: {
    type: 'SPEED' | 'EFFICIENCY' | 'CAPACITY';
    multiplier: number;
  };
}

export interface FacilityDefinition {
  id: string;
  name: string;
  type: FacilityType;
  cost: number;
  recipe: Recipe;
  workerCapacity: number;
  upgradeOptions: Upgrade[];
}

export interface PlacedFacility {
  instanceId: string;
  facilityId: string;
  definition: FacilityDefinition;
  assignedWorkers: number;
  appliedUpgrades: Upgrade[];
  productionProgress: number; // 0-1, represents progress in current recipe cycle
  position: number; // position on factory floor
}

// Game events
export type EventType = 'DEMAND_SHIFT_ALL' | 'DEMAND_SHIFT_SELECTIVE';

export interface DemandChange {
  resourceType: string;
  multiplier: number;
}

export interface GameEvent {
  triggerTime: number; // seconds into production phase
  type: EventType;
  changes: DemandChange[];
}

// Level objectives
export interface Objective {
  resourceType: string;
  targetQuantity: number;
  basePrice: number;
  currentTarget?: number; // Modified by events
}

// Level definition
export interface LevelDefinition {
  levelNumber: number;
  startingMoney: number;
  timeLimit: number; // seconds
  objectives: Objective[];
  availableResources: Resource[];
  availableFacilities: FacilityDefinition[];
  workerCost: number;
}

// Game state
export type GamePhase = 'PLANNING' | 'PRODUCTION' | 'END';

export interface Inventory {
  [resourceType: string]: number;
}

export interface GameState {
  // Meta state
  phase: GamePhase;
  currentLevel: number;
  money: number;

  // Level data
  levelDefinition: LevelDefinition | null;

  // Planning/Production state
  inventory: Inventory;
  placedFacilities: PlacedFacility[];
  availableWorkers: number;
  totalWorkers: number;

  // Production phase
  productionTimer: number; // seconds remaining
  elapsedTime: number; // seconds elapsed in production
  isProducing: boolean;
  events: GameEvent[];
  triggeredEvents: GameEvent[];

  // End phase
  results: GameResults | null;
}

export interface GameResults {
  revenue: number;
  costs: {
    resources: number;
    facilities: number;
    workers: number;
    upgrades: number;
  };
  profit: number;
  targetFulfillment: number; // 0-1
  combinedScore: number;
  capitalBoost: number;
  objectiveResults: {
    resourceType: string;
    target: number;
    produced: number;
    fulfillmentPercentage: number;
    revenue: number;
  }[];
}

// Worker assignment
export interface WorkerAssignment {
  facilityInstanceId: string;
  workerCount: number;
}
