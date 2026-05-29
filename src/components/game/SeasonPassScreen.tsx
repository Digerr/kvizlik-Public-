"use client";
import { useQuizStore } from "@/lib/quiz-store";
import { SEASON_PASS_TIERS } from "@/lib/quiz-data";
import { motion } from "framer-motion";

export default function SeasonPassScreen() {
  const { seasonScore, seasonPassTier, seasonPassClaimed, claimSeasonPassTier, setPhase, coins } = useQuizStore();

  return (
    <div className="p-4 min-h-[100dvh] bg-[var(--theme-bg)]">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setPhase("home")} className="text-white/60 text-sm">← Назад</button>
        <h2 className="text-xl font-bold text-white">🏆 Сезонный проход</h2>
        <div className="text-yellow-400 text-sm">🎯 {seasonScore} XP</div>
      </div>

      <div className="space-y-3">
        {SEASON_PASS_TIERS.map((tier) => {
          const unlocked = seasonScore >= tier.xpRequired;
          const claimed = seasonPassClaimed.includes(tier.tier);
          const rewardText = tier.reward.type === "coins" ? `${tier.reward.amount} монет`
            : tier.reward.type === "avatar" ? `Аватар ${tier.reward.value}`
            : tier.reward.type === "frame" ? `Рамка ${tier.reward.value}`
            : tier.reward.type === "theme" ? `Тема ${tier.reward.value}`
            : `Сундук ${tier.reward.value}`;

          return (
            <motion.div
              key={tier.tier}
              className={`p-4 rounded-xl border ${
                claimed ? "border-green-500/50 bg-green-500/10" :
                unlocked ? "border-yellow-500/50 bg-yellow-500/10" :
                "border-white/10 bg-[var(--theme-card)]"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: tier.tier * 0.05 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">Уровень {tier.tier}</div>
                  <div className="text-white/60 text-sm">{tier.xpRequired} XP → {rewardText}</div>
                </div>
                {claimed ? (
                  <span className="text-green-400 text-sm">✅ Получено</span>
                ) : unlocked ? (
                  <button
                    onClick={() => claimSeasonPassTier(tier.tier)}
                    className="px-3 py-1 bg-yellow-500 text-black rounded-lg text-sm font-bold"
                  >
                    Забрать!
                  </button>
                ) : (
                  <span className="text-white/30 text-sm">🔒 {tier.xpRequired} XP</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
