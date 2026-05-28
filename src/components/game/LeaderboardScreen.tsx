'use client';

import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { LEAGUES, AVATARS } from '@/lib/quiz-data';
import { useTelegram } from '@/hooks/use-telegram';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LeaderboardScreen() {
  const { leaderboard, totalScore, playerName, avatarId, telegramId, fetchLeaderboard, setPhase } = useQuizStore();
  const { haptic } = useTelegram();
  const [isLoading, setIsLoading] = useState(true);

  const playerAvatar = AVATARS.find(a => a.id === avatarId) || AVATARS[0];
  const playerLeague = LEAGUES.find(l => l.id === useQuizStore.getState().currentLeague) || LEAGUES[0];

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    await fetchLeaderboard();
    setIsLoading(false);
  };

  // Create full leaderboard with player inserted
  const playerEntry = {
    name: playerName || 'Ты',
    score: totalScore,
    avatarId: avatarId,
    league: playerLeague.id,
    isPlayer: true,
    telegramId: telegramId ? Number(telegramId) : undefined,
  };

  // Merge: add player to cloud leaderboard if not already there, or update their entry
  const cloudEntries = leaderboard.map(e => ({ ...e, isPlayer: e.telegramId === (telegramId ? Number(telegramId) : -1) }));

  // If player is not in cloud leaderboard, add them
  const playerInCloud = cloudEntries.some(e => e.isPlayer);
  const allEntries = playerInCloud
    ? cloudEntries.sort((a, b) => b.score - a.score)
    : [...cloudEntries, playerEntry].sort((a, b) => b.score - a.score);

  // If player is in cloud but their local score is higher, show local score
  const finalEntries = allEntries.map(e => {
    if (e.isPlayer && totalScore > e.score) {
      return { ...e, score: totalScore };
    }
    return e;
  }).sort((a, b) => b.score - a.score);

  const top3 = finalEntries.slice(0, 3);
  const rest = finalEntries.slice(3);

  const podiumOrder = [1, 0, 2]; // silver, gold, bronze
  const podiumEmoji = ['🥇', '🥈', '🥉'];

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
        <h2 className="text-white font-bold text-lg flex-1">Рейтинг</h2>
        <button
          onClick={() => { haptic('light'); loadLeaderboard(); }}
          className="w-9 h-9 rounded-xl bg-[#1a1235] border border-white/10 flex items-center justify-center hover:bg-[#221a45] active:scale-95 transition-all"
        >
          <RefreshCw className={`w-4 h-4 text-white/70 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

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
                <div className="w-8 h-8 rounded-full bg-[#1a1235] flex items-center justify-center text-sm border border-white/10">
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
