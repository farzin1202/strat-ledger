import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabaseData, Strategy, Trade, Month } from '@/hooks/useSupabaseData';

interface DataContextType {
  strategies: Strategy[];
  loading: boolean;
  addStrategy: (name: string) => Promise<unknown>;
  updateStrategy: (id: string, name: string, notes?: string) => Promise<void>;
  updateStrategyNotes: (id: string, notes: string) => Promise<void>;
  deleteStrategy: (id: string) => Promise<void>;
  addMonth: (strategyId: string, name: string, year: number) => Promise<unknown>;
  updateMonth: (strategyId: string, monthId: string, name: string) => Promise<void>;
  updateMonthNotes: (monthId: string, notes: string) => Promise<void>;
  deleteMonth: (strategyId: string, monthId: string) => Promise<void>;
  addTrade: (strategyId: string, monthId: string, trade: Omit<Trade, 'id'>) => Promise<unknown>;
  updateTrade: (strategyId: string, monthId: string, tradeId: string, trade: Partial<Trade>) => Promise<void>;
  deleteTrade: (strategyId: string, monthId: string, tradeId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const supabaseData = useSupabaseData();

  return (
    <DataContext.Provider value={supabaseData}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export type { Strategy, Trade, Month };
