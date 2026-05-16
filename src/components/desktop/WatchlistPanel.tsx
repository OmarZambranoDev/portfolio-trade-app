import { Button, SearchBar, Card, CardContent } from '@OmarZambranoDev/portfolio-ui';
import { X, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useTradeStore } from '../../store/tradeStore';
import { ScrollArea } from '../common/ScrollArea';

interface WatchlistPanelProps {
  onSelectStock: () => void;
}

export function WatchlistPanel({ onSelectStock }: WatchlistPanelProps) {
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { watchlist, stocks, selectedStock, addToWatchlist, removeFromWatchlist, selectStock } =
    useTradeStore();

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const query = search.toLowerCase();

    return Object.keys(stocks)
      .filter(
        (sym) =>
          sym.toLowerCase().includes(query) || stocks[sym].companyName.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        const aStartsWith = a.toLowerCase().startsWith(query);
        const bStartsWith = b.toLowerCase().startsWith(query);

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        return a.localeCompare(b);
      })
      .slice(0, 20);
  }, [search, stocks]);

  const handleChange = (value: string) => {
    setSearch(value);
    if (value.trim()) {
      setShowResults(true);
    }
  };

  const handleSelectResult = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      addToWatchlist(symbol);
    }
    selectStock(symbol);
    onSelectStock();
    setSearch('');
    setShowResults(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-earth-stone/30 relative">
        <SearchBar
          value={search}
          onChange={handleChange}
          placeholder="Search stocks..."
          size="sm"
          variant="filled"
        />

        {/* Search Results Dropdown */}
        {showResults && search.trim() && (
          <>
            <div className="absolute left-4 right-4 top-full mt-1 bg-white border border-earth-stone/30 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
              {searchResults.length === 0 ? (
                <p className="text-sm text-earth-moss p-3 text-center">No results found</p>
              ) : (
                searchResults.map((symbol) => {
                  const stock = stocks[symbol];
                  const inWatchlist = watchlist.includes(symbol);
                  return (
                    <button
                      key={symbol}
                      onClick={() => handleSelectResult(symbol)}
                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-earth-stone/10 transition-colors text-left"
                    >
                      <div>
                        <span className="font-semibold text-earth-forest text-sm">{symbol}</span>
                        <span className="text-xs text-earth-moss ml-2">{stock?.companyName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {stock && (
                          <span className="text-xs text-earth-moss">
                            ${stock.currentPrice.toFixed(2)}
                          </span>
                        )}
                        {inWatchlist ? (
                          <span className="text-xs text-earth-sage">Added</span>
                        ) : (
                          <Plus className="w-4 h-4 text-earth-sage" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="fixed inset-0 z-10" onClick={() => setShowResults(false)} />
          </>
        )}
      </div>

      {/* Watchlist */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-4 pt-4 pb-2 flex-shrink-0">
          <p className="text-xs font-semibold text-earth-forest uppercase tracking-wider">
            Watchlist
          </p>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="px-4 pb-4 space-y-2">
            {watchlist.length === 0 ? (
              <p className="text-sm text-earth-moss py-4 text-center">
                No stocks in watchlist. Search above to add.
              </p>
            ) : (
              watchlist.map((symbol) => {
                const stock = stocks[symbol];
                if (!stock) return null;
                const isPositive = stock.change >= 0;
                const isSelected = selectedStock === symbol;

                return (
                  <Card
                    key={symbol}
                    clickable
                    onClick={() => {
                      selectStock(symbol);
                      onSelectStock();
                    }}
                    variant={isSelected ? 'elevated' : 'outline'}
                    className={`transition-colors ${isSelected
                      ? 'border-primary/50 bg-primary/10'
                      : 'border-earth-stone/30 hover:bg-earth-stone/20'
                      }`}
                  >
                    <CardContent className="flex items-center justify-between p-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-primary">{symbol}</p>
                        <p className="text-xs text-earth-moss truncate">{stock.companyName}</p>
                      </div>
                      <div className="text-right flex items-center gap-2 flex-shrink-0">
                        <div>
                          <p className="text-sm font-medium text-earth-forest">
                            ${stock.currentPrice.toFixed(2)}
                          </p>
                          <div className="flex items-center gap-1 justify-end">
                            {isPositive ? (
                              <TrendingUp className="w-3 h-3 text-earth-forest" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-danger" />
                            )}
                            <p
                              className={`text-xs font-medium ${isPositive ? 'text-earth-forest' : 'text-danger'
                                }`}
                            >
                              {stock.changePercent > 0 ? '+' : ''}
                              {stock.changePercent.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromWatchlist(symbol);
                          }}
                          aria-label={`Remove ${symbol} from watchlist`}
                          className="!p-1"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
