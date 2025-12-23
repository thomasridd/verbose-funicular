import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const ObjectivesTracker: React.FC = () => {
  const { levelDefinition, inventory } = useGameStore();

  if (!levelDefinition) return null;

  return (
    <div className="panel">
      <div className="text-xs font-medium text-primary-500 mb-3">Objectives</div>
      <div className="space-y-3">
        {levelDefinition.objectives.map((objective) => {
          const current = inventory[objective.resourceType] || 0;
          const target = objective.currentTarget || objective.targetQuantity;
          const progress = Math.min((current / target) * 100, 100);
          const isOnTrack = current >= target * 0.8; // Consider on track if at 80%+

          return (
            <div key={objective.resourceType} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-primary-900">{objective.resourceType}</span>
                <span className={`font-mono ${isOnTrack ? 'text-success' : 'text-danger'}`}>
                  {current} / {target}
                </span>
              </div>
              <div className="w-full bg-primary-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isOnTrack ? 'bg-success' : 'bg-danger'
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
