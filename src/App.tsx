import { useEffect, useRef, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { Button } from './components/shared/Button';

// Planning Phase Components
import { ResourceShop } from './components/planning/ResourceShop';
import { FacilityShop } from './components/planning/FacilityShop';
import { WorkerShop } from './components/planning/WorkerShop';

// Production Phase Components
import { FactoryFloor } from './components/production/FactoryFloor';
import { Timer } from './components/production/Timer';
import { InventoryPanel } from './components/production/InventoryPanel';
import { ObjectivesTracker } from './components/production/ObjectivesTracker';

// End Phase Components
import { ResultsScreen } from './components/end/ResultsScreen';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const {
    phase,
    currentLevel,
    money,
    startLevel,
    startProduction,
    tick,
    isProducing,
    triggeredEvents,
    levelDefinition,
    purchaseResource,
    purchaseWorker,
    availableWorkers,
  } = useGameStore();

  const [eventNotification, setEventNotification] = useState<string | null>(null);
  const lastEventCountRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(Date.now());

  // Initialize game
  useEffect(() => {
    startLevel(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Game loop
  useEffect(() => {
    if (!isProducing) return;

    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = (now - lastTimeRef.current) / 1000; // Convert to seconds
      lastTimeRef.current = now;

      tick(deltaTime);
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    lastTimeRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isProducing, tick]);

  // Event notifications
  useEffect(() => {
    if (triggeredEvents.length > lastEventCountRef.current) {
      const latestEvent = triggeredEvents[triggeredEvents.length - 1];
      let message = '';

      if (latestEvent.type === 'DEMAND_SHIFT_ALL') {
        message = '⚠️ Market Shift! All demands changed by ±20%';
      } else if (latestEvent.type === 'DEMAND_SHIFT_SELECTIVE') {
        message = '🔥 Demand Spike! Some products demand increased by 50-100%!';
      }

      setEventNotification(message);
      setTimeout(() => setEventNotification(null), 5000);
    }
    lastEventCountRef.current = triggeredEvents.length;
  }, [triggeredEvents]);

  if (!levelDefinition) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <header className="bg-white border-b border-primary-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-primary-900">Factory</h1>
          <div className="flex gap-8 items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="text-primary-500 font-medium">Level</span>
              <span className="font-semibold text-primary-900">{currentLevel}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary-500 font-medium">Capital</span>
              <span className="font-semibold text-primary-900 font-mono">
                ${money.toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Event Notifications */}
      <AnimatePresence>
        {eventNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50
                       bg-warning text-white px-6 py-3 rounded-lg shadow-lg text-sm font-medium"
          >
            {eventNotification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {phase === 'PLANNING' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-medium text-primary-500 mb-4">Planning Phase</h2>
              <ObjectivesTracker />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <ResourceShop />
                <WorkerShop />
              </div>
              <FacilityShop />
            </div>

            <FactoryFloor />

            <div className="flex justify-center pt-4">
              <Button onClick={startProduction} className="px-8 py-3">
                Start Production
              </Button>
            </div>
          </div>
        )}

        {phase === 'PRODUCTION' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Timer />
              <ObjectivesTracker />
              <InventoryPanel />
            </div>

            <FactoryFloor />

            {/* Quick Purchase Panel */}
            <div className="panel">
              <h3 className="text-sm font-medium text-primary-500 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-xs font-medium text-primary-600 mb-2">Resources</div>
                  {levelDefinition.availableResources.map((resource) => (
                    <Button
                      key={resource.type}
                      variant="secondary"
                      onClick={() => purchaseResource(resource.type, 10)}
                      disabled={money < resource.cost * 10}
                      className="w-full text-xs justify-between"
                    >
                      <span>{resource.type} × 10</span>
                      <span className="font-mono">${resource.cost * 10}</span>
                    </Button>
                  ))}
                </div>
                <div>
                  <div className="text-xs font-medium text-primary-600 mb-2">Workers</div>
                  <Button
                    variant="secondary"
                    onClick={purchaseWorker}
                    disabled={money < levelDefinition.workerCost}
                    className="w-full text-xs justify-between"
                  >
                    <span>Hire Worker</span>
                    <span className="font-mono">${levelDefinition.workerCost}</span>
                  </Button>
                  <div className="text-xs text-primary-500 mt-2">
                    Available: {availableWorkers}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === 'END' && <ResultsScreen />}
      </main>
    </div>
  );
}

export default App;
