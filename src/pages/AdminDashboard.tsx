import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Key, Plus, Trash2, Power, LogOut, Copy, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ApiKey {
  id: string;
  key_name: string;
  api_key: string;
  is_active: boolean;
  created_at: string;
}

const AdminDashboard = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const session = localStorage.getItem('admin_session');
    if (!session) {
      navigate('/admin');
      return;
    }

    fetchApiKeys();
  }, [navigate]);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase.rpc('get_api_keys');
      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast.error('خطا در بارگیری کلیدها');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('نام کلید را وارد کنید');
      return;
    }

    try {
      const { data, error } = await supabase.rpc('generate_api_key', {
        p_key_name: newKeyName,
      });

      if (error) throw error;

      toast.success('کلید جدید ایجاد شد');
      setNewKeyName('');
      fetchApiKeys();
    } catch (error) {
      console.error('Error generating key:', error);
      toast.error('خطا در ایجاد کلید');
    }
  };

  const handleToggleKey = async (keyId: string) => {
    try {
      const { error } = await supabase.rpc('toggle_api_key', {
        p_key_id: keyId,
      });

      if (error) throw error;

      toast.success('وضعیت کلید تغییر کرد');
      fetchApiKeys();
    } catch (error) {
      console.error('Error toggling key:', error);
      toast.error('خطا در تغییر وضعیت');
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    try {
      const { error } = await supabase.rpc('delete_api_key', {
        p_key_id: keyId,
      });

      if (error) throw error;

      toast.success('کلید حذف شد');
      fetchApiKeys();
    } catch (error) {
      console.error('Error deleting key:', error);
      toast.error('خطا در حذف کلید');
    }
  };

  const handleCopyKey = (keyId: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(keyId);
    toast.success('کلید کپی شد');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">در حال بارگیری...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">پنل مدیریت</h1>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            خروج
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Generate New Key */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Key className="w-5 h-5" />
              ایجاد کلید جدید
            </h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="keyName">نام کلید</Label>
                <Input
                  id="keyName"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="مثال: Production API"
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleGenerateKey} className="gap-2 glow-primary">
                  <Plus className="w-4 h-4" />
                  ایجاد
                </Button>
              </div>
            </div>
          </div>

          {/* API Keys List */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">کلیدهای API</h2>
            
            {apiKeys.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                هنوز کلیدی ایجاد نشده است
              </div>
            ) : (
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <motion.div
                    key={key.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 rounded-xl border ${
                      key.is_active ? 'border-win/30 bg-win/5' : 'border-loss/30 bg-loss/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold">{key.key_name}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {key.api_key.substring(0, 16)}...
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(key.created_at).toLocaleDateString('fa-IR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyKey(key.id, key.api_key)}
                        >
                          {copiedId === key.id ? (
                            <Check className="w-4 h-4 text-win" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleKey(key.id)}
                          className={key.is_active ? 'text-win' : 'text-loss'}
                        >
                          <Power className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteKey(key.id)}
                          className="text-loss hover:bg-loss/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
