'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { CATEGORIES } from '@/lib/quiz-data';
import { Check, X, Clock, ChevronRight, Flame, Sparkles } from 'lucide-react';

export default function GameScreen() {
  const {
    questions,
    currentQuestionIndex,
    timerRemaining,
    selectedOption,
    isRevealed,
    currentStreak,
    categoryId,
    selectOption,
    revealAnswer,
    nextQuestion,
    tick,
  } = useQuizStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const question = questions[currentQuestionIndex];
  const category = CATEGORIES.find(c => c.id === categoryId);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      tick();
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tick, currentQuestionIndex]);

  const handleSelect = useCallback((index: number) => {
    if (isRevealed) return;
    selectOption(index);
  }, [isRevealed, selectOption]);

  const handleConfirm = useCallback(() => {
    if (selectedOption === null) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    revealAnswer();
  }, [selectedOption, revealAnswer]);

  const handleNext = useCallback(() => {
    nextQuestion();
  }, [nextQuestion]);

  if (!question) return null;

  const progress = timerRemaining / 15;
  const isLow = timerRemaining <= 5;
  const isCorrect = selectedOption === question.correctIndex;
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#0f0a1e] via-[#1a0f2e] to-[#0f0a1e] flex flex-col px-5 py-6 relative overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{category?.emoji || '🎲'}</span>
          <span className="text-white/40 text-xs">{category?.name || 'Микс'}</span>
        </div>
        <div className="flex items-center gap-3">
          {currentStreak >= 2 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 bg-orange-500/20 px-2 py-0.5 rounded-full"
            >
              <Flame className="w-3 h-3 text-orange-400" />
              <span className="text-orange-300 text-xs font-bold">{currentStreak}</span>
            </motion.div>
          )}
          <span className="text-white/40 text-xs">
            {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 mb-6">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i < currentQuestionIndex
                ? 'bg-purple-500'
                : i === currentQuestionIndex
                ? 'bg-purple-400'
                : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* Timer */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-16 h-16">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke={isLow ? '#ef4444' : '#8b5cf6'}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${progress * 264} 264`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Clock className={`w-5 h-5 ${isLow ? 'text-red-400' : 'text-purple-400'}`} />
          </div>
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="flex-1 flex flex-col"
        >
          {/* Question card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold text-white"
                style={{ backgroundColor: (category?.color || '#8b5cf6') + '40' }}
              >
                {currentQuestionIndex + 1}
              </div>
              <h2 className="text-white font-bold text-lg leading-snug">
                {question.question}
              </h2>
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-2.5 mb-6">
            {question.options.map((option, i) => {
              const isSelected = selectedOption === i;
              const isCorrectOption = i === question.correctIndex;
              const showCorrect = isRevealed && isCorrectOption;
              const showWrong = isRevealed && isSelected && !isCorrectOption;

              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleSelect(i)}
                  disabled={isRevealed}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all active:scale-[0.98] ${
                    showCorrect
                      ? 'bg-emerald-600/20 border-emerald-500/40'
                      : showWrong
                      ? 'bg-red-600/20 border-red-500/40'
                      : isSelected && !isRevealed
                      ? 'bg-purple-600/20 border-purple-500/40'
                      : 'bg-white/5 border-white/5 hover:bg-white/8'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      showCorrect
                        ? 'bg-emerald-500 text-white'
                        : showWrong
                        ? 'bg-red-500 text-white'
                        : isSelected && !isRevealed
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white/40'
                    }`}
                  >
                    {showCorrect ? (
                      <Check className="w-4 h-4" />
                    ) : showWrong ? (
                      <X className="w-4 h-4" />
                    ) : (
                      optionLabels[i]
                    )}
                  </div>
                  <span
                    className={`font-medium text-sm text-left ${
                      showCorrect
                        ? 'text-emerald-300'
                        : showWrong
                        ? 'text-red-300'
                        : isSelected && !isRevealed
                        ? 'text-purple-200'
                        : 'text-white/70'
                    }`}
                  >
                    {option}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Fun fact */}
          {isRevealed && question.funFact && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-4 flex items-start gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-amber-200/70 text-xs leading-relaxed">{question.funFact}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Action button */}
      <div className="mt-auto pt-4">
        {!isRevealed ? (
          <button
            onClick={handleConfirm}
            disabled={selectedOption === null}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base transition-all active:scale-95 flex items-center justify-center gap-2 ${
              selectedOption !== null
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            Ответить
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-base rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {currentQuestionIndex < questions.length - 1 ? (
              <>
                Следующий
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              'Результаты'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
