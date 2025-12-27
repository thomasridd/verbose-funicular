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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-3xl mx-auto"
    >
      <div className="panel">
        <div className="text-center mb-8">
          <div className="text-2xl font-semibold text-primary-900 mb-1">Level Complete</div>
          <div className="text-sm text-primary-500">Level {currentLevel}</div>
        </div>

        {/* Objectives Results */}
        <div className="mb-6">
          <div className="text-xs font-medium text-primary-500 mb-3">Objectives</div>
          <div className="space-y-2">
            {results.objectiveResults.map((obj) => (
              <div
                key={obj.resourceType}
                className="flex justify-between items-center p-3 rounded-lg border border-primary-100"
              >
                <div>
                  <div className="text-sm font-medium text-primary-900">{obj.resourceType}</div>
                  <div className="text-xs text-primary-500 mt-0.5">
                    {obj.produced} / {obj.target} ({(obj.fulfillmentPercentage * 100).toFixed(0)}%)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-success font-mono">
                    ${obj.revenue.toFixed(0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="mb-6">
          <div className="text-xs font-medium text-primary-500 mb-3">Financial Summary</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 rounded-lg border border-primary-100">
              <span className="text-sm text-primary-600">Revenue</span>
              <span className="text-sm font-semibold text-success font-mono">
                ${results.revenue.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg border border-primary-100">
              <span className="text-sm text-primary-600">Costs</span>
              <span className="text-sm font-semibold text-danger font-mono">
                -$
                {(
                  results.costs.resources +
                  results.costs.facilities +
                  results.costs.workers +
                  results.costs.upgrades
                ).toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-primary-50 border border-primary-200">
              <span className="text-sm font-medium text-primary-900">Profit</span>
              <span
                className={`text-lg font-semibold font-mono ${
                  results.profit >= 0 ? 'text-success' : 'text-danger'
                }`}
              >
                ${results.profit.toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border border-primary-100 text-center">
            <div className="text-xs text-primary-500 mb-1">Target Fulfillment</div>
            <div className="text-xl font-semibold text-primary-900">
              {(results.targetFulfillment * 100).toFixed(0)}%
            </div>
          </div>
          <div className="p-3 rounded-lg border border-primary-100 text-center">
            <div className="text-xs text-primary-500 mb-1">Score</div>
            <div className="text-xl font-semibold text-primary-900">
              {results.combinedScore.toFixed(0)}
            </div>
          </div>
        </div>

        {/* Capital Summary */}
        <div className="mb-6 p-4 rounded-lg bg-success-light/10 border border-success-light/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-primary-600">Capital Boost</span>
            <span className="text-lg font-semibold text-success font-mono">
              +${results.capitalBoost.toFixed(0)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-primary-900">Total Capital</span>
            <span className="text-2xl font-semibold text-primary-900 font-mono">
              ${money.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Next Level Button */}
        {hasNextLevel ? (
          <Button onClick={nextLevel} className="w-full">
            Continue to Level {currentLevel + 1}
          </Button>
        ) : (
          <div className="text-center p-6">
            <div className="text-lg font-semibold text-primary-900 mb-1">
              All Levels Complete
            </div>
            <p className="text-sm text-primary-500">More levels coming soon</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
