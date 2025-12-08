import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Trade } from '@/store/appStore';
import { useTranslation } from '@/hooks/useTranslation';

interface EquityCurveProps {
  trades: Trade[];
}

export const EquityCurve = ({ trades }: EquityCurveProps) => {
  const { t } = useTranslation();

  const chartData = useMemo(() => {
    let cumulativeProfit = 0;
    return trades.map((trade, index) => {
      cumulativeProfit += trade.profitLossPercent;
      return {
        trade: index + 1,
        equity: cumulativeProfit,
        date: trade.date,
      };
    });
  }, [trades]);

  const isPositive = chartData.length > 0 && chartData[chartData.length - 1].equity >= 0;

  if (trades.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold mb-4">{t('equityCurve')}</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          <p>{t('noTrades')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="font-semibold mb-4">{t('equityCurve')}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="equityGradientPositive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="equityGradientNegative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(350, 89%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(350, 89%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis
              dataKey="trade"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [`${value.toFixed(2)}%`, 'Equity']}
            />
            <Area
              type="monotone"
              dataKey="equity"
              stroke={isPositive ? 'hsl(168, 76%, 42%)' : 'hsl(350, 89%, 60%)'}
              strokeWidth={2}
              fill={isPositive ? 'url(#equityGradientPositive)' : 'url(#equityGradientNegative)'}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
