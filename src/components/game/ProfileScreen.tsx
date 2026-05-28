'use client';

import { motion } from 'framer-motion';
import { useQuizStore, calcLevel, calcXpForLevel } from '@/lib/quiz-store';
import { AVATARS, LEAGUES, getLeagueProgress, CATEGORIES } from '@/lib/quiz-data';
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
        <h2 className="text-white font-bold text-lg">Профиль</h2>
      </div>

      {/* Avatar & Name */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center mb-5"
      >
        <div className="w-20 h-20 rounded-full bg-[#1a1235] flex items-center justify-center text-4xl border-2 border-purple-500/30 mb-2">
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
      </motion.div>

      {/* XP Progress */}
      <div className="bg-[#1a1235] border border-white/10 rounded-2xl p-4 mb-4">
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
      <div className="bg-[#1a1235] border border-white/10 rounded-2xl p-4 mb-4">
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
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#1a1235] border border-white/10 rounded-2xl p-3 text-center"
          >
            <p className="text-lg mb-0.5">{stat.emoji}</p>
            <p className="text-white font-bold text-lg">{stat.value}</p>
            <p className="text-white/40 text-[10px]">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Categories Played */}
      <div className="bg-[#1a1235] border border-white/10 rounded-2xl p-4">
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
  );
}
