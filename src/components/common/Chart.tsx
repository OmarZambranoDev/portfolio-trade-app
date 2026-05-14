import { useEffect, useRef, useState, useCallback } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
  CandlestickData,
  Time,
} from 'lightweight-charts';
import { Button } from '@OmarZambranoDev/portfolio-ui';
import { LineChart, CandlestickChart } from 'lucide-react';
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
  data: { timestamp: number; open: number; high: number; low: number; close: number }[],
  timeframe: Timeframe
) {
  const now = Date.now();

  if (timeframe === 'YTD') {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1).getTime();
    return data.filter((d) => d.timestamp >= startOfYear);
  }

  const msMap: Record<Exclude<Timeframe, 'YTD'>, number> = {
    '1D': 86400000,
    '1W': 7 * 86400000,
    '1M': 30 * 86400000,
    '3M': 90 * 86400000,
    '1Y': 365 * 86400000,
  };
  const cutoff = now - msMap[timeframe];
  return data.filter((d) => d.timestamp >= cutoff);
}

export function Chart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [chartType, setChartType] = useState<'line' | 'candlestick'>('line');
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');

  const { selectedStock, historical, stocks } = useTradeStore();

  const stock = selectedStock ? stocks[selectedStock] : null;
  const isPositive = stock ? stock.change >= 0 : true;
  const lineColor = isPositive ? '#344b33' : '#b3423a';

  const buildChart = useCallback(() => {
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
    };
  }, []);

  useEffect(() => {
    const cleanup = buildChart();
    return () => {
      cleanup?.();
    };
  }, [buildChart]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    if (lineSeriesRef.current) {
      chart.removeSeries(lineSeriesRef.current);
      lineSeriesRef.current = null;
    }
    if (candleSeriesRef.current) {
      chart.removeSeries(candleSeriesRef.current);
      candleSeriesRef.current = null;
    }

    if (!selectedStock || !historical[selectedStock]) return;

    const filteredData = filterDataByTimeframe(historical[selectedStock], timeframe);

    if (filteredData.length === 0) return;

    if (chartType === 'line') {
      const lineData: LineData[] = filteredData.map((d) => ({
        time: (d.timestamp / 1000) as Time,
        value: d.close,
      }));
      const lineSeries = chart.addLineSeries({
        color: lineColor,
        lineWidth: 2,
        lastValueVisible: true,
        priceLineVisible: false,
      });
      lineSeries.setData(lineData);
      lineSeriesRef.current = lineSeries;
      chart.timeScale().fitContent();
    } else {
      const candleData: CandlestickData[] = filteredData.map((d) => ({
        time: (d.timestamp / 1000) as Time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));
      const candleSeries = chart.addCandlestickSeries({
        upColor: '#344b33',
        downColor: '#b3423a',
        borderUpColor: '#344b33',
        borderDownColor: '#b3423a',
        wickUpColor: '#344b33',
        wickDownColor: '#b3423a',
      });
      candleSeries.setData(candleData);
      candleSeriesRef.current = candleSeries;
      chart.timeScale().fitContent();
    }
  }, [selectedStock, historical, chartType, timeframe, lineColor]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <div className="flex gap-1">
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
        <div className="flex gap-1">
          <Button
            variant={chartType === 'line' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
            className={chartType === 'line' ? '' : 'border-earth-stone/30 text-earth-moss'}
          >
            <LineChart className="w-4 h-4" />
          </Button>
          <Button
            variant={chartType === 'candlestick' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setChartType('candlestick')}
            className={
              chartType === 'candlestick' ? '' : 'border-earth-stone/30 text-earth-moss'
            }
          >
            <CandlestickChart className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div ref={chartContainerRef} className="flex-1 w-full" />
    </div>
  );
}
