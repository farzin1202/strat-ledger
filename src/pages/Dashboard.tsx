import { useState } from 'react';
import { Plus, FolderOpen, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/Header';
import { StrategyCard } from '@/components/StrategyCard';
import { useData } from '@/contexts/DataContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newStrategyName, setNewStrategyName] = useState('');
  const { strategies, loading, addStrategy } = useData();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (newStrategyName.trim()) {
      await addStrategy(newStrategyName.trim());
      setNewStrategyName('');
      setIsCreateOpen(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold">{t('yourStrategies')}</h1>
            <p className="text-muted-foreground mt-1">
              {strategies.length} {t('strategies')}
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            {t('addStrategy')}
          </Button>
        </motion.div>

        {strategies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('noStrategies')}</h3>
            <p className="text-muted-foreground mb-6">{t('createFirst')}</p>
            <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              {t('addStrategy')}
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {strategies.map((strategy, index) => (
              <StrategyCard
                key={strategy.id}
                strategy={strategy}
                onClick={() => navigate(`/strategy/${strategy.id}`)}
                index={index}
              />
            ))}
          </div>
        )}
      </main>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('addStrategy')}</DialogTitle>
          </DialogHeader>
          <Input
            value={newStrategyName}
            onChange={(e) => setNewStrategyName(e.target.value)}
            placeholder={t('strategyName')}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleCreate}>{t('create')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
