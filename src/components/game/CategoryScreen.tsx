'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { CATEGORIES, getQuestionsForCategory, getMixedQuestions, getQuestionsByDifficulty, type Question } from '@/lib/quiz-data';
import { useTelegram } from '@/hooks/use-telegram';
import { ArrowLeft, Loader2, Skull } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const DIFFICULTY_OPTIONS = [
  { value: 1 as const, label: 'Легко', emoji: '🟢' },
  { value: 2 as const, label: 'Средне', emoji: '🟡' },
  { value: 3 as const, label: 'Сложно', emoji: '🔴' },
];

export default function CategoryScreen() {
  const { difficulty, setDifficulty, startGame, seenQuestions, setPhase, aiMode, setAiMode } = useQuizStore();
  const { haptic } = useTelegram();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAiQuestions = async (categoryId: string | null, diff: number, count: number): Promise<Question[]> => {
    const response = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: categoryId || 'general',
        difficulty: diff,
        count,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Ошибка генерации вопросов');
    }

    const data = await response.json();
    return data.questions;
  };

  const handleCategorySelect = async (categoryId: string | null, mode: "normal" | "survival" = "normal") => {
    haptic('light');
    setError(null);

    if (aiMode) {
      setIsLoading(true);
      try {
        const aiQuestions = await fetchAiQuestions(categoryId, difficulty, 10);
        startGame(categoryId, aiQuestions, true, mode);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при генерации вопросов');
        const questions = getQuestionsByDifficulty(categoryId, difficulty, 10, seenQuestions);
        if (questions.length === 0) {
          const fallback = categoryId
            ? getQuestionsForCategory(categoryId, 10, seenQuestions)
            : getMixedQuestions(10, seenQuestions);
          startGame(categoryId, fallback, false, mode);
        } else {
          startGame(categoryId, questions, false, mode);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      const questions = getQuestionsByDifficulty(categoryId, difficulty, 10, seenQuestions);
      if (questions.length === 0) {
        const fallback = categoryId
          ? getQuestionsForCategory(categoryId, 10, seenQuestions)
          : getMixedQuestions(10, seenQuestions);
        startGame(categoryId, fallback, false, mode);
      } else {
        startGame(categoryId, questions, false, mode);
      }
    }
  };

  const handleMixed = () => handleCategorySelect(null);
  const handleSurvival = () => handleCategorySelect(null, 'survival');

  return (
    <div className="min-h-[100dvh] bg-[var(--theme-bg)] px-4 py-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => { haptic('light'); setPhase('home'); }}
          className="w-9 h-9 rounded-xl bg-[var(--theme-card)] border border-white/10 flex items-center justify-center hover:bg-[var(--theme-card-hover)] active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-white/70" />
        </button>
        <h2 className="text-white font-bold text-lg">Выбери категорию</h2>
      </div>

      {/* Difficulty Selector */}
      <div className="flex gap-2 mb-4">
        {DIFFICULTY_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => { haptic('light'); setDifficulty(opt.value); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.97] ${
              difficulty === opt.value
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-600/20'
                : 'bg-[var(--theme-card)] border border-white/10 text-white/60 hover:bg-[var(--theme-card-hover)]'
            }`}
          >
            {opt.emoji} {opt.label}
          </button>
        ))}
      </div>

      {/* AI Mode Toggle */}
      <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <p className="text-white font-semibold text-sm">Бесконечный режим (AI)</p>
              <p className="text-white/40 text-xs">Вопросы генерирует нейросеть</p>
            </div>
          </div>
          <Switch
            checked={aiMode}
            onCheckedChange={(checked) => {
              haptic('light');
              setAiMode(checked);
            }}
            className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-white/10"
          />
        </div>
        {aiMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2"
          >
            <p className="text-purple-300/70 text-[11px] leading-relaxed">
              ✨ AI будет создавать уникальные вопросы. Когда вопросы закончатся, нейросеть сгенерирует новые — играй бесконечно!
            </p>
          </motion.div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-3">
          <p className="text-red-300 text-xs">⚠️ {error}. Используются стандартные вопросы.</p>
        </div>
      )}

      {/* Mixed Category */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleMixed}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/30 rounded-2xl p-4 mb-3 flex items-center gap-3 hover:from-purple-600/40 hover:to-blue-600/40 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        <span className="text-3xl">🎲</span>
        <div className="text-left">
          <p className="text-white font-bold">Микс (всё подряд)</p>
          <p className="text-white/50 text-xs">Вопросы из всех категорий</p>
        </div>
      </motion.button>

      {/* Survival Mode */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleSurvival}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-red-600/30 to-orange-600/30 border border-red-500/30 rounded-2xl p-4 mb-4 flex items-center gap-3 hover:from-red-600/40 hover:to-orange-600/40 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        <span className="text-3xl">💀</span>
        <div className="text-left">
          <p className="text-white font-bold">Выживание</p>
          <p className="text-white/50 text-xs">Одна ошибка = конец! Сложность растёт</p>
        </div>
        <Skull className="w-5 h-5 text-red-400 ml-auto" />
      </motion.button>

      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pb-4" style={{ maxHeight: 'calc(100dvh - 420px)' }}>
        {CATEGORIES.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleCategorySelect(cat.id)}
            disabled={isLoading}
            className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-4 flex flex-col items-start gap-2 hover:bg-[var(--theme-card-hover)] active:scale-[0.98] transition-all text-left disabled:opacity-50"
          >
            <span className="text-2xl">{cat.emoji}</span>
            <p className="text-white font-semibold text-sm leading-tight">{cat.name}</p>
            <p className="text-white/40 text-[10px] leading-tight">{cat.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-[var(--theme-bg)]/80 backdrop-blur-sm flex flex-col items-center justify-center z-50"
        >
          <div className="bg-[var(--theme-card)] border border-purple-500/30 rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl shadow-purple-600/10">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
              <span className="absolute inset-0 flex items-center justify-center text-xl">🤖</span>
            </div>
            <p className="text-white font-bold text-lg">Генерирую вопросы...</p>
            <p className="text-white/40 text-xs text-center">Нейросеть создаёт уникальные вопросы<br />для вашей квиз-игры</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
