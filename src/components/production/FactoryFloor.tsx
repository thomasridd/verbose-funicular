import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Facility } from './Facility';
import { motion } from 'framer-motion';

export const FactoryFloor: React.FC = () => {
  const { placedFacilities } = useGameStore();

  if (placedFacilities.length === 0) {
    return (
      <div className="panel min-h-[300px] flex items-center justify-center">
        <p className="text-gray-400 text-lg">
          No facilities placed yet. Purchase facilities in the planning phase.
        </p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h3 className="text-xl font-bold mb-4">Factory Floor</h3>
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-min">
          {placedFacilities.map((facility, index) => (
            <div key={facility.instanceId} className="relative">
              <Facility facility={facility} />
              {index < placedFacilities.length - 1 && (
                <motion.div
                  className="absolute top-1/2 -right-4 w-8 flex items-center"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-full h-0.5 bg-blue-400" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full -ml-1" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
