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
      <h3 className="text-xl font-bold mb-3">Resource Shop</h3>
      <div className="space-y-2">
        {levelDefinition.availableResources.map((resource) => {
          const currentQuantity = quantities[resource.type] || 10;
          const totalCost = resource.cost * currentQuantity;
          const owned = inventory[resource.type] || 0;

          return (
            <div
              key={resource.type}
              className="bg-gray-700 p-3 rounded flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="font-semibold text-raw-light">{resource.type}</div>
                <div className="text-sm text-gray-400">
                  ${resource.cost} each | Owned: {owned}
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
                  className="w-16 px-2 py-1 bg-gray-800 rounded text-center"
                />
                <Button
                  variant="secondary"
                  onClick={() => handlePurchase(resource.type, resource.cost)}
                  disabled={money < totalCost}
                >
                  Buy ${totalCost}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
