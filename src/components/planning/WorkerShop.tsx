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
      <h3 className="text-sm font-medium text-primary-500 mb-4">Workers</h3>
      <div className="p-4 rounded-lg border border-primary-100">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-sm font-medium text-primary-900">Hire Workers</div>
            <div className="text-xs text-primary-500 mt-0.5">
              Total: {totalWorkers} · Available: {availableWorkers}
            </div>
          </div>
          <div className="text-lg font-semibold text-primary-900 font-mono">
            ${workerCost}
          </div>
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
