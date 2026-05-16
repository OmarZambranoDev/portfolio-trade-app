import { useEffect, useRef, useState, useCallback } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
  Time,
} from 'lightweight-charts';
import { Button } from '@OmarZambranoDev/portfolio-ui';
import { useTradeStore } from '../../store/tradeStore';

type Timeframe = '1D' | '1W' | '1M' | '3M' | 'YTD' | '1Y';

const TIMEFRAME_LABELS: Record<Timeframe, string> = {
  '1D': '1D',
  '1W': '1W',
  '1M': '1M',
  '3M': '3M',
  'YTD': 'YTD',
  '1Y': '1Y',
};

function filterDataByTimeframe(
  data: { time: Time; value: number }[],
  timeframe: Timeframe
) {
  const now = Date.now() / 1000;

  if (timeframe === 'YTD') {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1).getTime() / 1000;
    return data.filter((d) => (d.time as number) >= startOfYear);
  }

  const secondsMap: Record<Exclude<Timeframe, 'YTD'>, number> = {
    '1D': 86400,
    '1W': 7 * 86400,
    '1M': 30 * 86400,
    '3M': 90 * 86400,
    '1Y': 365 * 86400,
  };
  const cutoff = now - secondsMap[timeframe];
  return data.filter((d) => (d.time as number) >= cutoff);
}

function buildPortfolioHistory(
  portfolio: { symbol: string; quantity: number }[],
  historical: Record<string, { timestamp: number; close: number }[]>
): { time: Time; value: number }[] {
  if (portfolio.length === 0) return [];

  const timeMap = new Map<number, number>();

  portfolio.forEach((holding) => {
    const data = historical[holding.symbol];
    if (!data) return;
    data.forEach((d) => {
      const timeKey = Math.floor(d.timestamp / 1000);
      const existing = timeMap.get(timeKey) || 0;
      timeMap.set(timeKey, existing + d.close * holding.quantity);
    });
  });

  return Array.from(timeMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([timestamp, value]) => ({
      time: timestamp as Time,
      value: Math.round(value * 100) / 100,
    }));
}

export function PortfolioOverview() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');

  const { portfolio, historical, cashBalance } = useTradeStore();

  const portfolioData = buildPortfolioHistory(portfolio, historical);
  const currentValue =
    portfolioData.length > 0 ? portfolioData[portfolioData.length - 1].value : 0;
  const startValue = portfolioData.length > 0 ? portfolioData[0].value : currentValue;
  const totalGain = currentValue - startValue;
  const isPositive = totalGain >= 0;

  const updateChartData = useCallback(() => {
    const chart = chartRef.current;
    if (!chart || !portfolioData || portfolioData.length === 0) return;

    // Safely remove existing series
    try {
      if (seriesRef.current) {
        chart.removeSeries(seriesRef.current);
      }
    } catch {
      // Series might already be removed
    }
    seriesRef.current = null;

    const filteredData = filterDataByTimeframe(portfolioData, timeframe);
    if (!filteredData || filteredData.length === 0) return;

    const lineData: LineData[] = filteredData
      .filter((d) => d && d.time !== undefined && d.value !== undefined)
      .map((d) => ({
        time: d.time,
        value: d.value,
      }));

    if (lineData.length === 0) return;

    const lineSeries = chart.addLineSeries({
      color: isPositive ? '#344b33' : '#b3423a',
      lineWidth: 2,
      lastValueVisible: true,
      priceLineVisible: false,
    });
    lineSeries.setData(lineData);
    seriesRef.current = lineSeries;
    chart.timeScale().fitContent();
  }, [portfolioData, timeframe, isPositive]);

  // Create chart once
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#ffffff' },
        textColor: '#7f886e',
      },
      grid: {
        vertLines: { color: '#c5ae9630' },
        horzLines: { color: '#c5ae9630' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        borderColor: '#c5ae9630',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: '#c5ae9630',
      },
    });

    chartRef.current = chart;

    const observer = new ResizeObserver(() => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    });
    observer.observe(chartContainerRef.current);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // Update data when dependencies change
  useEffect(() => {
    updateChartData();
  }, [updateChartData]);

  return (
    <div className="flex-shrink-0 p-4 pb-0 flex flex-col space-y-4">
      {/* Header */}
      <div className="flex-shrink-0">
        <h2 className="text-xl font-bold text-earth-forest">Portfolio Overview</h2>
        <div className="flex items-baseline gap-3 mt-1">
          <span className="text-2xl font-bold text-earth-forest">
            ${currentValue.toFixed(2)}
          </span>
          <span
            className={`text-sm font-semibold ${
              isPositive ? 'text-earth-forest' : 'text-danger'
            }`}
          >
            {isPositive ? '+' : ''}
            ${totalGain.toFixed(2)} (
            {startValue > 0 ? ((totalGain / startValue) * 100).toFixed(2) : '0.00'}%)
          </span>
        </div>
        <p className="text-xs text-earth-moss mt-1">Cash: ${cashBalance.toFixed(2)}</p>
      </div>

      {/* Chart */}
      <div className="h-80 bg-white rounded-lg border border-earth-stone/30 overflow-hidden flex flex-col">
        <div className="flex items-center gap-1 px-4 pt-3 pb-1">
          {(['1D', '1W', '1M', '3M', 'YTD', '1Y'] as Timeframe[]).map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className={timeframe === tf ? '' : 'border-earth-stone/30 text-earth-moss text-xs'}
            >
              {TIMEFRAME_LABELS[tf]}
            </Button>
          ))}
        </div>
        <div ref={chartContainerRef} className="flex-1 w-full" />
      </div>
    </div>
  );
}
