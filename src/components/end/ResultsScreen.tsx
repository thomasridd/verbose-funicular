import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { Button } from '../shared/Button';

export const ResultsScreen: React.FC = () => {
  const { results, money, nextLevel, currentLevel } = useGameStore();

  if (!results) return null;

  const hasNextLevel = currentLevel < 2; // We have 2 levels

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="panel mb-6">
        <h2 className="text-3xl font-bold text-center mb-6">Level Complete!</h2>

        {/* Objectives Results */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3">Objective Results</h3>
          <div className="space-y-2">
            {results.objectiveResults.map((obj) => (
              <div
                key={obj.resourceType}
                className="bg-gray-700 p-3 rounded flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold">{obj.resourceType}</div>
                  <div className="text-sm text-gray-400">
                    Produced: {obj.produced} / {obj.target} (
                    {(obj.fulfillmentPercentage * 100).toFixed(1)}%)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">
                    ${obj.revenue.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="text-lg font-bold mb-2 text-green-400">Revenue</h3>
            <div className="text-2xl font-bold">${results.revenue.toFixed(2)}</div>
          </div>
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="text-lg font-bold mb-2 text-red-400">Costs</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Resources:</span>
                <span>${results.costs.resources.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Facilities:</span>
                <span>${results.costs.facilities.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Workers:</span>
                <span>${results.costs.workers.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Upgrades:</span>
                <span>${results.costs.upgrades.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-600 pt-1 mt-1 flex justify-between font-bold">
                <span>Total:</span>
                <span>
                  $
                  {(
                    results.costs.resources +
                    results.costs.facilities +
                    results.costs.workers +
                    results.costs.upgrades
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-3 mb-6">
          <div className="bg-gray-700 p-4 rounded flex justify-between items-center">
            <span className="text-lg font-semibold">Profit</span>
            <span
              className={`text-2xl font-bold ${
                results.profit >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              ${results.profit.toFixed(2)}
            </span>
          </div>
          <div className="bg-gray-700 p-4 rounded flex justify-between items-center">
            <span className="text-lg font-semibold">Target Fulfillment</span>
            <span className="text-2xl font-bold text-blue-400">
              {(results.targetFulfillment * 100).toFixed(1)}%
            </span>
          </div>
          <div className="bg-gray-700 p-4 rounded flex justify-between items-center">
            <span className="text-lg font-semibold">Combined Score</span>
            <span className="text-2xl font-bold text-yellow-400">
              {results.combinedScore.toFixed(0)}
            </span>
          </div>
          <div className="bg-green-800 p-4 rounded flex justify-between items-center">
            <span className="text-lg font-semibold">Capital Boost</span>
            <span className="text-2xl font-bold text-green-300">
              +${results.capitalBoost.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Current Money */}
        <div className="bg-blue-800 p-4 rounded mb-6">
          <div className="text-center">
            <div className="text-lg text-blue-200">Total Money Available</div>
            <div className="text-3xl font-bold text-blue-100">
              ${money.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Next Level Button */}
        {hasNextLevel ? (
          <Button onClick={nextLevel} className="w-full text-xl py-4">
            Next Level →
          </Button>
        ) : (
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-2">
              Congratulations! You completed all levels!
            </div>
            <p className="text-gray-400">More levels coming soon...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
