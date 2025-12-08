import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Month, useAppStore } from '@/store/appStore';
import { useTranslation } from '@/hooks/useTranslation';

interface MonthCardProps {
  month: Month;
  strategyId: string;
  onClick: () => void;
  index: number;
}

export const MonthCard = ({ month, strategyId, onClick, index }: MonthCardProps) => {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newName, setNewName] = useState(month.name);
  const { updateMonth, deleteMonth } = useAppStore();
  const { t } = useTranslation();

  const wins = month.trades.filter((t) => t.result === 'win').length;
  const losses = month.trades.filter((t) => t.result === 'loss').length;
  const winRate = month.trades.length > 0 ? ((wins / month.trades.length) * 100).toFixed(1) : '0';
  
  const netProfit = month.trades.reduce((acc, trade) => acc + trade.profitLossPercent, 0);

  const handleRename = () => {
    updateMonth(strategyId, month.id, newName);
    setIsRenameOpen(false);
  };

  const handleDelete = () => {
    deleteMonth(strategyId, month.id);
    setIsDeleteOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="stat-card cursor-pointer group"
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">{month.year}</span>
            <h3 className="font-semibold text-lg">{month.name}</h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRenameOpen(true);
                }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                {t('rename')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteOpen(true);
                }}
                className="text-loss"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t('delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">{t('trades')}</p>
            <p className="font-mono font-semibold">{month.trades.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">{t('winRate')}</p>
            <p className={`font-mono font-semibold ${parseFloat(winRate) >= 50 ? 'text-win' : 'text-loss'}`}>
              {winRate}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">{t('netProfit')}</p>
            <div className={`flex items-center justify-center gap-1 font-mono font-semibold ${netProfit >= 0 ? 'text-win' : 'text-loss'}`}>
              {netProfit >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {netProfit.toFixed(2)}%
            </div>
          </div>
        </div>
      </motion.div>

      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('rename')}</DialogTitle>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t('monthName')}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleRename}>{t('rename')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deleteConfirm')}</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              {t('cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
