'use client';

import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { ACHIEVEMENTS } from '@/lib/quiz-data';
import { useTelegram } from '@/hooks/use-telegram';
import { ArrowLeft, Lock, Check } from 'lucide-react';

export default function AchievementsScreen() {
  const { unlockedAchievements, setPhase } = useQuizStore();
  const { haptic } = useTelegram();

  const unlockedIds = new Set(unlockedAchievements.map(a => a.id));

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
        <h2 className="text-white font-bold text-lg">Достижения</h2>
        <span className="text-white/40 text-sm ml-auto">{unlockedAchievements.length}/{ACHIEVEMENTS.length}</span>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pb-4" style={{ maxHeight: 'calc(100dvh - 80px)' }}>
        {ACHIEVEMENTS.map((ach, i) => {
          const isUnlocked = unlockedIds.has(ach.id);
          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`rounded-2xl p-3.5 flex flex-col items-center text-center relative ${
                isUnlocked
                  ? 'bg-[#1a1235] border border-white/10'
                  : 'bg-[#1a1235]/50 border border-white/5'
              }`}
            >
              {/* Unlocked Badge */}
              {isUnlocked && (
                <div className="absolute top-2 right-2">
                  <span className="bg-green-500/20 text-green-400 text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5" /> Получено!
                  </span>
                </div>
              )}

              {/* Lock Icon for locked */}
              {!isUnlocked && (
                <div className="absolute top-2 right-2">
                  <Lock className="w-3 h-3 text-white/20" />
                </div>
              )}

              <span className={`text-2xl mb-1.5 ${!isUnlocked ? 'grayscale opacity-40' : ''}`}>
                {ach.emoji}
              </span>
              <p className={`text-xs font-bold mb-0.5 leading-tight ${!isUnlocked ? 'text-white/30' : 'text-white/90'}`}>
                {ach.name}
              </p>
              <p className={`text-[10px] leading-tight mb-1.5 ${!isUnlocked ? 'text-white/20' : 'text-white/50'}`}>
                {ach.description}
              </p>
              <span className={`text-[10px] font-medium ${isUnlocked ? 'text-yellow-400/70' : 'text-white/20'}`}>
                +{ach.reward} 🪙
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
