import { CardContent } from '@OmarZambranoDev/portfolio-ui';
import { useTradeStore } from '../../store/tradeStore';
import { ScrollArea } from './ScrollArea';

export function MiniPortfolio() {
  const { portfolio, stocks, cashBalance } = useTradeStore();

  const totalValue = portfolio.reduce((sum, holding) => {
    const stock = stocks[holding.symbol];
    return sum + (stock?.currentPrice ?? 0) * holding.quantity;
  }, 0);

  const totalCost = portfolio.reduce(
    (sum, holding) => sum + holding.avgCost * holding.quantity,
    0
  );

  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
  const isPositive = totalGain >= 0;

  return (
    <CardContent className="flex flex-col flex-1 min-h-0 p-3 space-y-2">
      <p className="text-xs font-semibold text-earth-forest uppercase tracking-wider flex-shrink-0">
        Portfolio
      </p>

      <div className="space-y-1 flex-shrink-0">
        <div className="flex justify-between items-center">
          <span className="text-sm text-earth-moss">Total Value</span>
          <span className="text-sm font-semibold text-earth-forest">
            ${totalValue.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-earth-moss">Cash Balance</span>
          <span className="text-sm font-medium text-earth-forest">
            ${cashBalance.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-earth-moss">Total P/L</span>
          <span
            className={`text-sm font-semibold ${
              isPositive ? 'text-earth-forest' : 'text-danger'
            }`}
          >
            {isPositive ? '+' : ''}
            ${totalGain.toFixed(2)} ({isPositive ? '+' : ''}
            {totalGainPercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      {portfolio.length > 0 && (
        <div className="pt-2 border-t border-earth-stone/20 flex-1 flex flex-col min-h-0">
          <p className="text-xs font-semibold text-earth-sage uppercase tracking-wider mb-2 flex-shrink-0">
            Positions
          </p>
          <ScrollArea className="flex-1 min-h-0">
            <div className="space-y-1.5 pr-1">
              {portfolio.map((holding) => {
                const stock = stocks[holding.symbol];
                const currentPrice = stock?.currentPrice ?? 0;
                const value = currentPrice * holding.quantity;
                const gain = value - holding.avgCost * holding.quantity;
                const gainPercent =
                  holding.avgCost > 0
                    ? (gain / (holding.avgCost * holding.quantity)) * 100
                    : 0;

                return (
                  <div
                    key={holding.symbol}
                    className="bg-white rounded-lg border border-earth-stone/20 p-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-earth-forest">
                        {holding.symbol}
                      </span>
                      <span className="text-sm text-earth-forest font-medium">
                        ${currentPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-0.5">
                      <span className="text-xs text-earth-moss">
                        {holding.quantity} shares
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          gain >= 0 ? 'text-earth-forest' : 'text-danger'
                        }`}
                      >
                        {gain >= 0 ? '+' : ''}
                        {gainPercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
    </CardContent>
  );
}
