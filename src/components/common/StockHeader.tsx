import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTradeStore } from '../../store/tradeStore';

export function StockHeader() {
  const { selectedStock, stocks } = useTradeStore();

  if (!selectedStock || !stocks[selectedStock]) {
    return (
      <div className="p-4 border-b border-earth-stone/30 bg-white">
        <p className="text-earth-moss">Select a stock from the watchlist</p>
      </div>
    );
  }

  const stock = stocks[selectedStock];
  const isPositive = stock.change >= 0;

  return (
    <div className="p-4 border-b border-earth-stone/30 bg-white">
      <div className="flex items-baseline gap-3">
        <h2 className="text-xl font-bold text-earth-forest">{stock.symbol}</h2>
        <span className="text-sm text-earth-moss">{stock.companyName}</span>
        {stock.sector && (
          <span className="text-xs px-2 py-0.5 bg-earth-stone/20 text-earth-moss rounded">
            {stock.sector}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-3 mt-1">
        <span className="text-2xl font-bold text-earth-forest">
          ${stock.currentPrice.toFixed(2)}
        </span>
        <div className="flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-earth-forest" />
          ) : (
            <TrendingDown className="w-4 h-4 text-danger" />
          )}
          <span
            className={`text-sm font-semibold ${
              isPositive ? 'text-earth-forest' : 'text-danger'
            }`}
          >
            {isPositive ? '+' : ''}
            {stock.change.toFixed(2)} ({isPositive ? '+' : ''}
            {stock.changePercent.toFixed(2)}%)
          </span>
        </div>
        <span className="text-xs text-earth-moss">
          Vol: {(stock.volume / 1000000).toFixed(1)}M
        </span>
      </div>
    </div>
  );
}
