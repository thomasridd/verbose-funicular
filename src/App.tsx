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
    <div className="min-h-screen p-4">
      {/* Header */}
      <header className="mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Factory Strategy Game</h1>
          <div className="flex gap-6 items-center">
            <div className="text-xl">
              <span className="text-gray-400">Level:</span>{' '}
              <span className="font-bold">{currentLevel}</span>
            </div>
            <div className="text-xl">
              <span className="text-gray-400">Money:</span>{' '}
              <span className="font-bold text-green-400">${money.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Event Notifications */}
      <AnimatePresence>
        {eventNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-600 text-white px-6 py-4 rounded-lg shadow-2xl text-xl font-bold"
          >
            {eventNotification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {phase === 'PLANNING' && (
          <div className="space-y-6">
            <div className="panel">
              <h2 className="text-2xl font-bold mb-4">Planning Phase</h2>
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

            <div className="flex justify-center">
              <Button onClick={startProduction} className="text-2xl px-12 py-6">
                START PRODUCTION
              </Button>
            </div>
          </div>
        )}

        {phase === 'PRODUCTION' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Timer />
              <ObjectivesTracker />
              <InventoryPanel />
            </div>

            <FactoryFloor />

            {/* Quick Purchase Panel */}
            <div className="panel">
              <h3 className="text-xl font-bold mb-3">Quick Purchase</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Resources</h4>
                  {levelDefinition.availableResources.map((resource) => (
                    <Button
                      key={resource.type}
                      variant="secondary"
                      onClick={() => purchaseResource(resource.type, 10)}
                      disabled={money < resource.cost * 10}
                      className="w-full text-sm"
                    >
                      Buy 10x {resource.type} (${resource.cost * 10})
                    </Button>
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Workers</h4>
                  <Button
                    variant="secondary"
                    onClick={purchaseWorker}
                    disabled={money < levelDefinition.workerCost}
                    className="w-full"
                  >
                    Hire Worker (${levelDefinition.workerCost}) - Available:{' '}
                    {availableWorkers}
                  </Button>
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
