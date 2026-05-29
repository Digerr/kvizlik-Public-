'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { AVATARS, LEAGUES, ACHIEVEMENTS, THEMES } from '@/lib/quiz-data';
import { useTelegram } from '@/hooks/use-telegram';
import { useEffect, useState } from 'react';
import { Volume2, VolumeX, Palette, Crown } from 'lucide-react';
import { isMuted, toggleMute } from '@/lib/sounds';

export default function HomeScreen() {
  const {
    playerName,
    avatarId,
    level,
    coins,
    dailyStreak,
    totalScore,
    currentLeague,
    powerUps,
    dailyTasks,
    newAchievements,
    currentTheme,
    friendList,
    clanId,
    seasonScore,
    setPhase,
    refreshDailyTasks,
  } = useQuizStore();

  const { haptic, user } = useTelegram();
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const [muted, setMuted] = useState(isMuted());

  const activeTheme = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  useEffect(() => {
    refreshDailyTasks();
  }, [refreshDailyTasks]);

  useEffect(() => {
    if (newAchievements.length > 0) {
      const showTimer = setTimeout(() => {
        setShowAchievement(newAchievements[0]);
      }, 0);
      const hideTimer = setTimeout(() => {
        setShowAchievement(null);
        useQuizStore.setState({ newAchievements: newAchievements.slice(1) });
      }, 3000);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [newAchievements]);

  const avatar = AVATARS.find(a => a.id === avatarId) || AVATARS[0];
  const league = LEAGUES.find(l => l.id === currentLeague) || LEAGUES[0];
  const displayName = playerName || user?.first_name || 'Игрок';
  const unclaimedTask = dailyTasks.find(t => t.progress >= t.target && !t.claimed);
  const totalPowerUps = powerUps.freeze + powerUps.fiftyFifty + powerUps.hint;
  const friendCount = friendList?.length || 0;

  return (
    <div className="min-h-[100dvh] bg-[var(--theme-bg)] px-4 py-6 flex flex-col">
      {/* Achievement Popup */}
      <AnimatePresence>
        {showAchievement && (() => {
          const ach = ACHIEVEMENTS.find(a => a.id === showAchievement);
          if (!ach) return null;
          return (
            <motion.div
              initial={{ opacity: 0, y: -60, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -60, scale: 0.8 }}
              className="fixed top-4 left-4 right-4 z-50 bg-gradient-to-r from-yellow-600/90 to-amber-600/90 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 shadow-2xl"
            >
              <span className="text-3xl">{ach.emoji}</span>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">Достижение разблокировано!</p>
                <p className="text-white/80 text-xs">{ach.name}</p>
              </div>
              <span className="text-yellow-200 text-xs font-medium">+{ach.reward} 🪙</span>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Logo + Sound Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1" />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center flex-1"
        >
          <h1 className="text-4xl font-black tracking-tight">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${activeTheme.colors.accentFrom}, ${activeTheme.colors.accentTo})`,
              }}
            >
              КВИЗЛИК
            </span>
            <span className="ml-2">🧠</span>
          </h1>
          <p className="text-white/40 text-xs mt-1">Проверь свои знания!</p>
        </motion.div>
        <div className="flex-1 flex justify-end">
          <button
            onClick={() => {
              const nowMuted = toggleMute();
              setMuted(nowMuted);
              haptic('light');
            }}
            className="w-9 h-9 rounded-xl bg-[var(--theme-card)] border border-white/10 flex items-center justify-center hover:bg-[var(--theme-card-hover)] active:scale-95 transition-all"
            title={muted ? 'Включить звук' : 'Выключить звук'}
          >
            {muted
              ? <VolumeX className="w-4 h-4 text-white/40" />
              : <Volume2 className="w-4 h-4 text-white/70" />
            }
          </button>
        </div>
      </div>

      {/* Player Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-4 mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border border-white/10"
            style={{ backgroundColor: activeTheme.colors.cardHover }}
          >
            {avatar.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold truncate">{displayName}</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: league.color + '30', color: league.color }}>
                {league.emoji} {league.name}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-white/50 text-xs">Ур. {level}</span>
              <span className="text-white/30 text-xs">•</span>
              <span className="text-yellow-400/80 text-xs">🪙 {coins}</span>
              {dailyStreak > 0 && (
                <>
                  <span className="text-white/30 text-xs">•</span>
                  <span className="text-orange-400/80 text-xs">🔥 {dailyStreak}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-white/30 text-[10px]">Бонусы: {totalPowerUps}</span>
          </div>
        </div>
      </motion.div>

      {/* Play Button + Duel Button */}
      <div className="flex gap-3 mb-4">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            haptic('light');
            setPhase('category');
          }}
          className="flex-1 text-white font-bold text-lg py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-transform"
          style={{
            backgroundImage: `linear-gradient(to right, ${activeTheme.colors.accentFrom}, ${activeTheme.colors.accentTo})`,
            boxShadow: `0 4px 20px ${activeTheme.colors.accentFrom}40`,
          }}
        >
          🎮 Играть
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            haptic('medium');
            setPhase('duel');
          }}
          className="relative bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-lg py-4 px-5 rounded-2xl shadow-lg shadow-red-600/20 active:scale-[0.98] transition-transform"
        >
          ⚔️ Дуэль
          <span className="absolute top-1.5 right-2 text-[8px] font-medium text-white/40 bg-white/10 px-1 py-0.5 rounded">Beta</span>
        </motion.button>
      </div>

      {/* Menu Row 1: Tasks + Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-2 mb-2"
      >
        <button
          onClick={() => { haptic('light'); setPhase('daily'); }}
          className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-2.5 flex flex-col items-center gap-1 hover:bg-[var(--theme-card-hover)] active:scale-[0.98] transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center text-base">📋</div>
          <p className="text-white text-xs font-medium">Задания</p>
          <p className="text-white/40 text-[9px]">
            {unclaimedTask ? '🎁 Награда!' : `${dailyTasks.filter(t => t.claimed).length}/${dailyTasks.length}`}
          </p>
        </button>

        <button
          onClick={() => { haptic('light'); setPhase('achievements'); }}
          className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-2.5 flex flex-col items-center gap-1 hover:bg-[var(--theme-card-hover)] active:scale-[0.98] transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-yellow-500/20 flex items-center justify-center text-base">🏆</div>
          <p className="text-white text-xs font-medium">Достижения</p>
          <p className="text-white/40 text-[9px]">Собирай</p>
        </button>

        <button
          onClick={() => { haptic('light'); setPhase('season_pass'); }}
          className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-2.5 flex flex-col items-center gap-1 hover:bg-[var(--theme-card-hover)] active:scale-[0.98] transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-base">🎖️</div>
          <p className="text-white text-xs font-medium">Сезон</p>
          <p className="text-white/40 text-[9px]">{seasonScore || 0} XP</p>
        </button>
      </motion.div>

      {/* Menu Row 2: Shop + Leaderboard + Friends */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="grid grid-cols-3 gap-2 mb-2"
      >
        <button
          onClick={() => { haptic('light'); setPhase('shop'); }}
          className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-2.5 flex flex-col items-center gap-1 hover:bg-[var(--theme-card-hover)] active:scale-[0.98] transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-base">🛒</div>
          <p className="text-white text-xs font-medium">Магазин</p>
          <p className="text-white/40 text-[9px]">Бонусы</p>
        </button>

        <button
          onClick={() => { haptic('light'); setPhase('leaderboard'); }}
          className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-2.5 flex flex-col items-center gap-1 hover:bg-[var(--theme-card-hover)] active:scale-[0.98] transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-base">📊</div>
          <p className="text-white text-xs font-medium">Рейтинг</p>
          <p className="text-white/40 text-[9px]">Топ</p>
        </button>

        <button
          onClick={() => { haptic('light'); setPhase('friends'); }}
          className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-2.5 flex flex-col items-center gap-1 hover:bg-[var(--theme-card-hover)] active:scale-[0.98] transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-base">👥</div>
          <p className="text-white text-xs font-medium">Друзья</p>
          <p className="text-white/40 text-[9px]">{friendCount} друз.</p>
        </button>
      </motion.div>

      {/* Menu Row 3: Themes + Tournament + Clan */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34 }}
        className="grid grid-cols-3 gap-2 mb-2"
      >
        <button
          onClick={() => { haptic('light'); setPhase('themes'); }}
          className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-2.5 flex flex-col items-center gap-1 hover:bg-[var(--theme-card-hover)] active:scale-[0.98] transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-pink-500/20 flex items-center justify-center text-base">
            <Palette className="w-4 h-4 text-pink-400" />
          </div>
          <p className="text-white text-xs font-medium">Темы</p>
          <p className="text-white/40 text-[9px]">{activeTheme.emoji} {activeTheme.name}</p>
        </button>

        <button
          onClick={() => { haptic('light'); setPhase('tournament'); }}
          className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-2.5 flex flex-col items-center gap-1 hover:bg-[var(--theme-card-hover)] active:scale-[0.98] transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-base">
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-white text-xs font-medium">Турнир</p>
          <p className="text-white/40 text-[9px]">Еженед.</p>
        </button>

        <button
          onClick={() => { haptic('light'); setPhase('clan'); }}
          className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-2.5 flex flex-col items-center gap-1 hover:bg-[var(--theme-card-hover)] active:scale-[0.98] transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-base">🏰</div>
          <p className="text-white text-xs font-medium">Клан</p>
          <p className="text-white/40 text-[9px]">{clanId ? clanId : 'Создай'}</p>
        </button>
      </motion.div>

      {/* Menu Row 4: Mini-games + Events + Submit */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36 }}
        className="grid grid-cols-3 gap-2 mb-2"
      >
        <button
          onClick={() => { haptic('light'); setPhase('mini_game'); }}
          className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-2.5 flex flex-col items-center gap-1 hover:bg-[var(--theme-card-hover)] active:scale-[0.98] transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center text-base">🎯</div>
          <p className="text-white text-xs font-medium">Мини-игры</p>
          <p className="text-white/40 text-[9px]">Правда/Ложь</p>
        </button>

        <button
          onClick={() => { haptic('light'); setPhase('event'); }}
          className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-2.5 flex flex-col items-center gap-1 hover:bg-[var(--theme-card-hover)] active:scale-[0.98] transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center text-base">🎪</div>
          <p className="text-white text-xs font-medium">Ивенты</p>
          <p className="text-white/40 text-[9px]">Спец.режим</p>
        </button>

        <button
          onClick={() => { haptic('light'); setPhase('submit_question'); }}
          className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-2.5 flex flex-col items-center gap-1 hover:bg-[var(--theme-card-hover)] active:scale-[0.98] transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-lime-500/20 flex items-center justify-center text-base">✍️</div>
          <p className="text-white text-xs font-medium">Вопросы</p>
          <p className="text-white/40 text-[9px]">Предложи</p>
        </button>
      </motion.div>

      {/* Menu Row 5: FAQ + Profile */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="grid grid-cols-2 gap-2 mb-4"
      >
        <button
          onClick={() => { haptic('light'); setPhase('faq'); }}
          className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-2.5 flex flex-col items-center gap-1 hover:bg-[var(--theme-card-hover)] active:scale-[0.98] transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-base">❓</div>
          <p className="text-white text-xs font-medium">FAQ</p>
          <p className="text-white/40 text-[9px]">Информация</p>
        </button>

        <button
          onClick={() => { haptic('light'); setPhase('profile'); }}
          className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-2.5 flex flex-col items-center gap-1 hover:bg-[var(--theme-card-hover)] active:scale-[0.98] transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-green-500/20 flex items-center justify-center text-base">👤</div>
          <p className="text-white text-xs font-medium">Профиль</p>
          <p className="text-white/40 text-[9px]">Статистика</p>
        </button>
      </motion.div>

      {/* Daily Task Preview */}
      {unclaimedTask && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => { haptic('light'); setPhase('daily'); }}
          className="bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:from-orange-600/30 hover:to-amber-600/30 active:scale-[0.98] transition-all"
        >
          <span className="text-2xl">{unclaimedTask.emoji}</span>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">{unclaimedTask.name}</p>
            <p className="text-orange-300/60 text-xs">Награда: +{unclaimedTask.reward} 🪙</p>
          </div>
          <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
            Забрать!
          </span>
        </motion.div>
      )}

      {/* Footer */}
      <div className="mt-auto pt-6 text-center">
        <p className="text-white/20 text-[10px]">КВИЗЛИК v4.1 • made by @Digerr</p>
      </div>
    </div>
  );
}

