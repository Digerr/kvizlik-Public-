'use client';

import { motion } from 'framer-motion';
import { useQuizStore, calcLevel, calcXpForLevel } from '@/lib/quiz-store';
import { AVATARS, LEAGUES, getLeagueProgress, CATEGORIES, THEMES } from '@/lib/quiz-data';
import { useTelegram } from '@/hooks/use-telegram';
import { ArrowLeft } from 'lucide-react';

const FRAME_OPTIONS: { id: string; name: string; emoji: string; style: string; locked?: boolean }[] = [
  { id: 'none', name: 'Без рамки', emoji: '⚪', style: '' },
  { id: 'gold', name: 'Золото', emoji: '🥇', style: 'border-2 border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.3)]' },
  { id: 'diamond', name: 'Алмаз', emoji: '💎', style: 'border-2 border-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.3)]' },
  { id: 'fire', name: 'Огонь', emoji: '🔥', style: 'border-2 border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.3)] animate-pulse' },
  { id: 'ice', name: 'Лёд', emoji: '❄️', style: 'border-2 border-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.3)]' },
  { id: 'neon', name: 'Неон', emoji: '💜', style: 'border-2 border-purple-500 shadow-[0_0_16px_rgba(168,85,247,0.5)]' },
  { id: 'crown', name: 'Корона', emoji: '👑', style: 'border-2 border-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.4)]' },
];

function getFrameStyle(frameId: string): string {
  const frame = FRAME_OPTIONS.find(f => f.id === frameId);
  return frame?.style ?? '';
}

