export interface Stock {
  symbol: string;
  companyName: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  sector?: string;
}

export interface Holding {
  symbol: string;
  quantity: number;
  avgCost: number;
}

export interface Trade {
  id: string;
  symbol: string;
  quantity: number;
  price: number;
  action: 'buy' | 'sell';
  timestamp: number;
}

export interface HistoricalDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type IntradayDataPoint = HistoricalDataPoint;
