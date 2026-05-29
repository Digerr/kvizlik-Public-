"use client";
import { useQuizStore } from "@/lib/quiz-store";
import { useTelegram } from "@/hooks/use-telegram";
import { motion } from "framer-motion";
import { ArrowLeft, Lock } from "lucide-react";

export default function ClanScreen() {
  const { setPhase } = useQuizStore();
  const { haptic } = useTelegram();

  return (
    <div className="min-h-[100dvh] bg-[var(--theme-bg)] px-4 py-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => { haptic('light'); setPhase('home'); }}
          className="w-9 h-9 rounded-xl bg-[var(--theme-card)] border border-white/10 flex items-center justify-center hover:bg-[var(--theme-card-hover)] active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-white/70" />
        </button>
        <h2 className="text-white font-bold text-lg">🏰 Кланы</h2>
      </div>

      {/* Coming Soon */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="mb-6"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-purple-400/60" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-white font-bold text-xl mb-2">Скоро!</h3>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Кланы пока в разработке. Скоро вы сможете создавать кланы, приглашать друзей и соревноваться за командный рейтинг!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 max-w-xs"
        >
          <p className="text-purple-300 text-xs leading-relaxed">
            🏰 Командные рейтинги<br />
            ⚔️ Клановые турниры<br />
            🎁 Эксклюзивные награды<br />
            👥 До 10 участников
          </p>
        </motion.div>
      </div>
    </div>
  );
}
