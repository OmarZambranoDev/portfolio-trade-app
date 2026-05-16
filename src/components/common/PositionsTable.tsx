import { Table } from '@OmarZambranoDev/portfolio-ui';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTradeStore } from '../../store/tradeStore';
import type { ColumnDef } from '@OmarZambranoDev/portfolio-ui';

interface PositionRow {
  symbol: string;
  companyName: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  todayGain: number;
  todayGainPercent: number;
  totalGain: number;
  totalGainPercent: number;
  currentValue: number;
  accountPercent: number;
  quantity: number;
  avgCost: number;
  costBasisTotal: number;
}

interface PositionsTableProps {
  onSelectStock: (symbol: string) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function PositionsTable({ onSelectStock, onCollapsedChange }: PositionsTableProps) {
  const { portfolio, stocks, cashBalance } = useTradeStore();

  const totalPortfolioValue = portfolio.reduce((sum, h) => {
    const stock = stocks[h.symbol];
    return sum + (stock?.currentPrice ?? 0) * h.quantity;
  }, 0);
  const totalAccount = totalPortfolioValue + cashBalance;

  const data: PositionRow[] = portfolio
    .map((holding) => {
      const stock = stocks[holding.symbol];
      if (!stock) return null;
      const currentPrice = stock.currentPrice;
      const previousClose = stock.previousClose;
      const todayGain = (currentPrice - previousClose) * holding.quantity;
      const todayGainPercent =
        previousClose > 0 ? ((currentPrice - previousClose) / previousClose) * 100 : 0;
      const totalGain = (currentPrice - holding.avgCost) * holding.quantity;
      const totalGainPercent =
        holding.avgCost > 0 ? ((currentPrice - holding.avgCost) / holding.avgCost) * 100 : 0;
      const currentValue = currentPrice * holding.quantity;
      const accountPercent = totalAccount > 0 ? (currentValue / totalAccount) * 100 : 0;

      return {
        symbol: holding.symbol,
        companyName: stock.companyName,
        lastPrice: currentPrice,
        change: stock.change,
        changePercent: stock.changePercent,
        todayGain,
        todayGainPercent,
        totalGain,
        totalGainPercent,
        currentValue,
        accountPercent,
        quantity: holding.quantity,
        avgCost: holding.avgCost,
        costBasisTotal: holding.avgCost * holding.quantity,
      };
    })
    .filter(Boolean) as PositionRow[];

  const columns: ColumnDef<PositionRow, unknown>[] = [
    {
      accessorKey: 'symbol',
      header: 'Symbol',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-earth-forest text-sm">{row.original.symbol}</p>
          <p className="text-xs text-earth-moss">{row.original.companyName}</p>
        </div>
      ),
      size: 120,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'lastPrice',
      header: 'Last Price',
      cell: ({ row }) => (
        <span className="text-earth-forest font-medium">${row.original.lastPrice.toFixed(2)}</span>
      ),
      meta: { align: 'right' },
    },
    {
      accessorKey: 'change',
      header: 'Change',
      cell: ({ row }) => {
        const isPositive = row.original.change >= 0;
        return (
          <div className="flex items-center justify-end gap-1">
            {isPositive ? (
              <TrendingUp className="w-3 h-3 text-earth-forest" />
            ) : (
              <TrendingDown className="w-3 h-3 text-danger" />
            )}
            <span className={`font-medium ${isPositive ? 'text-earth-forest' : 'text-danger'}`}>
              {isPositive ? '+' : ''}
              {row.original.change.toFixed(2)} ({isPositive ? '+' : ''}
              {row.original.changePercent.toFixed(2)}%)
            </span>
          </div>
        );
      },
      meta: { align: 'right' },
    },
    {
      accessorKey: 'todayGain',
      header: "Today's Gain",
      cell: ({ row }) => {
        const isPositive = row.original.todayGain >= 0;
        return (
          <div
            className={`text-right font-medium ${isPositive ? 'text-earth-forest' : 'text-danger'}`}
          >
            {isPositive ? '+' : ''}${row.original.todayGain.toFixed(2)}
            <br />
            <span className="text-xs">
              ({isPositive ? '+' : ''}
              {row.original.todayGainPercent.toFixed(2)}%)
            </span>
          </div>
        );
      },
      meta: { align: 'right' },
    },
    {
      accessorKey: 'totalGain',
      header: 'Total Gain',
      cell: ({ row }) => {
        const isPositive = row.original.totalGain >= 0;
        return (
          <div
            className={`text-right font-medium ${isPositive ? 'text-earth-forest' : 'text-danger'}`}
          >
            {isPositive ? '+' : ''}${row.original.totalGain.toFixed(2)}
            <br />
            <span className="text-xs">
              ({isPositive ? '+' : ''}
              {row.original.totalGainPercent.toFixed(2)}%)
            </span>
          </div>
        );
      },
      meta: { align: 'right' },
    },
    {
      accessorKey: 'currentValue',
      header: 'Value',
      cell: ({ row }) => (
        <span className="text-earth-forest font-medium">
          ${row.original.currentValue.toFixed(2)}
        </span>
      ),
      meta: { align: 'right' },
    },
    {
      accessorKey: 'accountPercent',
      header: '% Account',
      cell: ({ row }) => (
        <span className="text-earth-moss">{row.original.accountPercent.toFixed(2)}%</span>
      ),
      meta: { align: 'right' },
    },
    {
      accessorKey: 'quantity',
      header: 'Qty',
      cell: ({ row }) => <span className="text-earth-moss">{row.original.quantity}</span>,
      meta: { align: 'right' },
    },
    {
      accessorKey: 'avgCost',
      header: 'Avg Cost',
      cell: ({ row }) => (
        <span className="text-earth-moss">${row.original.avgCost.toFixed(2)}</span>
      ),
      meta: { align: 'right' },
    },
    {
      accessorKey: 'costBasisTotal',
      header: 'Cost Basis',
      cell: ({ row }) => (
        <span className="text-earth-moss">${row.original.costBasisTotal.toFixed(2)}</span>
      ),
      meta: { align: 'right' },
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      rowKey={(row) => row.symbol}
      title="Positions"
      collapsible
      clickableRows
      onRowClick={(row) => onSelectStock(row.symbol)}
      onCollapsedChange={onCollapsedChange}
      emptyMessage="No positions yet. Start trading to build your portfolio."
    />
  );
}
