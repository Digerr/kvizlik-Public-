'use client';

import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { useTelegram } from '@/hooks/use-telegram';
import { Home, Trophy, Swords } from 'lucide-react';
import { useEffect } from 'react';
import { playWin, playCoin } from '@/lib/sounds';

export default function DuelResultScreen() {
  const { duelResult, questions, setPhase } = useQuizStore();
  const { haptic } = useTelegram();

  useEffect(() => {
    if (duelResult?.won) {
      playWin();
      setTimeout(() => playCoin(), 800);
    }
  }, [duelResult?.won]);

  if (!duelResult) {
    return (
      <div className="min-h-[100dvh] bg-[#0f0a1e] flex items-center justify-center">
        <p className="text-white/50">Загрузка...</p>
      </div>
    );
  }

  const { myScore, opponentScore, opponentName, won } = duelResult;
  const totalQuestions = questions.length || 10;
  const isDraw = myScore === opponentScore;

  return (
    <div className="min-h-[100dvh] bg-[#0f0a1e] px-4 py-6 flex flex-col">
      {/* Winner Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 100 }}
        className="text-center mb-6"
      >
        <div className="text-6xl mb-2">
          {won ? '🏆' : isDraw ? '🤝' : '😤'}
        </div>
        <h2 className="text-white text-2xl font-black">
          {won ? 'Победа!' : isDraw ? 'Ничья!' : 'Поражение...'}
        </h2>
        {won && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-yellow-400 text-sm font-medium mt-1"
          >
            +20 🪙 бонус за победу!
          </motion.p>
        )}
      </motion.div>

      {/* Score Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#1a1235] border border-white/10 rounded-2xl p-5 mb-4"
      >
        <div className="flex items-center justify-between">
          {/* My Score */}
          <div className="flex-1 text-center">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className={`text-4xl font-black mb-1 ${won ? 'text-green-400' : isDraw ? 'text-yellow-400' : 'text-red-400'}`}
            >
              {myScore}
            </motion.div>
            <p className="text-white/50 text-xs mb-1">из {totalQuestions}</p>
            <p className="text-white/80 text-sm font-medium">Ты</p>
            {won && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring' }}
                className="inline-block mt-1 bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full"
              >
                👑 ПОБЕДИТЕЛЬ
              </motion.span>
            )}
          </div>

          {/* VS Divider */}
          <div className="flex flex-col items-center px-4">
            <Swords className="w-6 h-6 text-white/20 mb-1" />
            <span className="text-white/30 text-xs font-bold">VS</span>
          </div>

          {/* Opponent Score */}
          <div className="flex-1 text-center">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className={`text-4xl font-black mb-1 ${!won && !isDraw ? 'text-green-400' : 'text-white/70'}`}
            >
              {opponentScore}
            </motion.div>
            <p className="text-white/50 text-xs mb-1">из {totalQuestions}</p>
            <p className="text-white/80 text-sm font-medium">{opponentName}</p>
            {!won && !isDraw && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring' }}
                className="inline-block mt-1 bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full"
              >
                👑 ПОБЕДИТЕЛЬ
              </motion.span>
            )}
          </div>
        </div>

        {/* Score Bar Visual */}
        <div className="mt-5 flex items-center gap-2">
          <div className="flex-1 h-2.5 rounded-full overflow-hidden bg-white/5 flex">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: totalQuestions > 0 ? `${(myScore / totalQuestions) * 100}%` : '0%' }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </div>
          <div className="flex-1 h-2.5 rounded-full overflow-hidden bg-white/5 flex justify-end">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: totalQuestions > 0 ? `${(opponentScore / totalQuestions) * 100}%` : '0%' }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="h-full bg-gradient-to-l from-orange-500 to-red-500 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#1a1235] border border-white/10 rounded-2xl p-4 mb-4"
      >
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-white/40 text-[10px] mb-0.5">Разница</p>
            <p className={`text-lg font-bold ${won ? 'text-green-400' : isDraw ? 'text-yellow-400' : 'text-red-400'}`}>
              {won ? '+' : ''}{myScore - opponentScore}
            </p>
          </div>
          <div>
            <p className="text-white/40 text-[10px] mb-0.5">Точность</p>
            <p className="text-lg font-bold text-purple-400">
              {totalQuestions > 0 ? Math.round((myScore / totalQuestions) * 100) : 0}%
            </p>
          </div>
          <div>
            <p className="text-white/40 text-[10px] mb-0.5">Бонус</p>
            <p className="text-lg font-bold text-yellow-400">
              {won ? '+20' : '0'} 🪙
            </p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="mt-auto flex flex-col gap-2.5">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { haptic('light'); useQuizStore.setState({ duelMode: false, duelData: null, duelResult: null }); setPhase('duel'); }}
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-red-600/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <Swords className="w-4 h-4" /> Новая дуэль
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { haptic('light'); useQuizStore.setState({ duelMode: false, duelData: null, duelResult: null }); setPhase('home'); }}
          className="w-full bg-[#1a1235] border border-white/10 text-white/60 font-medium py-3 rounded-2xl hover:bg-[#221a45] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" /> На главную
        </motion.button>
      </div>
    </div>
  );
}
