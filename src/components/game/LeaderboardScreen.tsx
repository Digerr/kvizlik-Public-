'use client';

import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { LEAGUES, AVATARS } from '@/lib/quiz-data';
import { useTelegram } from '@/hooks/use-telegram';
import { ArrowLeft, RefreshCw, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

function getBiweeklySeason(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneDay = 86400000;
  const dayOfYear = Math.floor(diff / oneDay);
  const weekNum = Math.ceil((dayOfYear + start.getDay() + 1) / 7);
  return Math.ceil(weekNum / 2);
}

function getSeasonEndDate(): Date {
  const now = new Date();
  const season = getBiweeklySeason();
  const start = new Date(now.getFullYear(), 0, 1);
  const startWeek = (season - 1) * 2 + 1;
  const daysToStart = (startWeek - 1) * 7 - start.getDay();
  const startDate = new Date(now.getFullYear(), 0, 1 + daysToStart);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 14);
  return endDate;
}

function getTimeUntilSeasonEnd(): string {
  const endDate = getSeasonEndDate();
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  if (diff <= 0) return 'Скоро';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}д ${hours}ч`;
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (hours > 0) return `${hours}ч ${minutes}м`;
  return `${minutes}м`;
}

export default function LeaderboardScreen() {
  const { leaderboard, totalScore, playerName, avatarId, telegramId, seasonScore, seasonStart, fetchLeaderboard, setPhase } = useQuizStore();
  const { haptic } = useTelegram();
  const [isLoading, setIsLoading] = useState(true);

  const playerAvatar = AVATARS.find(a => a.id === avatarId) || AVATARS[0];
  const playerLeague = LEAGUES.find(l => l.id === useQuizStore.getState().currentLeague) || LEAGUES[0];

  const currentSeason = getBiweeklySeason();
  const timeUntilEnd = getTimeUntilSeasonEnd();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    await fetchLeaderboard();
    setIsLoading(false);
  };

  const playerEntry = {
    name: playerName || 'Ты',
    score: totalScore,
    avatarId: avatarId,
    league: playerLeague.id,
    isPlayer: true,
    telegramId: telegramId || undefined,
  };

  // Match player by string ID (works for both TG numeric and VK prefixed IDs)
  const cloudEntries = leaderboard.map(e => ({ ...e, isPlayer: String(e.telegramId) === String(telegramId) }));
  const playerInCloud = cloudEntries.some(e => e.isPlayer);
  const allEntries = playerInCloud
    ? cloudEntries.sort((a, b) => b.score - a.score)
    : [...cloudEntries, playerEntry].sort((a, b) => b.score - a.score);

  const finalEntries = allEntries.map(e => {
    if (e.isPlayer && totalScore > e.score) {
      return { ...e, score: totalScore };
    }
    return e;
  }).sort((a, b) => b.score - a.score);

  const top3 = finalEntries.slice(0, 3);
  const rest = finalEntries.slice(3);

  const podiumOrder = [1, 0, 2];
  const podiumEmoji = ['🥇', '🥈', '🥉'];

  return (
    <div className="min-h-[100dvh] bg-[var(--theme-bg)] px-4 py-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={() => { haptic('light'); setPhase('home'); }}
          className="w-9 h-9 rounded-xl bg-[var(--theme-card)] border border-white/10 flex items-center justify-center hover:bg-[var(--theme-card-hover)] active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-white/70" />
        </button>
        <h2 className="text-white font-bold text-lg flex-1">Рейтинг</h2>
        <button
          onClick={() => { haptic('light'); loadLeaderboard(); }}
          className="w-9 h-9 rounded-xl bg-[var(--theme-card)] border border-white/10 flex items-center justify-center hover:bg-[var(--theme-card-hover)] active:scale-95 transition-all"
        >
          <RefreshCw className={`w-4 h-4 text-white/70 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Season Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-3 mb-4 flex items-center justify-between"
      >
        <div>
          <p className="text-white font-bold text-sm">Сезон {currentSeason}</p>
          <p className="text-white/40 text-[10px]">Очки за сезон: {seasonScore}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-purple-400 text-xs font-medium">{timeUntilEnd}</span>
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
            <p className="text-white/50 text-sm">Загружаю рейтинг...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && finalEntries.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="text-4xl">🏆</span>
            <p className="text-white/50 text-sm">Пока никого нет</p>
            <p className="text-white/30 text-xs">Стань первым в рейтинге!</p>
          </div>
        </div>
      )}

      {/* Podium */}
      {!isLoading && top3.length > 0 && (
        <div className="flex items-end justify-center gap-2 mb-6 px-2">
          {podiumOrder.map((idx, displayIdx) => {
            const entry = top3[idx];
            if (!entry) return <div key={idx} className="flex-1" />;
            const avatar = AVATARS.find(a => a.id === entry.avatarId) || AVATARS[0];
            const league = LEAGUES.find(l => l.id === entry.league) || LEAGUES[0];
            const heights = ['h-28', 'h-24', 'h-20'];

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: displayIdx * 0.1 }}
                className={`flex-1 flex flex-col items-center ${heights[displayIdx]} justify-end`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-1 border-2 ${
                  entry.isPlayer
                    ? 'bg-purple-500/20 border-purple-500/50'
                    : idx === 0 ? 'bg-yellow-500/20 border-yellow-500/50'
                    : idx === 1 ? 'bg-gray-400/20 border-gray-400/50'
                    : 'bg-amber-700/20 border-amber-700/50'
                }`}>
                  {avatar.emoji}
                </div>
                <span className={`text-xs font-bold truncate max-w-full px-1 ${entry.isPlayer ? 'text-purple-300' : 'text-white'}`}>
                  {entry.isPlayer ? 'Ты' : entry.name}
                </span>
                <span className="text-[10px] text-white/50">{league.emoji}</span>
                <span className="text-sm font-black text-white mt-0.5">{entry.score}</span>
                <span className="text-lg">{podiumEmoji[idx]}</span>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full List */}
      {!isLoading && (
        <div className="flex-1 overflow-y-auto max-h-96">
          {finalEntries.map((entry, i) => {
            const avatar = AVATARS.find(a => a.id === entry.avatarId) || AVATARS[0];
            const league = LEAGUES.find(l => l.id === entry.league) || LEAGUES[0];

            return (
              <motion.div
                key={`${entry.name}-${entry.telegramId || i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-3 py-2.5 px-3 rounded-xl mb-1 ${
                  entry.isPlayer
                    ? 'bg-purple-500/15 border border-purple-500/30'
                    : 'bg-transparent'
                }`}
              >
                <span className={`w-7 text-center font-bold text-sm ${i < 3 ? 'text-yellow-400' : 'text-white/40'}`}>
                  {i + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-[var(--theme-card)] flex items-center justify-center text-sm border border-white/10">
                  {avatar.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-sm font-medium truncate block ${entry.isPlayer ? 'text-purple-300' : 'text-white'}`}>
                    {entry.isPlayer ? 'Ты' : entry.name}
                  </span>
                </div>
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: league.color + '20', color: league.color }}>
                  {league.emoji}
                </span>
                <span className="text-white font-bold text-sm min-w-[40px] text-right">{entry.score}</span>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Player rank card at bottom */}
      {!isLoading && playerEntry && (
        <div className="mt-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl p-3 flex items-center gap-3">
          <span className="text-white/40 text-sm font-bold">
            #{finalEntries.findIndex(e => e.isPlayer) + 1}
          </span>
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-sm border border-purple-500/30">
            {playerAvatar.emoji}
          </div>
          <div className="flex-1">
            <span className="text-purple-300 text-sm font-medium">Твое место</span>
          </div>
          <span className="text-white font-bold">{totalScore} очков</span>
        </div>
      )}
    </div>
  );
}
