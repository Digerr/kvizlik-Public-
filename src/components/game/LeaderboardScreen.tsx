'use client';

import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { LEAGUES, AVATARS } from '@/lib/quiz-data';
import { useTelegram } from '@/hooks/use-telegram';
import { ArrowLeft } from 'lucide-react';

export default function LeaderboardScreen() {
  const { leaderboard, totalScore, playerName, avatarId, setPhase } = useQuizStore();
  const { haptic } = useTelegram();

  const playerAvatar = AVATARS.find(a => a.id === avatarId) || AVATARS[0];
  const playerLeague = LEAGUES.find(l => l.id === useQuizStore.getState().currentLeague) || LEAGUES[0];

  // Create full leaderboard with player inserted
  const playerEntry = {
    name: playerName || 'Ты',
    score: totalScore,
    avatarId: avatarId,
    league: playerLeague.id,
    isPlayer: true,
  };

  const allEntries = [...leaderboard.map(e => ({ ...e, isPlayer: false })), playerEntry]
    .sort((a, b) => b.score - a.score);

  const top3 = allEntries.slice(0, 3);
  const rest = allEntries.slice(3);

  const podiumOrder = [1, 0, 2]; // silver, gold, bronze display order
  const podiumColors = ['bg-yellow-500/20 border-yellow-500/30', 'bg-gray-400/20 border-gray-400/30', 'bg-amber-700/20 border-amber-700/30'];
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
        <h2 className="text-white font-bold text-lg">Рейтинг</h2>
      </div>

      {/* Podium */}
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
                idx === 0 ? 'bg-yellow-500/20 border-yellow-500/50' : idx === 1 ? 'bg-gray-400/20 border-gray-400/50' : 'bg-amber-700/20 border-amber-700/50'
              }`}>
                {avatar.emoji}
              </div>
              <span className="text-xs font-bold text-white truncate max-w-full px-1">
                {entry.isPlayer ? 'Ты' : entry.name}
              </span>
              <span className="text-[10px] text-white/50">{league.emoji}</span>
              <span className="text-sm font-black text-white mt-0.5">{entry.score}</span>
              <span className="text-lg">{podiumEmoji[idx]}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Full List */}
      <div className="flex-1 overflow-y-auto max-h-96">
        {allEntries.map((entry, i) => {
          const avatar = AVATARS.find(a => a.id === entry.avatarId) || AVATARS[0];
          const league = LEAGUES.find(l => l.id === entry.league) || LEAGUES[0];

          return (
            <motion.div
              key={`${entry.name}-${i}`}
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
                <span className="text-white text-sm font-medium truncate block">
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
    </div>
  );
}
