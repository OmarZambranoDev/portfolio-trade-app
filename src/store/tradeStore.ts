import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Stock, Holding, Trade, HistoricalDataPoint } from '../types';
import { fetchStockData, getVolatility } from '../services/marketDataService';

interface TradeStore {
  // Data
  stocks: Record<string, Stock>;
  historical: Record<string, HistoricalDataPoint[]>;
  watchlist: string[];
  portfolio: Holding[];
  cashBalance: number;
  tradeHistory: Trade[];
  dataLoaded: boolean;

  // UI state
  selectedStock: string | null;

  // Actions
  fetchAndSeedData: () => Promise<void>;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  selectStock: (symbol: string | null) => void;
  executeTrade: (symbol: string, quantity: number, action: 'buy' | 'sell') => void;
  updatePrices: () => void;
}

function generateId(): string {
  return `trade_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const useTradeStore = create<TradeStore>()(
  persist(
    (set, get) => ({
      stocks: {},
      historical: {},
      watchlist: ['AAPL', 'GOOGL', 'MSFT', 'TSLA'],
      portfolio: [
        { symbol: 'AAPL', quantity: 10, avgCost: 150 },
        { symbol: 'MSFT', quantity: 5, avgCost: 380 },
        { symbol: 'TSLA', quantity: 3, avgCost: 220 },
      ],
      cashBalance: 25000,
      tradeHistory: [
        {
          id: 'seed_aapl',
          symbol: 'AAPL',
          quantity: 10,
          price: 150,
          action: 'buy' as const,
          timestamp: Date.now() - 86400000 * 5,
        },
        {
          id: 'seed_msft',
          symbol: 'MSFT',
          quantity: 5,
          price: 380,
          action: 'buy' as const,
          timestamp: Date.now() - 86400000 * 3,
        },
        {
          id: 'seed_tsla',
          symbol: 'TSLA',
          quantity: 3,
          price: 220,
          action: 'buy' as const,
          timestamp: Date.now() - 86400000 * 1,
        },
      ],
      dataLoaded: false,
      selectedStock: null,

      fetchAndSeedData: async () => {
        const cached = localStorage.getItem('trade_seed_data');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            const cacheAge = Date.now() - parsed.timestamp;
            if (cacheAge < 30 * 60 * 1000) {
              // Cache valid for 30 minutes
              const stocksMap: Record<string, Stock> = {};
              parsed.stocks.forEach((s: Stock) => {
                stocksMap[s.symbol] = s;
              });
              set({
                stocks: stocksMap,
                historical: parsed.historical,
                dataLoaded: true,
              });
              return;
            }
          } catch {
            // Invalid cache, fetch fresh
          }
        }

        const { stocks, historical } = await fetchStockData();
        const stocksMap: Record<string, Stock> = {};
        stocks.forEach((s) => {
          stocksMap[s.symbol] = s;
        });
        set({ stocks: stocksMap, historical, dataLoaded: true });
      },

      addToWatchlist: (symbol) => {
        const { watchlist, stocks } = get();
        if (watchlist.includes(symbol) || !stocks[symbol]) return;
        set({ watchlist: [...watchlist, symbol] });
      },

      removeFromWatchlist: (symbol) => {
        const { watchlist, selectedStock } = get();
        set({
          watchlist: watchlist.filter((s) => s !== symbol),
          selectedStock: selectedStock === symbol ? null : selectedStock,
        });
      },

      selectStock: (symbol) => {
        set({ selectedStock: symbol });
      },

      executeTrade: (symbol, quantity, action) => {
        const { stocks, portfolio, cashBalance, tradeHistory } = get();
        const stock = stocks[symbol];
        if (!stock || quantity <= 0) return;

        const total = stock.currentPrice * quantity;

        if (action === 'buy') {
          if (total > cashBalance) return;
          const existingHolding = portfolio.find((h) => h.symbol === symbol);
          const newPortfolio = existingHolding
            ? portfolio.map((h) =>
              h.symbol === symbol
                ? {
                  ...h,
                  quantity: h.quantity + quantity,
                  avgCost: (h.avgCost * h.quantity + total) / (h.quantity + quantity),
                }
                : h
            )
            : [...portfolio, { symbol, quantity, avgCost: stock.currentPrice }];

          set({
            portfolio: newPortfolio,
            cashBalance: cashBalance - total,
            tradeHistory: [
              {
                id: generateId(),
                symbol,
                quantity,
                price: stock.currentPrice,
                action,
                timestamp: Date.now(),
              },
              ...tradeHistory,
            ],
          });
        } else {
          const existingHolding = portfolio.find((h) => h.symbol === symbol);
          if (!existingHolding || existingHolding.quantity < quantity) return;

          const newPortfolio =
            existingHolding.quantity === quantity
              ? portfolio.filter((h) => h.symbol !== symbol)
              : portfolio.map((h) =>
                h.symbol === symbol ? { ...h, quantity: h.quantity - quantity } : h
              );

          set({
            portfolio: newPortfolio,
            cashBalance: cashBalance + total,
            tradeHistory: [
              {
                id: generateId(),
                symbol,
                quantity,
                price: stock.currentPrice,
                action,
                timestamp: Date.now(),
              },
              ...tradeHistory,
            ],
          });
        }
      },

      updatePrices: () => {
        const { stocks } = get();
        const updatedStocks = { ...stocks };

        Object.keys(updatedStocks).forEach((symbol) => {
          const stock = updatedStocks[symbol];
          const volatility = getVolatility(symbol);
          const fluctuation = (Math.random() - 0.5) * 2 * volatility * stock.currentPrice;
          const newPrice = Math.max(0.01, stock.currentPrice + fluctuation);

          updatedStocks[symbol] = {
            ...stock,
            currentPrice: Math.round(newPrice * 100) / 100,
            change: Math.round((newPrice - stock.previousClose) * 100) / 100,
            changePercent:
              Math.round(((newPrice - stock.previousClose) / stock.previousClose) * 10000) / 100,
            volume: stock.volume + Math.floor((Math.random() - 0.5) * stock.volume * 0.1),
          };
        });

        set({ stocks: updatedStocks });
      },
    }),
    {
      name: 'trade-store',
      partialize: (state) => ({
        watchlist: state.watchlist,
        portfolio: state.portfolio,
        cashBalance: state.cashBalance,
        tradeHistory: state.tradeHistory,
      }),
    }
  )
);
