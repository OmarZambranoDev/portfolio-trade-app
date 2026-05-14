import { WatchlistPanel } from './WatchlistPanel';
import { MiniPortfolio } from '../common/MiniPortfolio';
import { StockHeader } from '../common/StockHeader';
import { Chart } from '../common/Chart';
import { BuySellForm } from '../common/BuySellForm';
import { TradeHistoryTable } from '../common/TradeHistoryTable';

export function DesktopLayout() {
  return (
    <div className="h-full flex flex-row bg-gradient-to-b from-earth-stone/20 via-white to-earth-sand/20">
      {/* LEFT SIDEBAR */}
      <aside className="w-80 flex-shrink-0 border-r border-earth-stone/30 flex flex-col bg-white h-full overflow-hidden">
        <div className="flex-1 min-h-0">
          <WatchlistPanel />
        </div>
        <div className="flex-shrink-0 max-h-[45%] flex flex-col min-h-0">
          <MiniPortfolio />
        </div>
      </aside>

      {/* MAIN AREA */}
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
    </div>
  );
}
