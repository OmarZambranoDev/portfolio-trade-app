import { useEffect } from 'react';
import { ToastProvider } from '@OmarZambranoDev/portfolio-ui';
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
    const interval = setInterval(() => updatePrices(), 1000 + Math.random() * 1000);
    return () => clearInterval(interval);
  }, [dataLoaded, updatePrices]);

  if (!dataLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-b from-earth-stone/20 via-white to-earth-sand/20">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-earth-moss">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="h-full">{isMobile ? <MobileLayout /> : <DesktopLayout />}</div>
    </ToastProvider>
  );
}
