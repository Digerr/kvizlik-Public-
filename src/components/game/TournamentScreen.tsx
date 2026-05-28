'use client';

import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { AVATARS } from '@/lib/quiz-data';
import { useTelegram } from '@/hooks/use-telegram';
import { ArrowLeft, RefreshCw, Trophy, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

function getWeekKey(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneDay = 86400000;
  const dayOfYear = Math.floor(diff / oneDay);
  const weekNum = Math.ceil((dayOfYear + start.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

function getTimeUntilReset(): string {
  const now = new Date();
  // Reset on Monday 00:00 MSK (UTC+3)
  const mskOffset = 3 * 60 * 60 * 1000;
  const mskNow = new Date(now.getTime() + mskOffset);
  const dayOfWeek = mskNow.getUTCDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  const nextMonday = new Date(mskNow);
  nextMonday.setUTCDate(mskNow.getUTCDate() + daysUntilMonday);
  nextMonday.setUTCHours(0, 0, 0, 0);

  const diff = nextMonday.getTime() - mskNow.getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  if (days > 0) return `${days}д ${hours}ч`;
  if (hours > 0) return `${hours}ч ${minutes}м`;
  return `${minutes}м`;
}

export default function TournamentScreen() {
  const { tournamentData, playerName, totalScore, telegramId, fetchTournament, setPhase } = useQuizStore();
  const { haptic } = useTelegram();
  const [isLoading, setIsLoading] = useState(true);
  const weekKey = getWeekKey();

  useEffect(() => {
    loadTournament();
  }, []);

  const loadTournament = async () => {
    setIsLoading(true);
    await fetchTournament();
    setIsLoading(false);
  };

  const playerRank = tournamentData.find(e => e.isPlayer)?.rank || '—';
  const timeUntilReset = getTimeUntilReset();

  // Prize info
  const prizes = [
    { place: 1, emoji: '🥇', reward: 'Уникальный аватар + 200 монет' },
    { place: 2, emoji: '🥈', reward: 'Уникальный аватар + 100 монет' },
    { place: 3, emoji: '🥉', reward: 'Уникальный аватар + 50 монет' },
  ];

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
        <h2 className="text-white font-bold text-lg flex-1">🏆 Еженедельный турнир</h2>
        <button
          onClick={() => { haptic('light'); loadTournament(); }}
          className="w-9 h-9 rounded-xl bg-[var(--theme-card)] border border-white/10 flex items-center justify-center hover:bg-[var(--theme-card-hover)] active:scale-95 transition-all"
        >
          <RefreshCw className={`w-4 h-4 text-white/70 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Week Info Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 rounded-2xl p-4 mb-4"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-white/50 text-[10px] uppercase tracking-wider">Неделя</p>
            <p className="text-white font-bold text-lg">{weekKey}</p>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-[10px] uppercase tracking-wider">Сброс через</p>
            <div className="flex items-center gap-1.5 justify-end">
              <Clock className="w-3.5 h-3.5 text-yellow-400" />
              <p className="text-yellow-400 font-bold text-lg">{timeUntilReset}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Player Rank */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 mb-4 flex items-center gap-3"
      >
        <Trophy className="w-6 h-6 text-purple-400" />
        <div className="flex-1">
          <p className="text-white/50 text-[10px]">Твоё место</p>
          <p className="text-purple-300 font-bold">#{playerRank}</p>
        </div>
        <div className="text-right">
          <p className="text-white/50 text-[10px]">Очки за неделю</p>
          <p className="text-white font-bold">{totalScore}</p>
        </div>
      </motion.div>

      {/* Prizes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-4 mb-4"
      >
        <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Призы</p>
        <div className="flex flex-col gap-2">
          {prizes.map((prize, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xl">{prize.emoji}</span>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{prize.place} место</p>
                <p className="text-white/40 text-[10px]">{prize.reward}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex-1"
      >
        <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Топ игроков</p>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
          </div>
        ) : tournamentData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/30 text-sm">Пока никого нет в этой неделе</p>
            <p className="text-white/20 text-xs mt-1">Стань первым!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 max-h-80 overflow-y-auto">
            {tournamentData.map((entry, i) => {
              const avatar = AVATARS.find(a => a.id === entry.avatarId) || AVATARS[0];
              return (
                <motion.div
                  key={`${entry.name}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-xl ${
                    entry.isPlayer
                      ? 'bg-purple-500/15 border border-purple-500/30'
                      : 'bg-transparent'
                  }`}
                >
                  <span className={`w-7 text-center font-bold text-sm ${i < 3 ? 'text-yellow-400' : 'text-white/40'}`}>
                    {entry.rank}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[var(--theme-card)] flex items-center justify-center text-sm border border-white/10">
                    {avatar.emoji}
                  </div>
                  <span className={`text-sm font-medium flex-1 ${entry.isPlayer ? 'text-purple-300' : 'text-white'}`}>
                    {entry.isPlayer ? 'Ты' : entry.name}
                  </span>
                  <span className="text-white font-bold text-sm">{entry.score}</span>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
