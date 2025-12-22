import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Button } from '../shared/Button';

export const WorkerShop: React.FC = () => {
  const { levelDefinition, money, totalWorkers, availableWorkers, purchaseWorker } =
    useGameStore();

  if (!levelDefinition) return null;

  const workerCost = levelDefinition.workerCost;

  return (
    <div className="panel">
      <h3 className="text-xl font-bold mb-3">Worker Shop</h3>
      <div className="bg-gray-700 p-4 rounded">
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-lg font-semibold">Hire Workers</div>
            <div className="text-sm text-gray-400">
              Total: {totalWorkers} | Available: {availableWorkers}
            </div>
          </div>
          <div className="text-2xl font-bold">${workerCost}</div>
        </div>
        <Button
          onClick={purchaseWorker}
          disabled={money < workerCost}
          className="w-full"
        >
          Hire Worker
        </Button>
      </div>
    </div>
  );
};
