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
      <h3 className="text-sm font-medium text-primary-500 mb-4">Facilities</h3>
      <div className="space-y-3">
        {levelDefinition.availableFacilities.map((facility) => {
          const owned = placedFacilities.filter(
            (f) => f.facilityId === facility.id
          ).length;

          return (
            <div
              key={facility.id}
              className="p-4 rounded-lg border border-primary-100 hover:border-primary-200 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-medium text-primary-900">{facility.name}</div>
                  <div className="text-xs text-primary-500 mt-0.5">
                    {facility.type} · Owned: {owned}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => handlePurchase(facility)}
                  disabled={money < facility.cost}
                  className="text-xs px-3 py-1.5 font-mono"
                >
                  ${facility.cost}
                </Button>
              </div>
              <div className="text-xs space-y-1.5 text-primary-600">
                <div>
                  <span className="font-medium">In:</span>{' '}
                  {facility.recipe.inputs
                    .map((i) => `${i.quantity}× ${i.resourceType}`)
                    .join(', ')}
                </div>
                <div>
                  <span className="font-medium">Out:</span>{' '}
                  {facility.recipe.outputs
                    .map((o) => `${o.quantity}× ${o.resourceType}`)
                    .join(', ')}
                </div>
                <div className="text-primary-500">
                  {facility.recipe.processingTime}s · Max {facility.workerCapacity} workers
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
