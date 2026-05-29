"use client";
import { useQuizStore } from "@/lib/quiz-store";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

export default function MiniGameScreen() {
  const { miniGameStatements, miniGameIndex, miniGameScore, miniGameTimer, answerMiniGame, startMiniGame, setPhase } = useQuizStore();
  const [showResult, setShowResult] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(7);

  const current = miniGameStatements[miniGameIndex];
  const total = miniGameStatements.length;

  // If no statements, show start screen
  if (miniGameStatements.length === 0) {
    return (
      <div className="p-4 min-h-[100dvh] bg-[var(--theme-bg)] flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">🎯</div>
        <div className="text-white text-2xl font-bold mb-2">Правда или Ложь</div>
        <div className="text-white/50 text-sm mb-6 text-center">Определи, какие утверждения правдивы, а какие — нет!</div>
        <button
          onClick={() => { startMiniGame(); }}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-bold text-lg active:scale-95 transition-transform"
        >
          🎮 Начать
        </button>
        <button
          onClick={() => setPhase("home")}
          className="mt-3 text-white/40 text-sm"
        >
          ← На главную
        </button>
      </div>
    );
  }

  // If game is over (no more current statement but we had statements)
  if (!current && miniGameStatements.length > 0) {
    return (
      <div className="p-4 min-h-[100dvh] bg-[var(--theme-bg)] flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">🎉</div>
        <div className="text-white text-2xl font-bold mb-2">Мини-игра окончена!</div>
        <div className="text-yellow-400 text-lg mb-2">{miniGameScore}/{total} правильных</div>
        <div className="text-white/40 text-sm mb-6">
          {miniGameScore === total ? "Идеально! 🏆" : miniGameScore >= total * 0.7 ? "Отлично! 🔥" : miniGameScore >= total * 0.5 ? "Неплохо! 👍" : "Попробуй ещё! 💪"}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { startMiniGame(); }}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-bold active:scale-95 transition-transform"
          >
            🔄 Ещё раз
          </button>
          <button
            onClick={() => setPhase("home")}
            className="px-6 py-3 bg-white/10 rounded-xl text-white font-bold active:scale-95 transition-transform"
          >
            🏠 Главная
          </button>
        </div>
      </div>
    );
  }

  const handleAnswer = (answer: boolean) => {
    if (showResult !== null) return;
    setShowResult(answer === current.isTrue ? true : false);
    setTimeout(() => {
      setShowResult(null);
      answerMiniGame(answer);
    }, 1200);
  };

  return (
    <div className="p-4 min-h-[100dvh] bg-[var(--theme-bg)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setPhase("home")} className="text-white/60 text-sm">✕ Выйти</button>
        <div className="text-white font-bold">✅ Правда или Ложь</div>
        <div className="text-yellow-400 text-sm">{miniGameScore}/{miniGameIndex}/{total}</div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/10 rounded-full h-2 mb-8">
        <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${(miniGameIndex / total) * 100}%` }} />
      </div>

      {/* Statement */}
      <AnimatePresence mode="wait">
        <motion.div
          key={miniGameIndex}
          className="bg-[var(--theme-card)] p-6 rounded-2xl text-center mb-8 border border-white/10"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <div className="text-white text-lg font-medium leading-relaxed">
            {current?.statement}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Result feedback */}
      <AnimatePresence>
        {showResult !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`text-center mb-4 py-3 rounded-xl font-bold ${
              showResult
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {showResult ? "✅ Правильно!" : `❌ ${current?.isTrue ? "Это правда!" : "Это ложь!"}`}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer buttons */}
      <div className="grid grid-cols-2 gap-4 mt-auto">
        <motion.button
          onClick={() => handleAnswer(true)}
          disabled={showResult !== null}
          className={`p-5 rounded-xl border font-bold text-lg transition-all ${
            showResult !== null
              ? "opacity-50"
              : "active:scale-95"
          } bg-green-500/20 border-green-500/30 text-green-400`}
          whileTap={showResult === null ? { scale: 0.95 } : undefined}
        >
          ✅ Правда
        </motion.button>
        <motion.button
          onClick={() => handleAnswer(false)}
          disabled={showResult !== null}
          className={`p-5 rounded-xl border font-bold text-lg transition-all ${
            showResult !== null
              ? "opacity-50"
              : "active:scale-95"
          } bg-red-500/20 border-red-500/30 text-red-400`}
          whileTap={showResult === null ? { scale: 0.95 } : undefined}
        >
          ❌ Ложь
        </motion.button>
      </div>
    </div>
  );
}
