Perfect! Here’s a detailed prompt for Claude Code:

-----

# Claude Code Prompt: Factory Strategy Game Engine

## Project Overview

Build a web-based factory strategy-simulation game with a side-view detailed visual style. Players optimize production chains under time pressure with dynamic goal changes.

## Technical Stack

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animation**: Framer Motion (for smooth transitions)
- **Build**: Vite

## Core Game Mechanics

### Game Phases

#### 1. Planning Phase

- Display level objectives (target quantities for finished goods)
- Show starting capital
- Player can purchase:
  - Raw resources
  - Facilities (one-time purchase)
  - Workers
  - Upgrades
- “START PRODUCTION” button begins production phase

#### 2. Production Phase (5 minutes real-time)

- Real-time resource conversion in facilities
- Player can:
  - Purchase raw resources (ongoing)
  - Purchase workers (ongoing)
  - Buy facility upgrades (instant effect)
  - Reassign workers between facilities (instant, drag-and-drop)
- **Fixed Events**:
  - **Minute 1**: All finished goods demands change by ±20%
  - **Minute 3**: Two randomly selected finished goods demands change by +50% to +100%
- Timer countdown displayed prominently
- Cannot purchase new facilities after START

#### 3. End Phase

- Production halts
- All inventory liquidated:
  - Target met: Full market price
  - Excess production: Price reduced by penalty percentage
  - Shortfall: No penalty, just missed opportunity
- Score calculation:
  - Profit (revenue - costs)
  - Target fulfillment percentage (weighted average across all objectives)
  - Combined score influences capital boost for next level
- Currency carries over + capital boost
- “NEXT LEVEL” button

### Resource System

**Resource Types:**

1. **Raw Resources** - Purchased inputs (e.g., Iron Ore, Wood, Oil)
1. **Intermediate Resources** - Processed from raw/other intermediates (e.g., Steel, Planks, Plastic)
1. **Finished Goods** - Final products counting toward objectives (e.g., Cars, Furniture, Toys)
1. **Workers** - Assignable to facilities to maintain/boost production

**Production Rules:**

- Facilities have recipes: X input → Y output over Z seconds
- Workers assigned to facilities enable/speed production
- No worker = 50% speed, 1 worker = 100% speed, 2+ workers = diminishing returns (110%, 115%)

### Facility System

**Facility Properties:**

```typescript
interface Facility {
  id: string;
  name: string;
  type: FacilityType; // EXTRACTOR, PROCESSOR, ASSEMBLER
  cost: number;
  recipe: {
    inputs: { resourceType: string; quantity: number }[];
    outputs: { resourceType: string; quantity: number }[];
    processingTime: number; // seconds
  };
  workerCapacity: number; // max workers assignable
  upgradeOptions: Upgrade[];
}
```

**Upgrade Properties:**

```typescript
interface Upgrade {
  id: string;
  name: string;
  cost: number;
  effect: {
    type: 'SPEED' | 'EFFICIENCY' | 'CAPACITY';
    multiplier: number; // e.g., 1.5 = 50% faster/more efficient
  };
}
```

### Economic System

**Pricing:**

- Each resource has base buy/sell price
- Excess penalty: -2% per 10% over target (e.g., 150% of target = 10% price reduction)
- Worker cost: Moderate, recurring expense

**Scoring Formula:**

```typescript
const profit = totalRevenue - totalCosts;
const targetFulfillment = objectives.map(obj => 
  Math.min(actualQuantity / targetQuantity, 1.0)
).reduce((sum, val) => sum + val) / objectives.length;

const combinedScore = (profit * 0.6) + (targetFulfillment * 1000 * 0.4);
const capitalBoost = 500 + (combinedScore * 0.1);
```

### Event System

**Event Implementation:**

```typescript
interface GameEvent {
  triggerTime: number; // seconds into production phase
  type: 'DEMAND_SHIFT_ALL' | 'DEMAND_SHIFT_SELECTIVE';
  changes: {
    resourceType: string;
    multiplier: number; // 0.8 to 1.2 for ALL, 1.5 to 2.0 for SELECTIVE
  }[];
}

// Level event schedule
const levelEvents = [
  {
    triggerTime: 60, // 1 minute
    type: 'DEMAND_SHIFT_ALL',
    changes: objectives.map(obj => ({
      resourceType: obj.resourceType,
      multiplier: 0.8 + Math.random() * 0.4 // ±20%
    }))
  },
  {
    triggerTime: 180, // 3 minutes
    type: 'DEMAND_SHIFT_SELECTIVE',
    changes: selectRandomObjectives(2).map(obj => ({
      resourceType: obj.resourceType,
      multiplier: 1.5 + Math.random() * 0.5 // +50% to +100%
    }))
  }
];
```

## UI Components Needed

### Planning Phase UI

1. **Resource Shop** - Grid of purchasable raw resources with quantities
1. **Facility Shop** - Side-scrolling list of available facilities with stats
1. **Worker Shop** - Purchase workers (show current count)
1. **Budget Display** - Current money, projected costs
1. **Objectives Panel** - List of target finished goods with quantities
1. **Factory Floor** - Side-view where facilities are placed (drag-and-drop or click-to-place)

### Production Phase UI

1. **Factory Visualization**

- Side-view of facilities processing resources
- Animated conveyor belts/pipes between facilities
- Visual indication of worker assignment (avatars at facilities)
- Resource flow animations (particles moving between facilities)

