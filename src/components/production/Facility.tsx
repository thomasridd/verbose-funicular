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
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="panel min-w-[260px] hover:border-accent transition-all"
    >
      <div className="mb-3">
        <h4 className="font-medium text-sm text-primary-900">{facility.definition.name}</h4>
        <div className="text-xs text-primary-500 mt-0.5">{facility.definition.type}</div>
      </div>

      {/* Production Progress */}
      <div className="mb-3">
        <div className="text-xs text-primary-500 mb-1.5">Progress</div>
        <div className="w-full bg-primary-100 rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-accent"
            style={{ width: `${facility.productionProgress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Recipe Info */}
      <div className="text-xs mb-3 space-y-1 text-primary-600">
        <div>
          <span className="font-medium">In:</span>{' '}
          {facility.definition.recipe.inputs
            .map((i) => `${i.quantity}× ${i.resourceType}`)
            .join(', ')}
        </div>
        <div>
          <span className="font-medium">Out:</span>{' '}
          {facility.definition.recipe.outputs
            .map((o) => `${o.quantity}× ${o.resourceType}`)
            .join(', ')}
        </div>
      </div>

      {/* Workers */}
      <div className="mb-3">
        <div className="text-xs text-primary-500 mb-2">
          Workers: {facility.assignedWorkers} / {facility.definition.workerCapacity}
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => handleWorkerChange(-1)}
            disabled={!canRemoveWorker}
            className="flex-1 px-2 py-1.5 bg-white hover:bg-primary-50 border border-primary-200
                       disabled:opacity-30 disabled:cursor-not-allowed rounded text-xs font-medium
                       transition-colors active:scale-95"
          >
            −
          </button>
          <button
            onClick={() => handleWorkerChange(1)}
            disabled={!canAddWorker}
            className="flex-1 px-2 py-1.5 bg-white hover:bg-primary-50 border border-primary-200
                       disabled:opacity-30 disabled:cursor-not-allowed rounded text-xs font-medium
                       transition-colors active:scale-95"
          >
            +
          </button>
        </div>
      </div>

      {/* Upgrades */}
      {phase === 'PRODUCTION' && facility.definition.upgradeOptions.length > 0 && (
        <div>
          <div className="text-xs text-primary-500 mb-2">Upgrades</div>
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
                  className="w-full px-2 py-1.5 bg-white hover:bg-primary-50 border border-primary-200
                             disabled:opacity-30 disabled:cursor-not-allowed rounded text-xs text-left
                             transition-colors flex justify-between items-center"
                >
                  <span>{upgrade.name}</span>
                  <span className="font-mono text-primary-600">
                    ${upgrade.cost} {hasUpgrade && '✓'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};
