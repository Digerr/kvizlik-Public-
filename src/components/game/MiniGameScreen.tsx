"use client";
import { useQuizStore } from "@/lib/quiz-store";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function MiniGameScreen() {
  const { miniGameStatements, miniGameIndex, miniGameScore, miniGameTimer, answerMiniGame, setPhase } = useQuizStore();
  const current = miniGameStatements[miniGameIndex];
  const total = miniGameStatements.length;

  useEffect(() => {
    if (!current) return;
    const timer = setInterval(() => {
      // Auto-skip if time runs out
    }, 1000);
    return () => clearInterval(timer);
  }, [miniGameIndex, current]);

  if (!current) {
    return (
      <div className="p-4 min-h-[100dvh] bg-[var(--theme-bg)] flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">🎉</div>
        <div className="text-white text-2xl font-bold mb-2">Мини-игра окончена!</div>
        <div className="text-yellow-400 text-lg mb-6">{miniGameScore}/{total} правильных</div>
        <button onClick={() => setPhase("home")} className="px-6 py-3 bg-blue-500 rounded-xl text-white font-bold">
          На главную
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-[100dvh] bg-[var(--theme-bg)]">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setPhase("home")} className="text-white/60 text-sm">✕ Выйти</button>
        <div className="text-white font-bold">✅ Правда или Ложь</div>
        <div className="text-yellow-400 text-sm">{miniGameScore}/{miniGameIndex}/{total}</div>
      </div>

      <div className="w-full bg-white/10 rounded-full h-2 mb-8">
        <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${(miniGameIndex / total) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={miniGameIndex}
          className="bg-[var(--theme-card)] p-6 rounded-2xl text-center mb-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <div className="text-white text-lg font-medium leading-relaxed">
            {current.statement}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-4">
        <motion.button
          onClick={() => answerMiniGame(true)}
          className="p-5 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 font-bold text-lg"
          whileTap={{ scale: 0.95 }}
        >
          ✅ Правда
        </motion.button>
        <motion.button
          onClick={() => answerMiniGame(false)}
          className="p-5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-lg"
          whileTap={{ scale: 0.95 }}
        >
          ❌ Ложь
        </motion.button>
      </div>
    </div>
  );
}
