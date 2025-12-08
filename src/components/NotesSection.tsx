import { useState, useEffect } from 'react';
import { FileText, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

interface NotesSectionProps {
  notes: string;
  onSave: (notes: string) => Promise<void>;
  title?: string;
}

export const NotesSection = ({ notes, onSave, title }: NotesSectionProps) => {
  const [localNotes, setLocalNotes] = useState(notes);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setLocalNotes(notes);
    setHasChanges(false);
  }, [notes]);

  const handleChange = (value: string) => {
    setLocalNotes(value);
    setHasChanges(value !== notes);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(localNotes);
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">{title || t('notes')}</h3>
        </div>
        {hasChanges && (
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            size="sm"
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? t('saving') : t('save')}
          </Button>
        )}
      </div>
      <Textarea
        value={localNotes}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={t('notesPlaceholder')}
        className="min-h-[120px] resize-none bg-muted/30 border-muted"
      />
    </motion.div>
  );
};