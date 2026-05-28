'use client';

import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { CHEST_TYPES, AVATARS } from '@/lib/quiz-data';
import { useTelegram } from '@/hooks/use-telegram';
import { useState, useEffect } from 'react';
import { playCoin } from '@/lib/sounds';

export default function ChestScreen() {
  const { pendingChest, openChest, coins } = useQuizStore();
  const { haptic } = useTelegram();
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [showRewards, setShowRewards] = useState(false);

  useEffect(() => {
    // Auto-open after a short delay
    const timer = setTimeout(() => {
      setIsOpening(true);
      haptic('medium');
    }, 500);

    const openTimer = setTimeout(() => {
      setIsOpened(true);
      haptic('success');
      playCoin();
    }, 1800);

    const rewardsTimer = setTimeout(() => {
      setShowRewards(true);
    }, 2200);

    return () => {
      clearTimeout(timer);
      clearTimeout(openTimer);
      clearTimeout(rewardsTimer);
    };
  }, []);

  if (!pendingChest) return null;

  const chestType = CHEST_TYPES.find(c => c.id === pendingChest.type) || CHEST_TYPES[0];
  const rewardAvatar = pendingChest.rewards.avatarId
    ? AVATARS.find(a => a.id === pendingChest.rewards.avatarId)
    : null;

  const handleContinue = () => {
    haptic('light');
    openChest();
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--theme-bg)] px-4 py-6 flex flex-col items-center justify-center">
      {/* Chest Animation */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Chest Emoji */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{
            scale: isOpened ? [1, 1.3, 1] : isOpening ? [1, 1.1, 1, 1.1, 1] : 1,
            rotate: isOpening ? [0, -5, 5, -5, 0] : isOpened ? 0 : 0,
            y: isOpened ? [0, -20, 0] : 0,
          }}
          transition={{
            duration: isOpening ? 1.2 : 0.5,
            repeat: isOpening && !isOpened ? Infinity : 0,
          }}
          className="text-8xl mb-6"
        >
          {chestType.emoji}
        </motion.div>

        {/* Chest Name */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white text-2xl font-black mb-2"
        >
          {chestType.name}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/50 text-sm"
        >
          {isOpening && !isOpened ? 'Открываем...' : isOpened ? 'Открыто!' : chestType.description}
        </motion.p>

        {/* Sparkles when opened */}
        {isOpened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 mt-4"
          >
            {['✨', '⭐', '💫', '⭐', '✨'].map((s, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: -30 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="text-xl"
              >
                {s}
              </motion.span>
            ))}
          </motion.div>
        )}
      </div>

      {/* Rewards */}
      {showRewards && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <div className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-5 mb-6">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-3 text-center">Награды</p>
            <div className="flex flex-col gap-3">
              {/* Coins */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 bg-yellow-500/10 rounded-xl p-3"
              >
                <span className="text-2xl">🪙</span>
                <div className="flex-1">
                  <p className="text-yellow-400 font-bold text-lg">+{pendingChest.rewards.coins}</p>
                  <p className="text-white/40 text-[10px]">Монеты</p>
                </div>
              </motion.div>

              {/* Avatar if won */}
              {rewardAvatar && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 bg-purple-500/10 rounded-xl p-3"
                >
                  <span className="text-2xl">{rewardAvatar.emoji}</span>
                  <div className="flex-1">
                    <p className="text-purple-400 font-bold">{rewardAvatar.name}</p>
                    <p className="text-white/40 text-[10px]">Новый аватар!</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-purple-600/20 active:scale-[0.98] transition-transform"
          >
            Продолжить →
          </motion.button>
        </motion.div>
      )}

      {/* Tap to continue hint */}
      {isOpened && !showRewards && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/30 text-xs"
        >
          Нажмите чтобы продолжить
        </motion.p>
      )}
    </div>
  );
}
