import { useState } from 'react';
import { Card } from '@OmarZambranoDev/portfolio-ui';
import { WatchlistPanel } from './WatchlistPanel';
import { MiniPortfolio } from '../common/MiniPortfolio';
import { StockHeader } from '../common/StockHeader';
import { Chart } from '../common/Chart';
import { BuySellForm } from '../common/BuySellForm';
import { TradeHistoryTable } from '../common/TradeHistoryTable';
import { PortfolioOverview } from '../common/PortfolioOverview';
import { PositionsTable } from '../common/PositionsTable';
import { useTradeStore } from '../../store/tradeStore';

type ViewMode = 'stock' | 'portfolio';

export function DesktopLayout() {
  const [viewMode, setViewMode] = useState<ViewMode>('portfolio');
  const selectStock = useTradeStore((s) => s.selectStock);

  const handleSelectStock = (symbol: string) => {
    selectStock(symbol);
    setViewMode('stock');
  };

  const handlePortfolioClick = () => {
    selectStock(null);
    setViewMode('portfolio');
  };

  return (
    <div className="h-full flex flex-row bg-gradient-to-b from-earth-stone/20 via-white to-earth-sand/20">
      {/* LEFT SIDEBAR */}
      <aside className="w-80 flex-shrink-0 border-r border-earth-stone/30 flex flex-col bg-white h-full overflow-hidden">
        <div className="flex-1 min-h-0">
          <WatchlistPanel onSelectStock={() => setViewMode('stock')} />
        </div>
        <div className="flex-shrink-0 max-h-[45%] flex flex-col min-h-0 border-t border-earth-stone/30 bg-earth-stone/10 p-4">
          <Card
            clickable
            onClick={handlePortfolioClick}
            variant={viewMode === 'portfolio' ? 'elevated' : 'outline'}
            className={`flex-1 flex flex-col min-h-0 overflow-hidden transition-colors ${
              viewMode === 'portfolio' ? 'border-primary/50 bg-primary/10' : 'border-earth-stone/30'
            }`}
          >
            <MiniPortfolio />
          </Card>
        </div>
      </aside>

      {/* MAIN AREA */}
      {viewMode === 'stock' ? (
        <main className="flex-1 flex flex-col overflow-hidden">
          <StockHeader />
          <div className="h-96 p-4 flex-shrink-0">
            <div className="h-full bg-white rounded-lg border border-earth-stone/30 overflow-hidden">
              <Chart />
            </div>
          </div>
          <div className="flex-1 p-4 flex flex-col space-y-4 min-h-0">
            <div className="flex-shrink-0">
              <BuySellForm />
            </div>
            <div className="flex-1 min-h-0">
              <TradeHistoryTable />
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-1 flex flex-col overflow-hidden">
          <PortfolioOverview />
          <div className="flex-1 p-4 flex flex-col gap-6 min-h-0 overflow-y-auto">
            <PositionsTable onSelectStock={handleSelectStock} />
            <TradeHistoryTable />
          </div>
        </main>
      )}
    </div>
  );
}
