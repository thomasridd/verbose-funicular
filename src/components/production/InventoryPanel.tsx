import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { ResourceCategory } from '../../types/game.types';

const getCategoryColor = (category: ResourceCategory) => {
  switch (category) {
    case 'RAW':
      return 'bg-raw';
    case 'INTERMEDIATE':
      return 'bg-intermediate';
    case 'FINISHED':
      return 'bg-finished';
    default:
      return 'bg-gray-600';
  }
};

export const InventoryPanel: React.FC = () => {
  const { inventory, levelDefinition } = useGameStore();

  if (!levelDefinition) return null;

  // Collect all resource types
  const allResourceTypes = new Set<string>();
  levelDefinition.availableResources.forEach((r) => allResourceTypes.add(r.type));
  levelDefinition.availableFacilities.forEach((f) => {
    f.recipe.inputs.forEach((i) => allResourceTypes.add(i.resourceType));
    f.recipe.outputs.forEach((o) => allResourceTypes.add(o.resourceType));
  });

  const getCategoryForResource = (resourceType: string): ResourceCategory => {
    const resource = levelDefinition.availableResources.find(
      (r) => r.type === resourceType
    );
    if (resource) return resource.category;

    // Check if it's a finished good
    if (levelDefinition.objectives.some((o) => o.resourceType === resourceType)) {
      return 'FINISHED';
    }

    return 'INTERMEDIATE';
  };

  const resourceList = Array.from(allResourceTypes)
    .map((type) => ({
      type,
      quantity: inventory[type] || 0,
      category: getCategoryForResource(type),
    }))
    .sort((a, b) => {
      // Sort by category, then by name
      if (a.category !== b.category) {
        const order = { RAW: 0, INTERMEDIATE: 1, FINISHED: 2 };
        return order[a.category] - order[b.category];
      }
      return a.type.localeCompare(b.type);
    });

  return (
    <div className="panel max-h-96 overflow-y-auto">
      <h3 className="text-xl font-bold mb-3">Inventory</h3>
      <div className="space-y-1">
        {resourceList.map((resource) => (
          <div
            key={resource.type}
            className="flex justify-between items-center py-2 px-3 bg-gray-700 rounded"
          >
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getCategoryColor(resource.category)}`} />
              <span className="text-sm">{resource.type}</span>
            </div>
            <span className="font-bold">{resource.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
