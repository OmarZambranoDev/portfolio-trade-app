import { Stock, HistoricalDataPoint } from '../types';

const API_BASE = 'https://api.massive.com/v1';

const DEFAULT_SYMBOLS = [
  'AAPL',
  'GOOGL',
  'MSFT',
  'AMZN',
  'TSLA',
  'META',
  'NFLX',
  'NVDA',
  'JPM',
  'V',
  'WMT',
  'DIS',
  'BA',
  'PYPL',
  'ADBE',
];

const MOCK_STOCKS: Record<string, Omit<Stock, 'change' | 'changePercent'>> = {
  AAPL: {
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    currentPrice: 185.42,
    previousClose: 184.19,
    volume: 52456321,
    sector: 'Technology',
  },
  GOOGL: {
    symbol: 'GOOGL',
    companyName: 'Alphabet Inc.',
    currentPrice: 141.87,
    previousClose: 140.92,
    volume: 18765432,
    sector: 'Technology',
  },
  MSFT: {
    symbol: 'MSFT',
    companyName: 'Microsoft Corp.',
    currentPrice: 415.23,
    previousClose: 412.78,
    volume: 22109876,
    sector: 'Technology',
  },
  AMZN: {
    symbol: 'AMZN',
    companyName: 'Amazon.com Inc.',
    currentPrice: 178.34,
    previousClose: 177.45,
    volume: 33456789,
    sector: 'Consumer Cyclical',
  },
  TSLA: {
    symbol: 'TSLA',
    companyName: 'Tesla Inc.',
    currentPrice: 245.67,
    previousClose: 240.12,
    volume: 45678901,
    sector: 'Automotive',
  },
  META: {
    symbol: 'META',
    companyName: 'Meta Platforms Inc.',
    currentPrice: 478.9,
    previousClose: 475.34,
    volume: 12345678,
    sector: 'Technology',
  },
  NFLX: {
    symbol: 'NFLX',
    companyName: 'Netflix Inc.',
    currentPrice: 612.45,
    previousClose: 608.9,
    volume: 8765432,
    sector: 'Entertainment',
  },
  NVDA: {
    symbol: 'NVDA',
    companyName: 'NVIDIA Corp.',
    currentPrice: 875.23,
    previousClose: 870.11,
    volume: 34567890,
    sector: 'Technology',
  },
  JPM: {
    symbol: 'JPM',
    companyName: 'JPMorgan Chase & Co.',
    currentPrice: 187.34,
    previousClose: 186.78,
    volume: 15678901,
    sector: 'Financial',
  },
  V: {
    symbol: 'V',
    companyName: 'Visa Inc.',
    currentPrice: 278.9,
    previousClose: 277.45,
    volume: 9876543,
    sector: 'Financial',
  },
  WMT: {
    symbol: 'WMT',
    companyName: 'Walmart Inc.',
    currentPrice: 167.23,
    previousClose: 166.89,
    volume: 11234567,
    sector: 'Retail',
  },
  DIS: {
    symbol: 'DIS',
    companyName: 'Walt Disney Co.',
    currentPrice: 95.67,
    previousClose: 94.9,
    volume: 14567890,
    sector: 'Entertainment',
  },
  BA: {
    symbol: 'BA',
    companyName: 'Boeing Co.',
    currentPrice: 210.45,
    previousClose: 208.9,
    volume: 23456789,
    sector: 'Aerospace',
  },
  PYPL: {
    symbol: 'PYPL',
    companyName: 'PayPal Holdings Inc.',
    currentPrice: 67.89,
    previousClose: 67.12,
    volume: 16789012,
    sector: 'Financial',
  },
  ADBE: {
    symbol: 'ADBE',
    companyName: 'Adobe Inc.',
    currentPrice: 534.56,
    previousClose: 530.23,
    volume: 7890123,
    sector: 'Technology',
  },
};

const VOLATILITY: Record<string, number> = {
  TSLA: 0.03,
  NVDA: 0.025,
  META: 0.02,
  NFLX: 0.022,
  BA: 0.02,
  AMZN: 0.018,
  ADBE: 0.017,
  PYPL: 0.019,
  DIS: 0.016,
  GOOGL: 0.015,
  AAPL: 0.012,
  MSFT: 0.012,
  V: 0.01,
  JPM: 0.01,
  WMT: 0.008,
};

function generateHistoricalData(
  basePrice: number,
  volatility: number,
  days: number = 30
): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  const now = Date.now();
  const msPerDay = 86400000;

  for (let i = days; i >= 0; i--) {
    const change = (Math.random() - 0.5) * 2 * volatility * basePrice;
    const open = basePrice + change;
    const close = open + (Math.random() - 0.5) * volatility * basePrice;
    const high = Math.max(open, close) + Math.random() * volatility * basePrice * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * basePrice * 0.5;

    data.push({
      timestamp: now - i * msPerDay,
      open,
      high,
      low,
      close,
      volume: Math.floor(1000000 + Math.random() * 9000000),
    });

    basePrice = close;
  }

  return data;
}

function computeChange(
  stock: Omit<Stock, 'change' | 'changePercent'>
): Pick<Stock, 'change' | 'changePercent'> {
  const change = stock.currentPrice - stock.previousClose;
  const changePercent = (change / stock.previousClose) * 100;
  return {
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
  };
}

export async function fetchStockData(): Promise<{
  stocks: Stock[];
  historical: Record<string, HistoricalDataPoint[]>;
}> {
  const apiKey = import.meta.env.VITE_MASSIVE_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(
        `${API_BASE}/stocks/quotes?symbols=${DEFAULT_SYMBOLS.join(',')}`,
        {
          headers: { 'X-API-Key': apiKey },
        }
      );
      if (response.ok) {
        const json = await response.json();
        // TODO: Map API response when schema is confirmed
        console.log('API data received:', json);
      }
    } catch {
      console.warn('API fetch failed, falling back to mock data');
    }
  }

  // Fallback to mock data
  const stocks: Stock[] = DEFAULT_SYMBOLS.map((symbol) => {
    const mock = MOCK_STOCKS[symbol];
    return { ...mock, ...computeChange(mock) };
  });

  const historical: Record<string, HistoricalDataPoint[]> = {};
  DEFAULT_SYMBOLS.forEach((symbol) => {
    const stock = MOCK_STOCKS[symbol];
    historical[symbol] = generateHistoricalData(stock.currentPrice, VOLATILITY[symbol] || 0.015);
  });

  // Cache in localStorage
  try {
    localStorage.setItem(
      'trade_seed_data',
      JSON.stringify({ stocks, historical, timestamp: Date.now() })
    );
  } catch {
    // localStorage might be unavailable (e.g., private browsing)
  }

  return { stocks, historical };
}

export function getVolatility(symbol: string): number {
  return VOLATILITY[symbol] || 0.015;
}
