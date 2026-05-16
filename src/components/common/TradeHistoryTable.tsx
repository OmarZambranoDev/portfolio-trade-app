import { Table } from '@OmarZambranoDev/portfolio-ui';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useTradeStore } from '../../store/tradeStore';
import type { ColumnDef } from '@OmarZambranoDev/portfolio-ui';

interface TradeRow {
  id: string;
  action: 'buy' | 'sell';
  symbol: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
  timestamp: number;
}

interface TradeHistoryTableProps {
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function TradeHistoryTable({ onCollapsedChange }: TradeHistoryTableProps) {
  const { tradeHistory, selectedStock } = useTradeStore();

  const filteredTrades = selectedStock
    ? tradeHistory.filter((t) => t.symbol === selectedStock)
    : tradeHistory;

  const data: TradeRow[] = filteredTrades
    .sort((a, b) => b.timestamp - a.timestamp)
    .map((trade) => ({
      id: trade.id,
      action: trade.action,
      symbol: trade.symbol,
      quantity: trade.quantity,
      price: trade.price,
      total: trade.price * trade.quantity,
      date: new Date(trade.timestamp).toLocaleString(),
      timestamp: trade.timestamp,
    }));

  const columns: ColumnDef<TradeRow, unknown>[] = [
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {row.original.action === 'buy' ? (
            <ArrowUpCircle className="w-4 h-4 text-earth-forest" />
          ) : (
            <ArrowDownCircle className="w-4 h-4 text-danger" />
          )}
          <span
            className={`font-medium ${row.original.action === 'buy' ? 'text-earth-forest' : 'text-danger'}`}
          >
            {row.original.action.toUpperCase()}
          </span>
        </div>
      ),
      meta: { align: 'left' },
    },
    {
      accessorKey: 'symbol',
      header: 'Symbol',
      cell: ({ row }) => (
        <span className="text-earth-forest font-medium">{row.original.symbol}</span>
      ),
      meta: { align: 'left' },
    },
    {
      accessorKey: 'quantity',
      header: 'Qty',
      cell: ({ row }) => <span className="text-earth-moss">{row.original.quantity}</span>,
      meta: { align: 'right' },
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => <span className="text-earth-moss">${row.original.price.toFixed(2)}</span>,
      meta: { align: 'right' },
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => (
        <span className="text-earth-forest font-medium">${row.original.total.toFixed(2)}</span>
      ),
      meta: { align: 'right' },
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => <span className="text-earth-moss text-xs">{row.original.date}</span>,
      meta: { align: 'right' },
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      rowKey={(row) => row.id}
      title={`Trade History${selectedStock ? ` — ${selectedStock}` : ''}`}
      collapsible
      onCollapsedChange={onCollapsedChange}
      emptyMessage="No trades yet. Buy or sell a stock to get started."
    />
  );
}
