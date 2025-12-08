import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { TradeGrid } from '@/components/TradeGrid';
import { EquityCurve } from '@/components/EquityCurve';
import { AnalyticsCards } from '@/components/AnalyticsCards';
import { NotesSection } from '@/components/NotesSection';
import { useData } from '@/contexts/DataContext';
import { useTranslation } from '@/hooks/useTranslation';

const MonthWorkspace = () => {
  const { strategyId, monthId } = useParams();
  const navigate = useNavigate();
  const { strategies, loading, updateMonthNotes } = useData();
  const { t } = useTranslation();

  const strategy = strategies.find((s) => s.id === strategyId);
  const month = strategy?.months.find((m) => m.id === monthId);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!strategy || !month) {
    navigate('/');
    return null;
  }

  const handleSaveNotes = async (notes: string) => {
    await updateMonthNotes(monthId!, notes);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate(`/strategy/${strategyId}`)}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </Button>

          <div className="mb-8">
            <p className="text-muted-foreground text-sm">{strategy.name}</p>
            <h1 className="text-3xl font-bold">
              {month.name} {month.year}
            </h1>
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AnalyticsCards trades={month.trades} />
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <EquityCurve trades={month.trades} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <NotesSection
              notes={month.notes || ''}
              onSave={handleSaveNotes}
              title={t('monthNotes')}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TradeGrid
              trades={month.trades}
              strategyId={strategyId!}
              monthId={monthId!}
              monthYear={month.year}
              monthName={month.name}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MonthWorkspace;
