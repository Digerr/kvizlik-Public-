'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { CATEGORIES } from '@/lib/quiz-data';
import { useTelegram } from '@/hooks/use-telegram';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function GameScreen() {
  const {
    questions,
    currentQuestionIndex,
    timerRemaining,
    selectedOption,
    isRevealed,
    isTimerRunning,
    isFiftyFiftyActive,
    fiftyFiftyRemoved,
    isHintActive,
    freezeTimeRemaining,
    currentStreak,
    categoryId,
    timePerQuestion,
    powerUps,
    selectOption,
    revealAnswer,
    nextQuestion,
    tick,
    setPhase,
  } = useQuizStore();

  const { haptic } = useTelegram();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scorePopup, setScorePopup] = useState<{ amount: number; id: number } | null>(null);
  const popupIdRef = useRef(0);

  const question = questions[currentQuestionIndex];
  const category = CATEGORIES.find(c => c.id === categoryId);

  // Timer tick
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, tick]);

  // Auto reveal when selected
  useEffect(() => {
    if (selectedOption !== null && !isRevealed) {
      revealTimeoutRef.current = setTimeout(() => {
        revealAnswer();
      }, 500);
    }
    return () => {
      if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
    };
  }, [selectedOption, isRevealed, revealAnswer]);

  // Haptic on reveal
  useEffect(() => {
    if (isRevealed && question) {
      const isCorrect = selectedOption === question.correctIndex;
      haptic(isCorrect ? 'success' : 'error');

      if (isCorrect) {
        popupIdRef.current += 1;
        const amount = 10 + (question.difficulty * 5);
        setScorePopup({ amount, id: popupIdRef.current });
        setTimeout(() => setScorePopup(null), 1200);
      }
    }
  }, [isRevealed]);

  const handleSelect = (index: number) => {
    if (isRevealed) return;
    if (fiftyFiftyRemoved.includes(index)) return;
    haptic('light');
    selectOption(index);
  };

  const handlePowerUp = (id: string) => {
    if (isRevealed) return;
    const key = id as keyof typeof powerUps;
    if (powerUps[key] <= 0) return;
    haptic('medium');
    useQuizStore.getState().usePowerUp(id);
  };

  const handleNext = () => {
    haptic('light');
    nextQuestion();
  };

  if (!question) {
    return (
      <div className="min-h-[100dvh] bg-[#0f0a1e] flex items-center justify-center">
        <p className="text-white/50">Загрузка...</p>
      </div>
    );
  }

  const timerPercent = (timerRemaining / timePerQuestion) * 100;
  const timerColor = timerRemaining <= 3 ? 'text-red-400' : timerRemaining <= 7 ? 'text-yellow-400' : 'text-white';

  const getOptionStyle = (index: number) => {
    const isRemoved = fiftyFiftyRemoved.includes(index);
    const isCorrectOption = index === question.correctIndex;
    const isSelected = index === selectedOption;

    if (isRemoved) {
      return 'bg-[#1a1235]/50 border-white/5 text-white/20 pointer-events-none';
    }

    if (isRevealed) {
      if (isCorrectOption) {
        return 'bg-green-500/20 border-green-500/50 text-green-300';
      }
      if (isSelected && !isCorrectOption) {
        return 'bg-red-500/20 border-red-500/50 text-red-300';
      }
      return 'bg-[#1a1235]/50 border-white/5 text-white/30';
    }

    if (isHintActive && isCorrectOption) {
      return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200 shadow-lg shadow-yellow-500/10';
    }

    if (isSelected) {
      return 'bg-purple-500/20 border-purple-500/50 text-purple-200';
    }

    return 'bg-[#1a1235] border-white/10 text-white/90 hover:bg-[#221a45] active:scale-[0.98]';
  };

  return (
    <div className="min-h-[100dvh] bg-[#0f0a1e] flex flex-col px-4 py-3">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{category?.emoji || '🎲'}</span>
          <span className="text-white/70 text-sm font-medium">{category?.name || 'Микс'}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Streak */}
          {currentStreak > 0 && (
            <motion.span
              key={currentStreak}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="text-orange-400 text-sm font-bold"
            >
              🔥 {currentStreak}
            </motion.span>
          )}

          {/* Timer */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.5" fill="none"
                stroke={timerRemaining <= 3 ? '#f87171' : timerRemaining <= 7 ? '#facc15' : '#a78bfa'}
                strokeWidth="3"
                strokeDasharray={`${timerPercent} 100`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <span className={`absolute text-xs font-bold ${timerColor}`}>
              {freezeTimeRemaining > 0 ? '❄️' : timerRemaining}
            </span>
          </div>

          {/* Question Counter */}
          <span className="text-white/50 text-sm">
            {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>
      </div>

      {/* Power-ups */}
      <div className="flex gap-2 mb-4 justify-end">
        <button
          onClick={() => handlePowerUp('freeze')}
          disabled={powerUps.freeze <= 0 || isRevealed}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
            powerUps.freeze <= 0 || isRevealed
              ? 'bg-[#1a1235]/50 text-white/20 border border-white/5'
              : 'bg-[#1a1235] text-white/80 border border-white/10 hover:bg-[#221a45] active:scale-95'
          }`}
        >
          ❄️ <span>{powerUps.freeze}</span>
        </button>
        <button
          onClick={() => handlePowerUp('fiftyFifty')}
          disabled={powerUps.fiftyFifty <= 0 || isRevealed || isFiftyFiftyActive}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
            powerUps.fiftyFifty <= 0 || isRevealed || isFiftyFiftyActive
              ? 'bg-[#1a1235]/50 text-white/20 border border-white/5'
              : 'bg-[#1a1235] text-white/80 border border-white/10 hover:bg-[#221a45] active:scale-95'
          }`}
        >
          ✂️ <span>{powerUps.fiftyFifty}</span>
        </button>
        <button
          onClick={() => handlePowerUp('hint')}
          disabled={powerUps.hint <= 0 || isRevealed || isHintActive}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
            powerUps.hint <= 0 || isRevealed || isHintActive
              ? 'bg-[#1a1235]/50 text-white/20 border border-white/5'
              : 'bg-[#1a1235] text-white/80 border border-white/10 hover:bg-[#221a45] active:scale-95'
          }`}
        >
          💡 <span>{powerUps.hint}</span>
        </button>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col"
      >
        <div className="bg-[#1a1235] border border-white/10 rounded-2xl p-5 mb-5">
          <p className="text-white text-lg font-semibold text-center leading-relaxed">
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5 flex-1">
          {question.options.map((option, index) => {
            const isRemoved = fiftyFiftyRemoved.includes(index);
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelect(index)}
                disabled={isRevealed || isRemoved}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${getOptionStyle(index)}`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  isRevealed && index === question.correctIndex
                    ? 'bg-green-500/30 text-green-300'
                    : isRevealed && index === selectedOption && index !== question.correctIndex
                    ? 'bg-red-500/30 text-red-300'
                    : selectedOption === index
                    ? 'bg-purple-500/30 text-purple-300'
                    : 'bg-white/10 text-white/50'
                }`}>
                  {OPTION_LABELS[index]}
                </span>
                <span className="text-sm font-medium leading-snug">{option}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Fun Fact */}
        <AnimatePresence>
          {isRevealed && question.funFact && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-3 mt-3"
            >
              <p className="text-blue-300/80 text-xs">
                💡 <span className="font-medium">Интересный факт:</span> {question.funFact}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Button */}
        <AnimatePresence>
          {isRevealed && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-2xl mt-3 mb-2 shadow-lg shadow-purple-600/20 active:scale-[0.98] transition-transform"
            >
              Далее →
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Score Popup */}
      <AnimatePresence>
        {scorePopup && (
          <motion.div
            key={scorePopup.id}
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -60, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="fixed top-1/3 left-1/2 -translate-x-1/2 text-2xl font-black text-green-400 pointer-events-none z-50"
          >
            +{scorePopup.amount}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
