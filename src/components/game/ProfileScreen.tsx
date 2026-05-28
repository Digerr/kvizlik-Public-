'use client';

import { motion } from 'framer-motion';
import { useQuizStore, calcLevel, calcXpForLevel } from '@/lib/quiz-store';
import { AVATARS, LEAGUES, getLeagueProgress, CATEGORIES, THEMES } from '@/lib/quiz-data';
import { useTelegram } from '@/hooks/use-telegram';
import { ArrowLeft } from 'lucide-react';

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
  } = useQuizStore();

  const { haptic, user } = useTelegram();

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
          <div className="w-20 h-20 rounded-full bg-[var(--theme-card)] flex items-center justify-center text-4xl border-2 border-purple-500/30 mb-2">
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
