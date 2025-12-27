import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Facility } from './Facility';
import { motion } from 'framer-motion';

export const FactoryFloor: React.FC = () => {
  const { placedFacilities } = useGameStore();

  if (placedFacilities.length === 0) {
    return (
      <div className="panel min-h-[200px] flex items-center justify-center">
        <p className="text-sm text-primary-400">
          No facilities yet. Purchase facilities to begin production.
        </p>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="text-xs font-medium text-primary-500 mb-4">Production Line</div>
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3 min-w-min">
          {placedFacilities.map((facility, index) => (
            <div key={facility.instanceId} className="relative">
              <Facility facility={facility} />
              {index < placedFacilities.length - 1 && (
                <motion.div
                  className="absolute top-1/2 -right-3 w-6 flex items-center z-10"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-full h-px bg-accent" />
                  <div className="w-1.5 h-1.5 bg-accent rounded-full -ml-0.5" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