1. **Inventory Panel** - Real-time stock levels (raw, intermediate, finished)
1. **Objectives Tracker** - Progress bars for each objective (green if on track, red if behind)
1. **Timer** - Large countdown with event notifications at 1min and 3min marks
1. **Quick Purchase Panel** - Buy resources/workers during production
1. **Worker Assignment** - Drag workers from pool to facilities
1. **Event Notifications** - Modal/toast showing demand changes with before/after values

### End Phase UI

1. **Results Screen**

- Revenue breakdown (each finished good sold)
- Cost breakdown (resources, workers, upgrades, facilities)
- Profit calculation
- Target fulfillment percentage per objective
- Combined score
- Capital boost awarded

1. **Next Level Button**

## Visual Design Requirements

### Side-View Factory Aesthetic

- **Facility Representation**: Detailed 2D building sprites (industrial style)
  - Smoke stacks, gears, conveyor belts visible
  - Different visual styles per facility type (extractors look different from assemblers)
  - Worker avatars visible inside/near facilities
- **Resource Flow**: Animated particles/items moving on conveyor belts between facilities
- **Color Coding**:
  - Raw resources = brown/gray tones
  - Intermediates = blue/yellow tones
  - Finished goods = green/gold tones
- **Responsive Layout**: Factory floor scrollable horizontally if needed

### Animation Requirements

- Workers walking to facilities when reassigned
- Resources flowing between connected facilities
- Production progress indicators (filling bars, spinning gears)
- Event notifications with shake/flash effects
- Smooth transitions between phases

## Level Progression Data

### Level 1 (Tutorial)

```typescript
{
  startingMoney: 5000,
  timeLimit: 300, // 5 minutes
  objectives: [
    { resourceType: 'Toy Car', targetQuantity: 100, basePrice: 50 },
    { resourceType: 'Toy Robot', targetQuantity: 50, basePrice: 75 }
  ],
  availableResources: [
    { type: 'Plastic Pellets', cost: 5, category: 'RAW' },
    { type: 'Metal Scraps', cost: 8, category: 'RAW' }
  ],
  availableFacilities: [
    {
      name: 'Injection Molder',
      cost: 500,
      recipe: {
        inputs: [{ resourceType: 'Plastic Pellets', quantity: 10 }],
        outputs: [{ resourceType: 'Plastic Parts', quantity: 5 }],
        processingTime: 10
      }
    },
    {
      name: 'Metal Press',
      cost: 600,
      recipe: {
        inputs: [{ resourceType: 'Metal Scraps', quantity: 8 }],
        outputs: [{ resourceType: 'Metal Frames', quantity: 4 }],
        processingTime: 12
      }
    },
    {
      name: 'Toy Assembler',
      cost: 800,
      recipe: {
        inputs: [
          { resourceType: 'Plastic Parts', quantity: 3 },
          { resourceType: 'Metal Frames', quantity: 1 }
        ],
        outputs: [{ resourceType: 'Toy Car', quantity: 1 }],
        processingTime: 8
      }
    },
    {
      name: 'Robot Assembler',
      cost: 900,
      recipe: {
        inputs: [
          { resourceType: 'Plastic Parts', quantity: 2 },
          { resourceType: 'Metal Frames', quantity: 2 }
        ],
        outputs: [{ resourceType: 'Toy Robot', quantity: 1 }],
        processingTime: 10
      }
    }
  ],
  workerCost: 100
}
```

### Progression System

- Each level increases complexity:
  - More objectives (up to 5 finished goods)
  - More facility types available
  - Higher starting capital but also higher costs
  - More intermediate production steps required

## Implementation Priority

### Phase 1: Core Engine

1. Set up React + TypeScript + Vite project
1. Implement Zustand store for game state
1. Build production simulation engine (resource flow, facility processing)
1. Worker assignment logic
1. Timer and event trigger system

### Phase 2: Basic UI

1. Planning phase interface (simplified)
1. Production phase with basic facility visualization
1. Inventory and objectives tracking
1. End phase results screen

### Phase 3: Visual Polish

1. Side-view detailed factory graphics
1. Resource flow animations
1. Worker movement animations
1. Event notification system with visual feedback
1. Responsive layout and mobile considerations

### Phase 4: Game Balance & Content

1. Implement Levels 1-5 with increasing difficulty
1. Tune economic balance (prices, costs, scoring)
1. Add upgrade system to facilities
1. Polish event timing and impact

## Success Criteria

- Player can complete a full 5-minute level from planning to scoring
- Events trigger correctly and update objectives visibly
- Worker assignment is intuitive and responsive
- Visual feedback clearly shows production status
- Scoring system rewards both profit and target fulfillment
- Game is engaging and requires strategic planning

## File Structure Suggestion

```
/src
  /components
    /planning
      ResourceShop.tsx
      FacilityShop.tsx
      WorkerShop.tsx
    /production
      FactoryFloor.tsx
      Facility.tsx
      WorkerAvatar.tsx
      ResourceFlow.tsx
      InventoryPanel.tsx
      ObjectivesTracker.tsx
      Timer.tsx
    /end
      ResultsScreen.tsx
    /shared
      Button.tsx
      Modal.tsx
  /store
    gameStore.ts
  /engine
    productionEngine.ts
    eventEngine.ts
  /data
    levels.ts
    facilities.ts
    resources.ts
  /types
    game.types.ts
  /utils
    scoring.ts
    economics.ts
  App.tsx
  main.tsx
```

-----

Would you like me to refine any specific aspect of this specification before you give it to Claude Code?​​​​​​​​​​​​​​​​
