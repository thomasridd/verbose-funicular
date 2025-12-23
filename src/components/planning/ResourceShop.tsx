import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Button } from '../shared/Button';

export const ResourceShop: React.FC = () => {
  const { levelDefinition, money, purchaseResource, inventory } = useGameStore();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  if (!levelDefinition) return null;

  const handlePurchase = (resourceType: string, cost: number) => {
    const quantity = quantities[resourceType] || 10;
    const totalCost = cost * quantity;

    if (money >= totalCost) {
      purchaseResource(resourceType, quantity);
    }
  };

  return (
    <div className="panel">
      <h3 className="text-sm font-medium text-primary-500 mb-4">Resources</h3>
      <div className="space-y-2">
        {levelDefinition.availableResources.map((resource) => {
          const currentQuantity = quantities[resource.type] || 10;
          const totalCost = resource.cost * currentQuantity;
          const owned = inventory[resource.type] || 0;

          return (
            <div
              key={resource.type}
              className="flex items-center justify-between gap-4 p-3 rounded-lg border border-primary-100 hover:border-primary-200 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-primary-900 truncate">
                  {resource.type}
                </div>
                <div className="text-xs text-primary-500 mt-0.5">
                  ${resource.cost} each · Stock: {owned}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={currentQuantity}
                  onChange={(e) =>
                    setQuantities({
                      ...quantities,
                      [resource.type]: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-16 px-2 py-1.5 text-xs border border-primary-200 rounded-md text-center font-mono
                             focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                <Button
                  variant="secondary"
                  onClick={() => handlePurchase(resource.type, resource.cost)}
                  disabled={money < totalCost}
                  className="text-xs px-3 py-1.5 font-mono"
                >
                  ${totalCost}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
