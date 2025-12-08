import { TrendingUp } from 'lucide-react';
import { UserMenu } from '@/components/UserMenu';
import { useAuth } from '@/contexts/AuthContext';

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 glass-card border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Trading Journal</h1>
            <p className="text-xs text-muted-foreground">Pro Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user && <UserMenu />}
        </div>
      </div>
    </header>
  );
};
