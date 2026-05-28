'use client';

import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { getLeagueByScore } from '@/lib/quiz-data';
import { Brain, Trophy, Zap, BookOpen, ChevronRight, Flame } from 'lucide-react';

export default function HomeScreen() {
  const { setPhase, totalScore, gamesPlayed, bestStreak, playerName } = useQuizStore();
  const league = getLeagueByScore(totalScore);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-[#0f0a1e] via-[#1a0f2e] to-[#0f0a1e] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[150px]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center px-6 pt-12 pb-8 flex-1">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="mb-4"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.4)]">
            <Brain className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-black text-white tracking-wide mb-1"
        >
          КВИЗЛИК
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-purple-300/60 text-sm mb-8"
        >
          Проверь свои знания
        </motion.p>

        {/* Stats card */}
        {gamesPlayed > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-4 mb-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{league.emoji}</span>
              <div>
                <p className="text-white font-bold">{league.name}</p>
                <p className="text-white/40 text-xs">{totalScore} очков</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-white/50 text-xs">{gamesPlayed} игр</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-white/50 text-xs">Серия: {bestStreak}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3 w-full max-w-sm"
        >
          <button
            onClick={() => setPhase('category')}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <Zap className="w-6 h-6" />
            Играть
          </button>

          <button
            onClick={() => setPhase('leaderboard')}
            className="w-full py-3.5 px-6 bg-white/5 hover:bg-white/10 text-white/70 font-semibold text-base rounded-2xl border border-white/10 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <Trophy className="w-5 h-5 text-amber-400" />
            Рейтинг
          </button>

          <button
            onClick={() => setPhase('category')}
            className="w-full py-3 px-6 bg-white/5 hover:bg-white/10 text-white/50 font-medium text-sm rounded-2xl border border-white/5 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Как играть
          </button>
        </motion.div>
      </div>

      {/* Bottom decoration */}
      <div className="relative z-10 px-6 pb-6">
        <div className="flex items-center justify-center gap-2 text-white/15 text-xs">
          <span>v1.0 demo</span>
          <span>·</span>
          <span>80 вопросов</span>
          <span>·</span>
          <span>8 категорий</span>
        </div>
      </div>
    </div>
  );
}
