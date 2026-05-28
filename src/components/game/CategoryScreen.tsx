'use client';

import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { CATEGORIES, getQuestionsForCategory, getMixedQuestions } from '@/lib/quiz-data';
import { ArrowLeft, Shuffle, Zap } from 'lucide-react';

export default function CategoryScreen() {
  const { setPhase, startGame } = useQuizStore();

  const handleCategory = (categoryId: string) => {
    const questions = getQuestionsForCategory(categoryId, 10);
    startGame(categoryId, questions);
  };

  const handleMixed = () => {
    const questions = getMixedQuestions(10);
    startGame(null, questions);
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#0f0a1e] via-[#1a0f2e] to-[#0f0a1e] px-5 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setPhase('home')}
          className="text-white/50 hover:text-white/80 transition-colors text-sm flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>
        <h2 className="text-white font-bold text-lg">Выбери тему</h2>
        <div className="w-12" />
      </div>

      {/* Mixed mode */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={handleMixed}
        className="w-full mb-6 py-5 px-6 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 border border-purple-500/30 rounded-2xl transition-all active:scale-[0.98] flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
          <Shuffle className="w-6 h-6 text-white" />
        </div>
        <div className="text-left">
          <p className="text-white font-bold">Микс</p>
          <p className="text-white/40 text-xs">Вопросы из всех категорий</p>
        </div>
        <Zap className="w-5 h-5 text-purple-400 ml-auto" />
      </motion.button>

      {/* Categories grid */}
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => handleCategory(cat.id)}
            className="flex flex-col items-start gap-2 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all active:scale-[0.97] text-left"
          >
            <span className="text-3xl">{cat.emoji}</span>
            <p className="text-white font-semibold text-sm">{cat.name}</p>
            <p className="text-white/30 text-[10px] leading-tight">{cat.description}</p>
            <div
              className="h-1 w-8 rounded-full mt-1"
              style={{ backgroundColor: cat.color + '60' }}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
