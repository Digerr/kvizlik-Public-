'use client';

import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { CATEGORIES, getQuestionsForCategory, getMixedQuestions, getQuestionsByDifficulty } from '@/lib/quiz-data';
import { useTelegram } from '@/hooks/use-telegram';
import { ArrowLeft } from 'lucide-react';

const DIFFICULTY_OPTIONS = [
  { value: 1 as const, label: 'Легко', emoji: '🟢' },
  { value: 2 as const, label: 'Средне', emoji: '🟡' },
  { value: 3 as const, label: 'Сложно', emoji: '🔴' },
];

export default function CategoryScreen() {
  const { difficulty, setDifficulty, startGame, seenQuestions, setPhase } = useQuizStore();
  const { haptic } = useTelegram();

  const handleCategorySelect = (categoryId: string | null) => {
    haptic('light');
    const questions = getQuestionsByDifficulty(categoryId, difficulty, 10, seenQuestions);
    if (questions.length === 0) {
      // fallback
      const fallback = categoryId
        ? getQuestionsForCategory(categoryId, 10, seenQuestions)
        : getMixedQuestions(10, seenQuestions);
      startGame(categoryId, fallback);
    } else {
      startGame(categoryId, questions);
    }
  };

  const handleMixed = () => {
    haptic('light');
    const questions = getQuestionsByDifficulty(null, difficulty, 10, seenQuestions);
    if (questions.length === 0) {
      startGame(null, getMixedQuestions(10, seenQuestions));
    } else {
      startGame(null, questions);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#0f0a1e] px-4 py-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => { haptic('light'); setPhase('home'); }}
          className="w-9 h-9 rounded-xl bg-[#1a1235] border border-white/10 flex items-center justify-center hover:bg-[#221a45] active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-white/70" />
        </button>
        <h2 className="text-white font-bold text-lg">Выбери категорию</h2>
      </div>

      {/* Difficulty Selector */}
      <div className="flex gap-2 mb-5">
        {DIFFICULTY_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => { haptic('light'); setDifficulty(opt.value); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.97] ${
              difficulty === opt.value
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-600/20'
                : 'bg-[#1a1235] border border-white/10 text-white/60 hover:bg-[#221a45]'
            }`}
          >
            {opt.emoji} {opt.label}
          </button>
        ))}
      </div>

      {/* Mixed Category */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleMixed}
        className="w-full bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/30 rounded-2xl p-4 mb-4 flex items-center gap-3 hover:from-purple-600/40 hover:to-blue-600/40 active:scale-[0.98] transition-all"
      >
        <span className="text-3xl">🎲</span>
        <div className="text-left">
          <p className="text-white font-bold">Микс (всё подряд)</p>
          <p className="text-white/50 text-xs">Вопросы из всех категорий</p>
        </div>
      </motion.button>

      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pb-4" style={{ maxHeight: 'calc(100dvh - 220px)' }}>
        {CATEGORIES.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleCategorySelect(cat.id)}
            className="bg-[#1a1235] border border-white/10 rounded-2xl p-4 flex flex-col items-start gap-2 hover:bg-[#221a45] active:scale-[0.98] transition-all text-left"
          >
            <span className="text-2xl">{cat.emoji}</span>
            <p className="text-white font-semibold text-sm leading-tight">{cat.name}</p>
            <p className="text-white/40 text-[10px] leading-tight">{cat.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
