import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, BarChart3, ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { useTranslation } from '@/hooks/useTranslation';

export const OnboardingModal = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setHasSeenOnboarding } = useAppStore();
  const { t } = useTranslation();

  const handleComplete = () => {
    setHasSeenOnboarding(true);
  };

  const slides = [
    {
      icon: TrendingUp,
      title: t('welcomeTitle'),
      highlight: t('welcomeHighlight'),
      subtitle: t('welcomeSubtitle'),
    },
    {
      icon: BarChart3,
      title: t('trackTitle'),
      highlight: t('trackHighlight'),
      subtitle: t('trackSubtitle'),
      description: t('trackDescription'),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative glass-card rounded-2xl p-8 max-w-lg w-full mx-4 glow-primary"
      >
        <div className="flex justify-center mb-6">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${
                index === currentSlide ? 'bg-primary w-8' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
              {(() => {
                const IconComponent = slides[currentSlide].icon;
                return <IconComponent className="w-10 h-10 text-primary" />;
              })()}
            </div>

            <h2 className="text-2xl font-bold mb-2">
              {slides[currentSlide].title}{' '}
              <span className="text-primary">{slides[currentSlide].highlight}</span>
              {slides[currentSlide].subtitle && (
                <>
                  <br />
                  {slides[currentSlide].subtitle}
                </>
              )}
            </h2>

            {slides[currentSlide].description && (
              <p className="text-muted-foreground mt-4 leading-relaxed">
                {slides[currentSlide].description}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center mt-8 gap-3">
          {currentSlide < slides.length - 1 ? (
            <Button
              onClick={() => setCurrentSlide(currentSlide + 1)}
              className="px-8"
            >
              {t('next')}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="px-8 glow-primary"
            >
              {t('getStarted')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
