import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Button } from '../shared/Button';
import { FacilityDefinition } from '../../types/game.types';

export const FacilityShop: React.FC = () => {
  const { levelDefinition, money, purchaseFacility, placedFacilities } =
    useGameStore();

  if (!levelDefinition) return null;

  const handlePurchase = (facility: FacilityDefinition) => {
    // Place at next position
    const position = placedFacilities.length;
    purchaseFacility(facility.id, position);
  };

  return (
    <div className="panel">
      <h3 className="text-xl font-bold mb-3">Facility Shop</h3>
      <div className="space-y-3">
        {levelDefinition.availableFacilities.map((facility) => {
          const owned = placedFacilities.filter(
            (f) => f.facilityId === facility.id
          ).length;

          return (
            <div
              key={facility.id}
              className="bg-gray-700 p-3 rounded hover:bg-gray-650 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-lg">{facility.name}</div>
                  <div className="text-sm text-gray-400">
                    {facility.type} | Owned: {owned}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => handlePurchase(facility)}
                  disabled={money < facility.cost}
                >
                  Buy ${facility.cost}
                </Button>
              </div>
              <div className="text-sm space-y-1">
                <div className="text-gray-300">
                  <span className="font-semibold">Inputs:</span>{' '}
                  {facility.recipe.inputs
                    .map((i) => `${i.quantity}x ${i.resourceType}`)
                    .join(', ')}
                </div>
                <div className="text-gray-300">
                  <span className="font-semibold">Outputs:</span>{' '}
                  {facility.recipe.outputs
                    .map((o) => `${o.quantity}x ${o.resourceType}`)
                    .join(', ')}
                </div>
                <div className="text-gray-400">
                  Time: {facility.recipe.processingTime}s | Workers:{' '}
                  {facility.workerCapacity} max
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
