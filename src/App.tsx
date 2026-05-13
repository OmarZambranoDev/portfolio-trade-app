import { useEffect } from 'react';
import { useTradeStore } from './store/tradeStore';
import { useIsMobile } from './hooks/useIsMobile';
import { DesktopLayout } from './components/desktop';
import { MobileLayout } from './components/mobile';

export default function App() {
  const { fetchAndSeedData, dataLoaded, updatePrices } = useTradeStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchAndSeedData();
  }, [fetchAndSeedData]);

  useEffect(() => {
    if (!dataLoaded) return;
    const interval = setInterval(
      () => updatePrices(),
      1000 + Math.random() * 1000
    );
    return () => clearInterval(interval);
  }, [dataLoaded, updatePrices]);

  if (!dataLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-earth-50">
        <p className="text-earth-600 text-lg">Loading market data...</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </div>
  );
}
