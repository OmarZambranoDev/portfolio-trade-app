import { useTradeStore } from '../../store/tradeStore';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export function TradeHistoryTable() {
  const { tradeHistory, selectedStock } = useTradeStore();

  const filteredTrades = selectedStock
    ? tradeHistory.filter((t) => t.symbol === selectedStock)
    : tradeHistory;

  if (filteredTrades.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-earth-stone/30 p-4 h-full">
        <p className="text-xs font-semibold text-earth-sage uppercase tracking-wider mb-3">
          Trade History
        </p>
        <p className="text-sm text-earth-moss text-center py-4">
          No trades yet. Buy or sell a stock to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-earth-stone/30 flex flex-col h-full">
      <div className="p-4 pb-2 flex-shrink-0">
        <p className="text-xs font-semibold text-earth-forest uppercase tracking-wider">
          Trade History {selectedStock && `— ${selectedStock}`}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b border-earth-stone/20">
              <th className="text-left py-2 px-4 text-earth-moss font-medium">Action</th>
              <th className="text-left py-2 text-earth-moss font-medium">Symbol</th>
              <th className="text-right py-2 text-earth-moss font-medium">Qty</th>
              <th className="text-right py-2 text-earth-moss font-medium">Price</th>
              <th className="text-right py-2 text-earth-moss font-medium">Total</th>
              <th className="text-right py-2 px-4 text-earth-moss font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.map((trade) => (
              <tr key={trade.id} className="border-b border-earth-stone/10 last:border-0">
                <td className="py-2 px-4">
                  <div className="flex items-center gap-1">
                    {trade.action === 'buy' ? (
                      <ArrowUpCircle className="w-4 h-4 text-earth-forest" />
                    ) : (
                      <ArrowDownCircle className="w-4 h-4 text-danger" />
                    )}
                    <span
                      className={`font-medium ${
                        trade.action === 'buy' ? 'text-earth-forest' : 'text-danger'
                      }`}
                    >
                      {trade.action.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="py-2 text-earth-forest font-medium">{trade.symbol}</td>
                <td className="py-2 text-right text-earth-moss">{trade.quantity}</td>
                <td className="py-2 text-right text-earth-moss">
                  ${trade.price.toFixed(2)}
                </td>
                <td className="py-2 text-right text-earth-forest font-medium">
                  ${(trade.price * trade.quantity).toFixed(2)}
                </td>
                <td className="py-2 px-4 text-right text-earth-moss text-xs">
                  {new Date(trade.timestamp).toLocaleDateString()}{' '}
                  {new Date(trade.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
