import { TrendingUp, TrendingDown, Target, Percent, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Trade } from '@/contexts/DataContext';
import { useTranslation } from '@/hooks/useTranslation';

interface AnalyticsCardsProps {
  trades: Trade[];
}

export const AnalyticsCards = ({ trades }: AnalyticsCardsProps) => {
  const { t } = useTranslation();

  const wins = trades.filter((t) => t.result === 'win').length;
  const losses = trades.filter((t) => t.result === 'loss').length;
  const winRate = trades.length > 0 ? ((wins / trades.length) * 100).toFixed(1) : '0';
  
  // Calculate total trade count (sum of all tradeCount fields)
  const totalTradeCount = trades.reduce((acc, t) => acc + (t.tradeCount || 1), 0);
  
  const totalProfit = trades
    .filter((t) => t.profitLossPercent > 0)
    .reduce((acc, t) => acc + t.profitLossPercent, 0);
  
  const totalLoss = Math.abs(
    trades
      .filter((t) => t.profitLossPercent < 0)
      .reduce((acc, t) => acc + t.profitLossPercent, 0)
  );

  const cards = [
    {
      title: t('totalTrades'),
      value: totalTradeCount.toString(),
      icon: BarChart3,
      positive: true,
      detail: `${trades.length} entries`,
    },
    {
      title: t('winRate'),
      value: `${winRate}%`,
      icon: Target,
      positive: parseFloat(winRate) >= 50,
      detail: `${wins}W / ${losses}L`,
    },
    {
      title: t('totalProfit'),
      value: `+${totalProfit.toFixed(2)}%`,
      icon: TrendingUp,
      positive: true,
      detail: `${trades.filter((t) => t.profitLossPercent > 0).length} trades`,
    },
    {
      title: t('totalLoss'),
      value: `-${totalLoss.toFixed(2)}%`,
      icon: TrendingDown,
      positive: false,
      detail: `${trades.filter((t) => t.profitLossPercent < 0).length} trades`,
    },
    {
      title: t('netProfit'),
      value: `${(totalProfit - totalLoss) >= 0 ? '+' : ''}${(totalProfit - totalLoss).toFixed(2)}%`,
      icon: Percent,
      positive: (totalProfit - totalLoss) >= 0,
      detail: `${trades.length} total entries`,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="stat-card"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              card.positive ? 'bg-win/10' : 'bg-loss/10'
            }`}>
              <card.icon className={`w-5 h-5 ${card.positive ? 'text-win' : 'text-loss'}`} />
            </div>
            <span className="text-sm text-muted-foreground">{card.title}</span>
          </div>
          <p className={`text-2xl font-bold font-mono ${card.positive ? 'text-win' : 'text-loss'}`}>
            {card.value}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{card.detail}</p>
        </motion.div>
      ))}
    </div>
  );
};
