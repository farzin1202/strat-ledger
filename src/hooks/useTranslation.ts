import { useAppStore } from '@/store/appStore';
import { translations, TranslationKey } from '@/lib/translations';

export const useTranslation = () => {
  const language = useAppStore((state) => state.language);
  
  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return { t, language };
};
