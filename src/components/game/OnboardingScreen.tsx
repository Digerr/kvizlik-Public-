'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { usePlatform } from '@/hooks/use-platform';

const SLIDES = [
  {
    emoji: '🧠',
    title: 'Добро пожаловать в КВИЗЛИК!',
    description: 'Захватывающая викторина, где ты сможешь проверить свои знания в разных категориях — от науки до кино, от истории до спорта!',
    gradient: 'from-purple-600 to-blue-600',
  },
  {
    emoji: '🎮',
    title: 'Играй и зарабатывай',
    description: 'Выбирай категорию, отвечай на вопросы и получай очки. Чем быстрее и точнее отвечаешь — тем больше монет зарабатываешь. Используй бонусы, чтобы помочь себе!',
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    emoji: '⚔️',
    title: 'Дуэли и выживание',
    description: 'Вызывай друзей на дуэль — кто больше правильных ответов, тот победил! Или попробуй режим выживания, где одна ошибка — конец игры.',
    gradient: 'from-red-600 to-orange-600',
  },
  {
    emoji: '🏆',
    title: 'Лиги и достижения',
    description: 'Поднимайся по лигам — от Бронзы до Алмаза. Собирай достижения, открывай сундуки с наградами и качай сезонный пропуск!',
    gradient: 'from-yellow-600 to-amber-600',
  },
  {
    emoji: '🔥',
    title: 'Ежедневные задания',
    description: 'Заходи каждый день, выполняй задания и получай бонусы. Серия дней подряд увеличивает награды, а 7-дневная цепочка даёт серебряный сундук!',
    gradient: 'from-orange-600 to-red-600',
  },
  {
    emoji: '🚀',
    title: 'Готов?',
    description: 'Начни прямо сейчас — выбирай категорию и погнали! Удачи! 🎯',
    gradient: 'from-green-600 to-emerald-600',
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setHasSeenTutorial } = useQuizStore();
  const { haptic } = usePlatform();

  const isLast = currentSlide === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      haptic('success');
      setHasSeenTutorial(true);
    } else {
      haptic('light');
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleSkip = () => {
    haptic('light');
    setHasSeenTutorial(true);
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="min-h-[100dvh] bg-[var(--theme-bg)] flex flex-col items-center justify-center px-6 py-8 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          background: `linear-gradient(to right, var(--tw-gradient-stops))`,
        }}
      />
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-15 blur-2xl pointer-events-none bg-gradient-to-r"
        style={{
          backgroundImage: `linear-gradient(to right, ${currentSlide === 0 ? '#9333ea, #2563eb' : currentSlide === 1 ? '#2563eb, #0891b2' : currentSlide === 2 ? '#dc2626, #ea580c' : currentSlide === 3 ? '#ca8a04, #d97706' : currentSlide === 4 ? '#ea580c, #dc2626' : '#16a34a, #059669'})`,
        }}
      />

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 text-white/40 text-sm font-medium hover:text-white/60 transition-colors z-10"
      >
        Пропустить
      </button>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm w-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            {/* Emoji */}
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="text-7xl mb-6"
            >
              {slide.emoji}
            </motion.div>

            {/* Title */}
            <h2 className="text-white font-bold text-2xl mb-4 leading-tight">
              {slide.title}
            </h2>

            {/* Description */}
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section: dots + button */}
      <div className="w-full max-w-sm relative z-10">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrentSlide(i); haptic('light'); }}
              className={`rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? 'w-6 h-2 bg-white'
                  : i < currentSlide
                  ? 'w-2 h-2 bg-white/50'
                  : 'w-2 h-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Action button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg active:scale-[0.98] transition-transform bg-gradient-to-r ${slide.gradient}`}
          style={{
            boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
          }}
        >
          {isLast ? '🎮 Начать играть!' : 'Далее →'}
        </motion.button>

        {/* Step counter */}
        <p className="text-white/20 text-xs text-center mt-3">
          {currentSlide + 1} из {SLIDES.length}
        </p>
      </div>
    </div>
  );
}
