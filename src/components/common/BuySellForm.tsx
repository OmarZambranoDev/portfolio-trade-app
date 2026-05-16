import { useState } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
} from '@OmarZambranoDev/portfolio-ui';
import { useTradeStore } from '../../store/tradeStore';
import { useToast } from '@OmarZambranoDev/portfolio-ui';

export function BuySellForm() {
  const [quantity, setQuantity] = useState('');
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [showConfirm, setShowConfirm] = useState(false);
  const { selectedStock, stocks, portfolio, cashBalance, executeTrade } = useTradeStore();
  const { toast } = useToast();

  const stock = selectedStock ? stocks[selectedStock] : null;
  const parsedQuantity = parseInt(quantity, 10);
  const total = stock ? stock.currentPrice * (parsedQuantity || 0) : 0;
  const isValidQuantity = parsedQuantity > 0;

  const holding = selectedStock ? portfolio.find((h) => h.symbol === selectedStock) : null;
  const holdingQuantity = holding?.quantity ?? 0;

  const canBuy = action === 'buy' && stock && isValidQuantity && total <= cashBalance;
  const canSell =
    action === 'sell' && stock && isValidQuantity && parsedQuantity <= holdingQuantity;

  const canSubmit = (action === 'buy' && canBuy) || (action === 'sell' && canSell);

  const handleSubmit = () => {
    if (!stock || !selectedStock) return;
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (!stock || !selectedStock) return;
    executeTrade(selectedStock, parsedQuantity, action);
    setShowConfirm(false);
    setQuantity('');
    toast({
      title: 'Trade Executed',
      description: `${action === 'buy' ? 'Bought' : 'Sold'} ${parsedQuantity} shares of ${selectedStock} at $${stock.currentPrice.toFixed(2)}`,
      variant: 'success',
    });
  };

  if (!stock) {
    return (
      <div className="bg-white rounded-lg border border-earth-stone/30 p-4">
        <p className="text-earth-moss text-sm text-center">Select a stock to trade</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-earth-stone/30 p-4">
        <div className="flex gap-2 mb-3">
          <Button
            variant={action === 'buy' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setAction('buy')}
            className={action === 'buy' ? '' : 'border-earth-stone/30 text-earth-moss'}
          >
            Buy
          </Button>
          <Button
            variant={action === 'sell' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setAction('sell')}
            className={
              action === 'sell'
                ? '!bg-danger !border-danger hover:!bg-danger-hover text-white'
                : 'border-earth-stone/30 text-earth-moss'
            }
          >
            Sell
          </Button>
        </div>

        <div className="space-y-2">
          <div>
            <label className="text-xs text-earth-moss block mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className="w-full h-10 px-3 rounded border border-earth-stone/30 bg-earth-stone/10 text-earth-forest text-sm focus:outline-none focus:border-earth-sage"
            />
          </div>

          {holding && (
            <p className="text-xs text-earth-moss">
              Holding: {holding.quantity} shares @ ${holding.avgCost.toFixed(2)}
            </p>
          )}

          {isValidQuantity && (
            <div className="flex justify-between text-sm pt-1">
              <span className="text-earth-moss">Total</span>
              <span className="font-semibold text-earth-forest">${total.toFixed(2)}</span>
            </div>
          )}

          {action === 'buy' && parsedQuantity > 0 && total > cashBalance && (
            <p className="text-xs text-danger">Insufficient cash balance</p>
          )}
          {action === 'sell' && parsedQuantity > holdingQuantity && (
            <p className="text-xs text-danger">Not enough shares</p>
          )}

          <Button
            variant="primary"
            className={`w-full mt-2 ${action === 'sell' ? '!bg-danger hover:!bg-danger-hover' : ''}`}
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {action === 'buy' ? 'Buy' : 'Sell'} {selectedStock}
          </Button>
        </div>

        <p className="text-xs text-earth-moss mt-2">Cash available: ${cashBalance.toFixed(2)}</p>
      </div>

      <Modal open={showConfirm} onOpenChange={setShowConfirm}>
        <ModalContent size="sm">
          <ModalHeader>
            <ModalTitle>Confirm Trade</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p className="text-earth-moss">
              {action === 'buy' ? 'Buy' : 'Sell'} <strong>{parsedQuantity}</strong> shares of{' '}
              <strong>{selectedStock}</strong> at <strong>${stock.currentPrice.toFixed(2)}</strong>{' '}
              each?
            </p>
            <p className="text-earth-forest font-semibold mt-2">Total: ${total.toFixed(2)}</p>
          </ModalBody>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="outline">Cancel</Button>
            </ModalClose>
            <Button
              variant="primary"
              className={action === 'sell' ? '!bg-danger hover:!bg-danger-hover' : ''}
              onClick={handleConfirm}
            >
              Confirm {action === 'buy' ? 'Buy' : 'Sell'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
