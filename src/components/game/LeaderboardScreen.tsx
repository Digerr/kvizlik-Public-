'use client';

import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { LEAGUES, getLeagueByScore } from '@/lib/quiz-data';
import { ArrowLeft, Trophy, Medal, TrendingUp, Flame, Zap } from 'lucide-react';

export default function LeaderboardScreen() {
  const { setPhase, totalScore, gamesPlayed, bestStreak, totalCorrect, totalQuestions } = useQuizStore();
  const currentLeague = getLeagueByScore(totalScore);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Generate some fake players for demo
  const leaderboard = [
    { name: 'Алексей', score: 890, league: LEAGUES[4] },
    { name: 'Мария', score: 720, league: LEAGUES[4] },
    { name: 'Дмитрий', score: 560, league: LEAGUES[3] },
    { name: 'Екатерина', score: 430, league: LEAGUES[3] },
    { name: 'Иван', score: 280, league: LEAGUES[2] },
    { name: 'Анна', score: 160, league: LEAGUES[2] },
    { name: 'Вы', score: totalScore, league: currentLeague, isYou: true },
    { name: 'Олег', score: 40, league: LEAGUES[0] },
  ].sort((a, b) => b.score - a.score);

  const playerRank = leaderboard.findIndex(p => p.isYou) + 1;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#0f0a1e] via-[#1a0f2e] to-[#0f0a1e] px-5 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setPhase('home')}
          className="text-white/50 hover:text-white/80 transition-colors text-sm flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Рейтинг
        </h2>
        <div className="w-12" />
      </div>

      {/* Your stats card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 rounded-2xl p-5 mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{currentLeague.emoji}</span>
          <div>
            <p className="text-white font-bold text-lg">{currentLeague.name}</p>
            <p className="text-purple-300/60 text-xs">Ваш ранг: #{playerRank || '—'}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-white font-black text-2xl">{totalScore}</p>
            <p className="text-white/30 text-[10px]">очков</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <Zap className="w-3 h-3 text-purple-400 mx-auto mb-1" />
            <p className="text-white font-bold text-xs">{gamesPlayed}</p>
            <p className="text-white/25 text-[9px]">Игр</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <Medal className="w-3 h-3 text-emerald-400 mx-auto mb-1" />
            <p className="text-white font-bold text-xs">{accuracy}%</p>
            <p className="text-white/25 text-[9px]">Точность</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <Flame className="w-3 h-3 text-orange-400 mx-auto mb-1" />
            <p className="text-white font-bold text-xs">{bestStreak}</p>
            <p className="text-white/25 text-[9px]">Серия</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <TrendingUp className="w-3 h-3 text-blue-400 mx-auto mb-1" />
            <p className="text-white font-bold text-xs">{totalCorrect}</p>
            <p className="text-white/25 text-[9px]">Верных</p>
          </div>
        </div>
      </motion.div>

      {/* Leagues */}
      <div className="mb-6">
        <p className="text-white/30 text-xs font-medium mb-3">Лиги</p>
        <div className="flex gap-2">
          {LEAGUES.map((league) => (
            <div
              key={league.id}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl ${
                league.id === currentLeague.id
                  ? 'bg-white/10 border border-white/20'
                  : 'bg-white/3 border border-white/5'
              }`}
            >
              <span className="text-xl">{league.emoji}</span>
              <span className="text-white/40 text-[9px]">{league.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <p className="text-white/30 text-xs font-medium mb-3">Топ игроков</p>
        <div className="flex flex-col gap-1.5">
          {leaderboard.map((player, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                player.isYou
                  ? 'bg-purple-600/20 border border-purple-500/30'
                  : 'bg-white/3 border border-white/5'
              }`}
            >
              <span className={`font-bold text-sm w-6 text-center ${
                i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-white/30'
              }`}>
                {i + 1}
              </span>
              <span className="text-lg">{player.league.emoji}</span>
              <span className={`font-medium text-sm flex-1 ${
                player.isYou ? 'text-purple-200' : 'text-white/60'
              }`}>
                {player.name}
              </span>
              <span className={`font-bold text-sm ${
                player.isYou ? 'text-purple-300' : 'text-white/40'
              }`}>
                {player.score}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
