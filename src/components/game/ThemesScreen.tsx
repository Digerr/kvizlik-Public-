'use client';

import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { THEMES, type ThemeDef } from '@/lib/quiz-data';
import { useTelegram } from '@/hooks/use-telegram';
import { ArrowLeft, Lock, Check } from 'lucide-react';

export default function ThemesScreen() {
  const {
    currentTheme,
    unlockedThemes,
    level,
    coins,
    duelsWon,
    dailyStreak,
    setTheme,
    setPhase,
  } = useQuizStore();
  const { haptic } = useTelegram();

  const getUnlockText = (theme: ThemeDef): string => {
    switch (theme.unlockCondition) {
      case 'default': return 'Доступна по умолчанию';
      case 'level': return `Уровень ${theme.unlockValue}`;
      case 'coins': return `${theme.unlockValue} монет`;
      case 'duels': return `${theme.unlockValue} побед в дуэли`;
      case 'streak': return `Серия ${theme.unlockValue} дней`;
    }
  };

  const isUnlocked = (theme: ThemeDef): boolean => {
    return unlockedThemes.includes(theme.id);
  };

  const isConditionMet = (theme: ThemeDef): boolean => {
    switch (theme.unlockCondition) {
      case 'default': return true;
      case 'level': return level >= theme.unlockValue;
      case 'coins': return coins >= theme.unlockValue;
      case 'duels': return duelsWon >= theme.unlockValue;
      case 'streak': return dailyStreak >= theme.unlockValue;
    }
  };

  const handleSelect = (theme: ThemeDef) => {
    if (!isUnlocked(theme)) {
      haptic('error');
      return;
    }
    haptic('light');
    setTheme(theme.id);
  };

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
        <h2 className="text-white font-bold text-lg">Темы оформления</h2>
      </div>

      {/* Current Theme Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-5 mb-5 border border-white/10 text-center"
        style={{
          background: `linear-gradient(135deg, ${THEMES.find(t => t.id === currentTheme)?.colors.accentFrom}20, ${THEMES.find(t => t.id === currentTheme)?.colors.accentTo}20)`,
        }}
      >
        <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Текущая тема</p>
        <span className="text-4xl block mb-2">{THEMES.find(t => t.id === currentTheme)?.emoji}</span>
        <p className="text-white font-bold text-lg">{THEMES.find(t => t.id === currentTheme)?.name}</p>
      </motion.div>

      {/* Theme List */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pb-4">
        {THEMES.map((theme, i) => {
          const unlocked = isUnlocked(theme);
          const conditionMet = isConditionMet(theme);
          const isActive = currentTheme === theme.id;

          return (
            <motion.button
              key={theme.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleSelect(theme)}
              className={`relative rounded-2xl p-4 flex items-center gap-4 transition-all text-left ${
                isActive
                  ? 'border-2 shadow-lg'
                  : unlocked
                  ? 'border border-white/10 hover:bg-[var(--theme-card-hover)]'
                  : 'border border-white/5 opacity-60'
              }`}
              style={{
                backgroundColor: unlocked ? (isActive ? `${theme.colors.accentFrom}15` : 'var(--theme-card)') : 'var(--theme-card)',
                borderColor: isActive ? theme.colors.accentFrom : undefined,
                boxShadow: isActive ? `0 4px 20px ${theme.colors.accentFrom}30` : undefined,
              }}
            >
              {/* Color Preview */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border border-white/10"
                style={{ backgroundColor: theme.colors.card }}
              >
                {unlocked ? theme.emoji : <Lock className="w-5 h-5 text-white/30" />}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`font-bold text-sm ${unlocked ? 'text-white' : 'text-white/40'}`}>
                    {theme.name}
                  </p>
                  {isActive && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: theme.colors.accentFrom }}>
                      Активна
                    </span>
                  )}
                </div>
                <p className="text-white/40 text-[10px] mt-0.5">
                  {unlocked ? getUnlockText(theme) : getUnlockText(theme)}
                </p>

                {/* Color dots */}
                <div className="flex gap-1.5 mt-2">
                  <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.colors.bg }} />
                  <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.colors.card }} />
                  <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.colors.accentFrom }} />
                  <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.colors.accentTo }} />
                </div>
              </div>

              {/* Status */}
              <div className="shrink-0">
                {isActive ? (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: theme.colors.accentFrom }}>
                    <Check className="w-4 h-4 text-white" />
                  </div>
                ) : unlocked ? (
                  <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  </div>
                ) : conditionMet ? (
                  <span className="text-[10px] font-bold text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded-lg">
                    Разблок.
                  </span>
                ) : (
                  <Lock className="w-4 h-4 text-white/20" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
