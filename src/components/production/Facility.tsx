import React from 'react';
import { motion } from 'framer-motion';
import { PlacedFacility } from '../../types/game.types';
import { useGameStore } from '../../store/gameStore';

interface FacilityProps {
  facility: PlacedFacility;
}

export const Facility: React.FC<FacilityProps> = ({ facility }) => {
  const { assignWorkers, availableWorkers, phase, purchaseUpgrade, money } =
    useGameStore();

  const handleWorkerChange = (delta: number) => {
    const newCount = facility.assignedWorkers + delta;
    if (newCount >= 0 && newCount <= facility.definition.workerCapacity) {
      assignWorkers(facility.instanceId, newCount);
    }
  };

  const canAddWorker =
    availableWorkers > 0 &&
    facility.assignedWorkers < facility.definition.workerCapacity;
  const canRemoveWorker = facility.assignedWorkers > 0;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="panel min-w-[280px] hover:border-blue-500 transition-all"
    >
      <div className="mb-3">
        <h4 className="font-bold text-lg">{facility.definition.name}</h4>
        <div className="text-xs text-gray-400">{facility.definition.type}</div>
      </div>

      {/* Production Progress */}
      <div className="mb-3">
        <div className="text-xs text-gray-400 mb-1">Production Progress</div>
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-blue-500 animate-process"
            style={{ width: `${facility.productionProgress * 100}%` }}
          />
        </div>
      </div>

      {/* Recipe Info */}
      <div className="text-xs mb-3 space-y-1">
        <div>
          <span className="text-gray-400">In:</span>{' '}
          {facility.definition.recipe.inputs
            .map((i) => `${i.quantity}x ${i.resourceType}`)
            .join(', ')}
        </div>
        <div>
          <span className="text-gray-400">Out:</span>{' '}
          {facility.definition.recipe.outputs
            .map((o) => `${o.quantity}x ${o.resourceType}`)
            .join(', ')}
        </div>
      </div>

      {/* Workers */}
      <div className="mb-3">
        <div className="text-sm font-semibold mb-1">
          Workers: {facility.assignedWorkers} / {facility.definition.workerCapacity}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleWorkerChange(-1)}
            disabled={!canRemoveWorker}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed rounded text-sm"
          >
            -
          </button>
          <button
            onClick={() => handleWorkerChange(1)}
            disabled={!canAddWorker}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-30 disabled:cursor-not-allowed rounded text-sm"
          >
            +
          </button>
        </div>
      </div>

      {/* Upgrades */}
      {phase === 'PRODUCTION' && facility.definition.upgradeOptions.length > 0 && (
        <div>
          <div className="text-sm font-semibold mb-1">Upgrades</div>
          <div className="space-y-1">
            {facility.definition.upgradeOptions.map((upgrade) => {
              const hasUpgrade = facility.appliedUpgrades.some(
                (u) => u.id === upgrade.id
              );

              return (
                <button
                  key={upgrade.id}
                  onClick={() => purchaseUpgrade(facility.instanceId, upgrade)}
                  disabled={hasUpgrade || money < upgrade.cost}
                  className="w-full px-2 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed rounded text-xs text-left"
                >
                  {upgrade.name} - ${upgrade.cost}
                  {hasUpgrade && ' ✓'}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};
