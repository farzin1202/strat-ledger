import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface AppState {
  hasSeenOnboarding: boolean;
  theme: 'light' | 'dark';
  language: 'en' | 'fa';
  strategies: Strategy[];
  setHasSeenOnboarding: (value: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'en' | 'fa') => void;
  addStrategy: (name: string) => void;
  updateStrategy: (id: string, name: string) => void;
  deleteStrategy: (id: string) => void;
  addMonth: (strategyId: string, name: string, year: number) => void;
  updateMonth: (strategyId: string, monthId: string, name: string) => void;
  deleteMonth: (strategyId: string, monthId: string) => void;
  addTrade: (strategyId: string, monthId: string, trade: Omit<Trade, 'id'>) => void;
  updateTrade: (strategyId: string, monthId: string, tradeId: string, trade: Partial<Trade>) => void;
  deleteTrade: (strategyId: string, monthId: string, tradeId: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      theme: 'dark',
      language: 'en',
      strategies: [],

      setHasSeenOnboarding: (value) => set({ hasSeenOnboarding: value }),
      
      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ theme });
      },
      
      setLanguage: (language) => {
        document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
        set({ language });
      },

      addStrategy: (name) => set((state) => ({
        strategies: [...state.strategies, {
          id: generateId(),
          name,
          months: [],
          createdAt: new Date().toISOString(),
        }],
      })),

      updateStrategy: (id, name) => set((state) => ({
        strategies: state.strategies.map((s) =>
          s.id === id ? { ...s, name } : s
        ),
      })),

      deleteStrategy: (id) => set((state) => ({
        strategies: state.strategies.filter((s) => s.id !== id),
      })),

      addMonth: (strategyId, name, year) => set((state) => ({
        strategies: state.strategies.map((s) =>
          s.id === strategyId
            ? { ...s, months: [...s.months, { id: generateId(), name, year, trades: [] }] }
            : s
        ),
      })),

      updateMonth: (strategyId, monthId, name) => set((state) => ({
        strategies: state.strategies.map((s) =>
          s.id === strategyId
            ? {
                ...s,
                months: s.months.map((m) =>
                  m.id === monthId ? { ...m, name } : m
                ),
              }
            : s
        ),
      })),

      deleteMonth: (strategyId, monthId) => set((state) => ({
        strategies: state.strategies.map((s) =>
          s.id === strategyId
            ? { ...s, months: s.months.filter((m) => m.id !== monthId) }
            : s
        ),
      })),

      addTrade: (strategyId, monthId, trade) => set((state) => ({
        strategies: state.strategies.map((s) =>
          s.id === strategyId
            ? {
                ...s,
                months: s.months.map((m) =>
                  m.id === monthId
                    ? { ...m, trades: [...m.trades, { ...trade, id: generateId() }] }
                    : m
                ),
              }
            : s
        ),
      })),

      updateTrade: (strategyId, monthId, tradeId, trade) => set((state) => ({
        strategies: state.strategies.map((s) =>
          s.id === strategyId
            ? {
                ...s,
                months: s.months.map((m) =>
                  m.id === monthId
                    ? {
                        ...m,
                        trades: m.trades.map((t) =>
                          t.id === tradeId ? { ...t, ...trade } : t
                        ),
                      }
                    : m
                ),
              }
            : s
        ),
      })),

      deleteTrade: (strategyId, monthId, tradeId) => set((state) => ({
        strategies: state.strategies.map((s) =>
          s.id === strategyId
            ? {
                ...s,
                months: s.months.map((m) =>
                  m.id === monthId
                    ? { ...m, trades: m.trades.filter((t) => t.id !== tradeId) }
                    : m
                ),
              }
            : s
        ),
      })),
    }),
    {
      name: 'forex-journal-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.classList.toggle('dark', state.theme === 'dark');
          document.documentElement.dir = state.language === 'fa' ? 'rtl' : 'ltr';
          document.documentElement.lang = state.language;
        }
      },
    }
  )
);
