import { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useData, Trade } from '@/contexts/DataContext';
import { useTranslation } from '@/hooks/useTranslation';

interface TradeGridProps {
  trades: Trade[];
  strategyId: string;
  monthId: string;
  monthYear: number;
  monthName: string;
}

export const TradeGrid = ({ trades, strategyId, monthId, monthYear, monthName }: TradeGridProps) => {
  const { addTrade, updateTrade, deleteTrade } = useData();
  const { t } = useTranslation();
  const [editingCell, setEditingCell] = useState<{ rowId: string; column: string } | null>(null);

  // Get the last used pair from existing trades
  const lastUsedPair = trades.length > 0 ? trades[trades.length - 1].pair : 'EUR/USD';

  const handleAddTrade = async () => {
    const newTrade: Omit<Trade, 'id'> = {
      date: new Date().toISOString().split('T')[0],
      pair: lastUsedPair,
      direction: 'long',
      entryPrice: 0,
      exitPrice: 0,
      riskReward: 2,
      result: 'win',
      profitLossDollar: 0,
      profitLossPercent: 0,
      tradeCount: 1, // Keep for database compatibility
      maxPercent: null,
    };
    await addTrade(strategyId, monthId, newTrade);
  };

  const handleCellUpdate = async (tradeId: string, column: string, value: string | number, currentTrade?: Trade) => {
    const updates: Partial<Trade> = {};
    
    if (column === 'direction') {
      updates.direction = value as 'long' | 'short';
    } else if (column === 'tradeCount') {
      updates.tradeCount = parseInt(value as string) || 1;
    } else if (column === 'result') {
      const newResult = value as 'win' | 'loss';
      updates.result = newResult;
      if (currentTrade) {
        if (newResult === 'loss') {
          updates.profitLossDollar = -Math.abs(currentTrade.profitLossDollar);
          updates.profitLossPercent = -Math.abs(currentTrade.profitLossPercent);
        } else {
          updates.profitLossDollar = Math.abs(currentTrade.profitLossDollar);
          updates.profitLossPercent = Math.abs(currentTrade.profitLossPercent);
        }
      }
    } else if (column === 'riskReward') {
      updates.riskReward = parseFloat(value as string) || 0;
    } else if (column === 'profitLossDollar') {
      const numValue = parseFloat(value as string) || 0;
      if (currentTrade?.result === 'loss') {
        updates.profitLossDollar = -Math.abs(numValue);
      } else {
        updates.profitLossDollar = Math.abs(numValue);
      }
    } else if (column === 'profitLossPercent') {
      const numValue = parseFloat(value as string) || 0;
      if (currentTrade?.result === 'loss') {
        updates.profitLossPercent = -Math.abs(numValue);
      } else {
        updates.profitLossPercent = Math.abs(numValue);
      }
    } else if (column === 'date') {
      updates.date = value as string;
    } else if (column === 'pair') {
      updates.pair = value as string;
    } else if (column === 'maxPercent') {
      const numValue = parseFloat(value as string);
      updates.maxPercent = isNaN(numValue) ? null : numValue;
    }

    await updateTrade(strategyId, monthId, tradeId, updates);
    setEditingCell(null);
  };

  // Helper to extract day from date - Fixed to use UTC
  const getDayFromDate = (dateString: string) => {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return parseInt(parts[2], 10);
    }
    return 1;
  };

  const handleDeleteTrade = async (tradeId: string) => {
    await deleteTrade(strategyId, monthId, tradeId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{t('trades')}</h3>
        <Button onClick={handleAddTrade} className="gap-2 glow-primary">
          <Plus className="w-4 h-4" />
          {t('addTrade')}
        </Button>
      </div>

      {trades.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-12 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <p className="text-lg font-medium mb-2">{t('noTrades')}</p>
          <p className="text-muted-foreground">{t('startLogging')}</p>
        </motion.div>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {trades.map((trade, index) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`glass-card rounded-xl p-4 border-l-4 ${
                  trade.result === 'win' ? 'border-l-win' : 'border-l-loss'
                }`}
              >
                <div className="flex flex-wrap items-center gap-4">
                  {/* Date - Show only day number */}
                  <div className="flex-shrink-0">
                    {editingCell?.rowId === trade.id && editingCell?.column === 'date' ? (
                      <Input
                        type="number"
                        min="1"
                        max="31"
                        defaultValue={getDayFromDate(trade.date)}
                        onBlur={(e) => {
                          const day = parseInt(e.target.value) || 1;
                          const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(monthName);
                          // Create date string directly to avoid timezone issues
                          const paddedMonth = String(monthIndex + 1).padStart(2, '0');
                          const paddedDay = String(day).padStart(2, '0');
                          const newDateStr = `${monthYear}-${paddedMonth}-${paddedDay}`;
                          handleCellUpdate(trade.id, 'date', newDateStr, trade);
                        }}
                        autoFocus
                        className="h-9 w-16 font-mono text-sm text-center"
                      />
                    ) : (
                      <div
                        onClick={() => setEditingCell({ rowId: trade.id, column: 'date' })}
                        className="cursor-pointer px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center"
                      >
                        <span className="text-xs text-muted-foreground block">{t('date')}</span>
                        <span className="font-mono text-lg font-bold">{getDayFromDate(trade.date)}</span>
                      </div>
                    )}
                  </div>

                  {/* Pair */}
                  <div className="flex-shrink-0">
                    {editingCell?.rowId === trade.id && editingCell?.column === 'pair' ? (
                      <Input
                        defaultValue={trade.pair}
                        onBlur={(e) => handleCellUpdate(trade.id, 'pair', e.target.value, trade)}
                        autoFocus
                        className="h-9 w-28"
                      />
                    ) : (
                      <div
                        onClick={() => setEditingCell({ rowId: trade.id, column: 'pair' })}
                        className="cursor-pointer px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <span className="text-xs text-muted-foreground block">{t('pair')}</span>
                        <span className="font-semibold">{trade.pair}</span>
                      </div>
                    )}
                  </div>

                  {/* Direction */}
                  <div className="flex-shrink-0">
                    <Select
                      value={trade.direction}
                      onValueChange={(v) => handleCellUpdate(trade.id, 'direction', v, trade)}
                    >
                      <SelectTrigger className={`h-9 w-28 ${
                        trade.direction === 'long' ? 'bg-win/10 border-win/30 text-win' : 'bg-loss/10 border-loss/30 text-loss'
                      }`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="long">
                          <span className="flex items-center gap-1.5 text-win font-medium">
                            <ArrowUp className="w-4 h-4" /> {t('long')}
                          </span>
                        </SelectItem>
                        <SelectItem value="short">
                          <span className="flex items-center gap-1.5 text-loss font-medium">
                            <ArrowDown className="w-4 h-4" /> {t('short')}
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* R:R */}
                  <div className="flex-shrink-0">
                    {editingCell?.rowId === trade.id && editingCell?.column === 'riskReward' ? (
                      <Input
                        type="number"
                        step="0.1"
                        defaultValue={trade.riskReward}
                        onBlur={(e) => handleCellUpdate(trade.id, 'riskReward', e.target.value, trade)}
                        autoFocus
                        className="h-9 w-20 font-mono"
                      />
                    ) : (
                      <div
                        onClick={() => setEditingCell({ rowId: trade.id, column: 'riskReward' })}
                        className="cursor-pointer px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <span className="text-xs text-muted-foreground block">{t('riskReward')}</span>
                        <span className="font-mono font-semibold">1:{trade.riskReward}</span>
                      </div>
                    )}
                  </div>

                  {/* Result */}
                  <div className="flex-shrink-0">
                    <Select
                      value={trade.result}
                      onValueChange={(v) => handleCellUpdate(trade.id, 'result', v, trade)}
                    >
                      <SelectTrigger className={`h-9 w-28 font-semibold ${
                        trade.result === 'win' ? 'bg-win/20 border-win/40 text-win' : 'bg-loss/20 border-loss/40 text-loss'
                      }`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="win">
                          <span className="flex items-center gap-1.5 text-win font-semibold">
                            <TrendingUp className="w-4 h-4" /> {t('win')}
                          </span>
                        </SelectItem>
                        <SelectItem value="loss">
                          <span className="flex items-center gap-1.5 text-loss font-semibold">
                            <TrendingDown className="w-4 h-4" /> {t('loss')}
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>


                  {/* Profit/Loss $ */}
                  <div className="flex-shrink-0">
                    {editingCell?.rowId === trade.id && editingCell?.column === 'profitLossDollar' ? (
                      <Input
                        type="number"
                        step="0.01"
                        defaultValue={trade.profitLossDollar}
                        onBlur={(e) => handleCellUpdate(trade.id, 'profitLossDollar', e.target.value, trade)}
                        autoFocus
                        className="h-9 w-28 font-mono"
                      />
                    ) : (
                      <div
                        onClick={() => setEditingCell({ rowId: trade.id, column: 'profitLossDollar' })}
                        className={`cursor-pointer px-3 py-1.5 rounded-lg transition-colors ${
                          trade.profitLossDollar >= 0 ? 'bg-win/10 hover:bg-win/20' : 'bg-loss/10 hover:bg-loss/20'
                        }`}
                      >
                        <span className="text-xs text-muted-foreground block">{t('profitLossDollar')}</span>
                        <span className={`font-mono font-bold ${trade.profitLossDollar >= 0 ? 'text-win' : 'text-loss'}`}>
                          {trade.profitLossDollar >= 0 ? '+' : ''}${trade.profitLossDollar.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Profit/Loss % */}
                  <div className="flex-shrink-0">
                    {editingCell?.rowId === trade.id && editingCell?.column === 'profitLossPercent' ? (
                      <Input
                        type="number"
                        step="0.01"
                        defaultValue={trade.profitLossPercent}
                        onBlur={(e) => handleCellUpdate(trade.id, 'profitLossPercent', e.target.value, trade)}
                        autoFocus
                        className="h-9 w-24 font-mono"
                      />
                    ) : (
                      <div
                        onClick={() => setEditingCell({ rowId: trade.id, column: 'profitLossPercent' })}
                        className={`cursor-pointer px-3 py-1.5 rounded-lg transition-colors ${
                          trade.profitLossPercent >= 0 ? 'bg-win/10 hover:bg-win/20' : 'bg-loss/10 hover:bg-loss/20'
                        }`}
                      >
                        <span className="text-xs text-muted-foreground block">{t('profitLossPercent')}</span>
                        <span className={`font-mono font-bold ${trade.profitLossPercent >= 0 ? 'text-win' : 'text-loss'}`}>
                          {trade.profitLossPercent >= 0 ? '+' : ''}{trade.profitLossPercent.toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Max Percent - Only show for wins */}
                  {trade.result === 'win' && (
                    <div className="flex-shrink-0">
                      {editingCell?.rowId === trade.id && editingCell?.column === 'maxPercent' ? (
                        <Input
                          type="number"
                          step="0.01"
                          defaultValue={trade.maxPercent || ''}
                          onBlur={(e) => handleCellUpdate(trade.id, 'maxPercent', e.target.value, trade)}
                          autoFocus
                          className="h-9 w-24 font-mono"
                          placeholder="—"
                        />
                      ) : (
                        <div
                          onClick={() => setEditingCell({ rowId: trade.id, column: 'maxPercent' })}
                          className="cursor-pointer px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                        >
                          <span className="text-xs text-muted-foreground block flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {t('maxPercent')}
                          </span>
                          <span className="font-mono font-bold text-primary">
                            {trade.maxPercent !== null && trade.maxPercent !== undefined
                              ? `+${trade.maxPercent.toFixed(2)}%`
                              : '—'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Delete */}
                  <div className="flex-shrink-0 ml-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-muted-foreground hover:text-loss hover:bg-loss/10"
                      onClick={() => handleDeleteTrade(trade.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
