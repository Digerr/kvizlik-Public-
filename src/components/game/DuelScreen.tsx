'use client';

import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { getMixedQuestions } from '@/lib/quiz-data';
import { useTelegram } from '@/hooks/use-telegram';
import { ArrowLeft, Swords } from 'lucide-react';

export default function DuelScreen() {
  const { startDuel, setPhase } = useQuizStore();
  const { haptic } = useTelegram();

  const handleCreateDuel = () => {
    haptic('medium');
    const questions = getMixedQuestions(10, []);
    startDuel(questions);
  };

  return (
    <div className="min-h-[100dvh] bg-[#0f0a1e] px-4 py-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => { haptic('light'); setPhase('home'); }}
          className="w-9 h-9 rounded-xl bg-[#1a1235] border border-white/10 flex items-center justify-center hover:bg-[#221a45] active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-white/70" />
        </button>
        <h2 className="text-white font-bold text-lg">⚔️ Дуэль</h2>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <div className="text-7xl mb-4">⚔️</div>
        <h3 className="text-white text-2xl font-black mb-2">Режим дуэли</h3>
        <p className="text-white/50 text-sm leading-relaxed">
          Сразись с друзьями! Пройди квиз и отправь ссылку —
          пусть соперник попробует побить твой счёт.
        </p>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#1a1235] border border-white/10 rounded-2xl p-4 mb-6"
      >
        <p className="text-white/60 text-xs font-medium mb-3 uppercase tracking-wider">Как это работает</p>
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold shrink-0">1</span>
            <p className="text-white/70 text-sm">Ты отвечаешь на 10 вопросов</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold shrink-0">2</span>
            <p className="text-white/70 text-sm">Делишься ссылкой с другом</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold shrink-0">3</span>
            <p className="text-white/70 text-sm">Друг отвечает на те же вопросы</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xs font-bold shrink-0">🏆</span>
            <p className="text-white/70 text-sm">Победитель получает +20 монет!</p>
          </div>
        </div>
      </motion.div>

      {/* Create Duel Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleCreateDuel}
        className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-lg py-4 rounded-2xl mb-3 shadow-lg shadow-red-600/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-3"
      >
        <Swords className="w-5 h-5" /> Создать дуэль
      </motion.button>

      {/* Info about joining */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#1a1235] border border-white/5 rounded-2xl p-4 text-center"
      >
        <p className="text-white/40 text-xs">
          📩 Получил ссылку на дуэль? Просто открой её — и начнётся игра!
        </p>
      </motion.div>
    </div>
  );
}
