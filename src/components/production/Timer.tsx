import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const Timer: React.FC = () => {
  const { productionTimer } = useGameStore();

  const minutes = Math.floor(productionTimer / 60);
  const seconds = Math.floor(productionTimer % 60);

  const isLowTime = productionTimer < 60;

  return (
    <div className="panel">
      <h3 className="text-lg font-semibold mb-2 text-center">Time Remaining</h3>
      <div
        className={`text-5xl font-bold text-center ${
          isLowTime ? 'text-red-500 animate-pulse' : 'text-blue-400'
        }`}
      >
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
    </div>
  );
};
