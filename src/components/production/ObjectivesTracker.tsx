import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const ObjectivesTracker: React.FC = () => {
  const { levelDefinition, inventory } = useGameStore();

  if (!levelDefinition) return null;

  return (
    <div className="panel">
      <h3 className="text-xl font-bold mb-3">Objectives</h3>
      <div className="space-y-3">
        {levelDefinition.objectives.map((objective) => {
          const current = inventory[objective.resourceType] || 0;
          const target = objective.currentTarget || objective.targetQuantity;
          const progress = Math.min((current / target) * 100, 100);
          const isOnTrack = current >= target * 0.8; // Consider on track if at 80%+

          return (
            <div key={objective.resourceType} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">{objective.resourceType}</span>
                <span className={isOnTrack ? 'text-green-400' : 'text-red-400'}>
                  {current} / {target}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isOnTrack ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
