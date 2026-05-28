'use client';

import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { getLeagueByScore, CATEGORIES } from '@/lib/quiz-data';
import { Trophy, RotateCcw, Home, Zap, Target, Clock, Flame, TrendingUp } from 'lucide-react';

export default function ResultScreen() {
  const {
    answers,
    questions,
    totalScore,
    gamesPlayed,
    bestStreak,
    categoryId,
    playAgain,
    setPhase,
    resetAll,
  } = useQuizStore();

  const correctCount = answers.filter(a => a.isCorrect).length;
  const totalQ = questions.length;
  const percentage = Math.round((correctCount / totalQ) * 100);
  const avgTime = answers.length > 0
    ? (answers.reduce((sum, a) => sum + a.timeSpent, 0) / answers.length).toFixed(1)
    : '0';
  const league = getLeagueByScore(totalScore);
  const category = CATEGORIES.find(c => c.id === categoryId);

  const getEmoji = () => {
    if (percentage === 100) return '🏆';
    if (percentage >= 80) return '🌟';
    if (percentage >= 60) return '👏';
    if (percentage >= 40) return '🤔';
    return '😅';
  };

  const getMessage = () => {
    if (percentage === 100) return 'Идеально!';
    if (percentage >= 80) return 'Отлично!';
    if (percentage >= 60) return 'Хороший результат!';
    if (percentage >= 40) return 'Неплохо, но можно лучше';
    return 'Попробуй ещё раз!';
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#0f0a1e] via-[#1a0f2e] to-[#0f0a1e] flex flex-col items-center px-6 py-8 overflow-y-auto">
      {/* Emoji */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="text-6xl mb-4"
      >
        {getEmoji()}
      </motion.div>

      {/* Message */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-white text-2xl font-black mb-1"
      >
        {getMessage()}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-white/40 text-sm mb-6"
      >
        {category?.name || 'Микс'} · {correctCount} из {totalQ}
      </motion.p>

      {/* Score circle */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="relative w-36 h-36 mb-6"
      >
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke={percentage >= 60 ? '#8b5cf6' : '#ef4444'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 264} 264`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white text-3xl font-black">{percentage}%</span>
          <span className="text-white/30 text-xs">правильных</span>
        </div>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-3 gap-3 w-full max-w-sm mb-6"
      >
        <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
          <Target className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <p className="text-white font-bold">{correctCount}</p>
          <p className="text-white/30 text-[10px]">Верных</p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
          <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-white font-bold">{avgTime}с</p>
          <p className="text-white/30 text-[10px]">Среднее</p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
          <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
          <p className="text-white font-bold">{bestStreak}</p>
          <p className="text-white/30 text-[10px]">Серия</p>
        </div>
      </motion.div>

      {/* League */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-4 mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{league.emoji}</span>
            <div>
              <p className="text-white font-bold text-sm">{league.name}</p>
              <p className="text-white/30 text-xs">Текущая лига</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 font-bold text-sm">{totalScore}</span>
          </div>
        </div>
      </motion.div>

      {/* Answer review */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-sm mb-6"
      >
        <p className="text-white/30 text-xs font-medium mb-3">Ваши ответы</p>
        <div className="flex flex-col gap-1.5">
          {questions.map((q, i) => {
            const answer = answers[i];
            const isCorrect = answer?.isCorrect ?? false;
            return (
              <div
                key={q.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                  isCorrect ? 'bg-emerald-500/10' : 'bg-red-500/10'
                }`}
              >
                <span className={`shrink-0 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isCorrect ? '✓' : '✗'}
                </span>
                <span className="text-white/50 truncate flex-1">{q.question}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col gap-3 w-full max-w-sm"
      >
        <button
          onClick={playAgain}
          className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-base rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Играть снова
        </button>
        <button
          onClick={resetAll}
          className="w-full py-3 px-6 bg-white/5 hover:bg-white/10 text-white/50 font-medium text-sm rounded-2xl border border-white/5 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          На главную
        </button>
      </motion.div>
    </div>
  );
}