export default function ProfileScreen() {
  const {
    playerName,
    avatarId,
    level,
    totalXP,
    totalScore,
    currentLeague,
    gamesPlayed,
    totalCorrect,
    totalQuestions,
    bestStreak,
    coins,
    categoriesPlayed,
    unlockedAchievements,
    duelsWon,
    duelsPlayed,
    survivalRecord,
    currentTheme,
    categoryStats,
    gamesByDay,
    setPhase,
    profileFrame,
    setProfileFrame,
    referralCount,
    telegramId,
  } = useQuizStore();

  const { haptic, user, platform, isInVK } = useTelegram();
  const pShare = usePlatform().share;

  const avatar = AVATARS.find(a => a.id === avatarId) || AVATARS[0];
  const league = LEAGUES.find(l => l.id === currentLeague) || LEAGUES[0];
  const nextLeague = LEAGUES[LEAGUES.indexOf(league) + 1];
  const leagueProgress = getLeagueProgress(totalScore);
  const displayName = playerName || user?.first_name || 'Игрок';

  const xpForCurrentLevel = calcXpForLevel(level);
  const xpForNextLevel = calcXpForLevel(level + 1);
  const xpProgress = xpForNextLevel > xpForCurrentLevel
    ? Math.round(((totalXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100)
    : 100;

  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Average response time (from answers)
  const avgResponseTime = totalQuestions > 0 ? '-' : '-';

  // Games over last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const last7DaysGames = last7Days.map(d => gamesByDay[d] || 0);
  const maxDayGames = Math.max(...last7DaysGames, 1);

  // Current theme
  const activeTheme = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  // Current frame style for avatar
  const frameStyle = getFrameStyle(profileFrame);
  const isCrownFrame = profileFrame === 'crown';

  // Referral link
  const referralLink = isInVK
    ? `https://vk.com/app54615586`
    : `https://t.me/kvizlik_bot/kvizlik?startapp=ref_${telegramId || 'user'}`;
  const shareText = 'Привет! Играй в КВИЗЛИК со мной! 🎯🧠';

  const handleShareReferral = () => {
    haptic('light');
    pShare(referralLink, shareText);
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
        <h2 className="text-white font-bold text-lg">Профиль</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-4 max-h-[calc(100dvh-80px)]">
        {/* Avatar & Name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center mb-5"
        >
          {/* Crown indicator above avatar */}
          {isCrownFrame && (
            <span className="text-xl mb-[-6px] z-10 drop-shadow-lg">👑</span>
          )}
          <div className={`w-20 h-20 rounded-full bg-[var(--theme-card)] flex items-center justify-center text-4xl mb-2 ${frameStyle || 'border-2 border-purple-500/30'}`}>
            {avatar.emoji}
          </div>
          <h3 className="text-white font-bold text-lg">{displayName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-white/50 text-sm">Уровень {level}</span>
            <span className="text-white/20">•</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: league.color + '25', color: league.color }}>
              {league.emoji} {league.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-lg">{activeTheme.emoji}</span>
            <span className="text-white/40 text-xs">Тема: {activeTheme.name}</span>
          </div>
        </motion.div>

        {/* XP Progress */}
        <div className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/50 text-xs">Опыт</span>
            <span className="text-white/50 text-xs">{totalXP} XP</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(xpProgress, 100)}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            />
          </div>
          <p className="text-white/30 text-[10px] mt-1 text-right">До уровня {level + 1}</p>
        </div>

        {/* League Progress */}
        <div className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{league.emoji}</span>
              <span className="text-white font-medium text-sm">{league.name}</span>
            </div>
            {nextLeague && (
              <div className="flex items-center gap-1">
                <span className="text-white/30 text-xs">→</span>
                <span className="text-sm">{nextLeague.emoji}</span>
                <span className="text-white/50 text-xs">{nextLeague.name}</span>
              </div>
            )}
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${leagueProgress}%` }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full"
              style={{ backgroundColor: league.color }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {[
            { label: 'Игр', value: gamesPlayed, emoji: '🎮' },
            { label: 'Правильных', value: totalCorrect, emoji: '✅' },
            { label: 'Луч. серия', value: bestStreak, emoji: '🔥' },
            { label: 'Точность', value: `${accuracy}%`, emoji: '🎯' },
            { label: 'Монеты', value: coins, emoji: '🪙' },
            { label: 'Достижения', value: `${unlockedAchievements.length}`, emoji: '🏆' },
            { label: 'Побед в дуэлях', value: duelsWon, emoji: '⚔️' },
            { label: 'Дуэлей', value: duelsPlayed, emoji: '🤺' },
            { label: 'Рекорд выжив.', value: survivalRecord, emoji: '💀' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-3 text-center"
            >
              <p className="text-lg mb-0.5">{stat.emoji}</p>
              <p className="text-white font-bold text-lg">{stat.value}</p>
              <p className="text-white/40 text-[10px]">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Profile Frame Selection */}
        <div className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-4 mb-4">
          <p className="text-white/50 text-xs mb-3">Рамка профиля</p>
          <div className="grid grid-cols-4 gap-2">
            {FRAME_OPTIONS.map((frame) => {
              const isSelected = profileFrame === frame.id;
              const isLocked = frame.locked;
              return (
                <button
                  key={frame.id}
                  onClick={() => {
                    if (isLocked) return;
                    haptic('light');
                    setProfileFrame(frame.id);
                  }}
                  className={`relative flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/15'
                      : isLocked
                        ? 'border-white/5 bg-white/[0.02] opacity-50'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{isLocked ? '🔒' : frame.emoji}</span>
                  <span className="text-white/60 text-[9px] leading-tight text-center">{frame.name}</span>
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-purple-500 rounded-full flex items-center justify-center text-[8px]">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Accuracy Breakdown */}
        <div className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-4 mb-4">
          <p className="text-white/50 text-xs mb-3">Точность по категориям</p>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map(cat => {
              const stats = categoryStats[cat.id];
              const pct = stats && stats.played > 0 ? Math.round((stats.correct / stats.played) * 100) : 0;
              const played = stats?.played || 0;
              return (
                <div key={cat.id} className="flex items-center gap-2">
                  <span className="text-sm w-6 text-center">{cat.emoji}</span>
                  <span className="text-white/60 text-[10px] w-20 truncate">{cat.name}</span>
                  <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                  </div>
                  <span className="text-white/40 text-[10px] min-w-[32px] text-right">
                    {played > 0 ? `${pct}%` : '-'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Games over last 7 days */}
        <div className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-4 mb-4">
          <p className="text-white/50 text-xs mb-3">Игр за 7 дней</p>
          <div className="flex items-end gap-1 h-16">
            {last7DaysGames.map((count, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max((count / maxDayGames) * 100, 4)}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="w-full rounded-t-sm bg-gradient-to-t from-purple-600 to-blue-500 min-h-[2px]"
                />
                <span className="text-[8px] text-white/30">
                  {new Date(last7Days[i]).getDate()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/50 text-xs">Реферальная программа</p>
            <span className="text-white/40 text-xs">Рефералы: {referralCount ?? 0}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 mb-3 flex items-center gap-2">
            <span className="text-white/30 text-[10px] truncate flex-1 select-all">{referralLink}</span>
          </div>
          <button
            onClick={handleShareReferral}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium text-sm active:scale-[0.97] transition-transform"
          >
            Пригласить друга 🤝
          </button>
        </div>

        {/* Categories Played */}
        <div className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-4">
          <p className="text-white/50 text-xs mb-2">Категории</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => {
              const played = categoriesPlayed.includes(cat.id);
              return (
                <span
                  key={cat.id}
                  className={`text-xl ${played ? '' : 'opacity-20 grayscale'}`}
                  title={cat.name}
                >
                  {cat.emoji}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


