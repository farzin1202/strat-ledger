import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Trade {
  id: string;
  date: string;
  pair: string;
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  riskReward: number;
  result: 'win' | 'loss';
  profitLossDollar: number;
  profitLossPercent: number;
  tradeCount: number;
  maxPercent?: number | null;
}

export interface Month {
  id: string;
  name: string;
  year: number;
  trades: Trade[];
}

export interface Strategy {
  id: string;
  name: string;
  months: Month[];
  createdAt: string;
}

export const useSupabaseData = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      // Fetch all strategies
      const { data: strategiesData, error: strategiesError } = await supabase
        .from('strategies')
        .select('*')
        .order('created_at', { ascending: true });

      if (strategiesError) throw strategiesError;

      // Fetch all months
      const { data: monthsData, error: monthsError } = await supabase
        .from('months')
        .select('*')
        .order('created_at', { ascending: true });

      if (monthsError) throw monthsError;

      // Fetch all trades
      const { data: tradesData, error: tradesError } = await supabase
        .from('trades')
        .select('*')
        .order('date', { ascending: true });

      if (tradesError) throw tradesError;

      // Map trades to months
      const monthsWithTrades = monthsData?.map(month => ({
        id: month.id,
        name: month.name,
        year: month.year,
        trades: tradesData
          ?.filter(trade => trade.month_id === month.id)
          .map(trade => ({
            id: trade.id,
            date: trade.date,
            pair: trade.pair,
            direction: trade.direction as 'long' | 'short',
            entryPrice: Number(trade.entry_price),
            exitPrice: Number(trade.exit_price),
            riskReward: Number(trade.risk_reward),
            result: trade.result as 'win' | 'loss',
            profitLossDollar: Number(trade.profit_loss_dollar),
            profitLossPercent: Number(trade.profit_loss_percent),
            tradeCount: trade.trade_count,
            maxPercent: trade.max_percent ? Number(trade.max_percent) : null,
          })) || [],
      })) || [];

      // Map months to strategies
      const strategiesWithMonths = strategiesData?.map(strategy => ({
        id: strategy.id,
        name: strategy.name,
        createdAt: strategy.created_at,
        months: monthsWithTrades.filter(month => 
          monthsData?.find(m => m.id === month.id && m.strategy_id === strategy.id)
        ),
      })) || [];

      setStrategies(strategiesWithMonths);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addStrategy = async (name: string) => {
    const { data, error } = await supabase
      .from('strategies')
      .insert({ name })
      .select()
      .single();

    if (error) {
      console.error('Error adding strategy:', error);
      return;
    }

    await fetchData();
    return data;
  };

  const updateStrategy = async (id: string, name: string) => {
    const { error } = await supabase
      .from('strategies')
      .update({ name })
      .eq('id', id);

    if (error) {
      console.error('Error updating strategy:', error);
      return;
    }

    await fetchData();
  };

  const deleteStrategy = async (id: string) => {
    const { error } = await supabase
      .from('strategies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting strategy:', error);
      return;
    }

    await fetchData();
  };

  const addMonth = async (strategyId: string, name: string, year: number) => {
    const { data, error } = await supabase
      .from('months')
      .insert({ strategy_id: strategyId, name, year })
      .select()
      .single();

    if (error) {
      console.error('Error adding month:', error);
      return;
    }

    await fetchData();
    return data;
  };

  const updateMonth = async (strategyId: string, monthId: string, name: string) => {
    const { error } = await supabase
      .from('months')
      .update({ name })
      .eq('id', monthId);

    if (error) {
      console.error('Error updating month:', error);
      return;
    }

    await fetchData();
  };

  const deleteMonth = async (strategyId: string, monthId: string) => {
    const { error } = await supabase
      .from('months')
      .delete()
      .eq('id', monthId);

    if (error) {
      console.error('Error deleting month:', error);
      return;
    }

    await fetchData();
  };

  const addTrade = async (strategyId: string, monthId: string, trade: Omit<Trade, 'id'>) => {
    const { data, error } = await supabase
      .from('trades')
      .insert({
        month_id: monthId,
        date: trade.date,
        pair: trade.pair,
        direction: trade.direction,
        entry_price: trade.entryPrice,
        exit_price: trade.exitPrice,
        risk_reward: trade.riskReward,
        result: trade.result,
        profit_loss_dollar: trade.profitLossDollar,
        profit_loss_percent: trade.profitLossPercent,
        trade_count: trade.tradeCount,
        max_percent: trade.maxPercent || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding trade:', error);
      return;
    }

    await fetchData();
    return data;
  };

  const updateTrade = async (strategyId: string, monthId: string, tradeId: string, trade: Partial<Trade>) => {
    const updateData: Record<string, unknown> = {};
    
    if (trade.date !== undefined) updateData.date = trade.date;
    if (trade.pair !== undefined) updateData.pair = trade.pair;
    if (trade.direction !== undefined) updateData.direction = trade.direction;
    if (trade.entryPrice !== undefined) updateData.entry_price = trade.entryPrice;
    if (trade.exitPrice !== undefined) updateData.exit_price = trade.exitPrice;
    if (trade.riskReward !== undefined) updateData.risk_reward = trade.riskReward;
    if (trade.result !== undefined) updateData.result = trade.result;
    if (trade.profitLossDollar !== undefined) updateData.profit_loss_dollar = trade.profitLossDollar;
    if (trade.profitLossPercent !== undefined) updateData.profit_loss_percent = trade.profitLossPercent;
    if (trade.tradeCount !== undefined) updateData.trade_count = trade.tradeCount;
    if (trade.maxPercent !== undefined) updateData.max_percent = trade.maxPercent;

    const { error } = await supabase
      .from('trades')
      .update(updateData)
      .eq('id', tradeId);

    if (error) {
      console.error('Error updating trade:', error);
      return;
    }

    await fetchData();
  };

  const deleteTrade = async (strategyId: string, monthId: string, tradeId: string) => {
    const { error } = await supabase
      .from('trades')
      .delete()
      .eq('id', tradeId);

    if (error) {
      console.error('Error deleting trade:', error);
      return;
    }

    await fetchData();
  };

  return {
    strategies,
    loading,
    addStrategy,
    updateStrategy,
    deleteStrategy,
    addMonth,
    updateMonth,
    deleteMonth,
    addTrade,
    updateTrade,
    deleteTrade,
    refetch: fetchData,
  };
};
