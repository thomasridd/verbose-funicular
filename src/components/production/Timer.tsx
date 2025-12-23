import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const Timer: React.FC = () => {
  const { productionTimer } = useGameStore();

  const minutes = Math.floor(productionTimer / 60);
  const seconds = Math.floor(productionTimer % 60);

  const isLowTime = productionTimer < 60;

  return (
    <div className="panel text-center">
      <div className="text-xs font-medium text-primary-500 mb-2">Time Remaining</div>
      <div
        className={`text-4xl font-semibold font-mono tabular-nums ${
          isLowTime ? 'text-danger animate-pulse' : 'text-primary-900'
        }`}
      >
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
    </div>
  );
};
