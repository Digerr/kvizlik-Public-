'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/game-store';
import { Eye, MapPin, RotateCcw, Home, Trophy, Users } from 'lucide-react';

export default function ResultsScreen() {
  const { players, location, spyGuessedCorrectly, newRound, resetGame, setPhase, round } = useGameStore();

  const spy = players.find((p) => p.isSpy);
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-black via-[#0a0014] to-black flex flex-col items-center px-6 py-8 overflow-y-auto">
      {/* Result icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="mb-6"
      >
        {spyGuessedCorrectly ? (
          <div className="w-24 h-24 rounded-full bg-red-600/20 flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.3)]">
            <Eye className="w-12 h-12 text-red-400" />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-emerald-600/20 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <MapPin className="w-12 h-12 text-emerald-400" />
          </div>
        )}
      </motion.div>

      {/* Result text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-6"
      >
        <h2 className="text-white text-2xl font-black mb-2">
          {spyGuessedCorrectly ? 'Шпион угадал!' : 'Шпион разгадан!'}
        </h2>
        <p className="text-white/40 text-sm">
          {spyGuessedCorrectly
            ? 'Шпион определил локацию и получает очко'
            : 'Игроки успешно нашли шпиона'}
        </p>
      </motion.div>

      {/* Spy reveal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm bg-gradient-to-br from-red-900/20 to-transparent border border-red-500/20 rounded-2xl p-5 mb-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-600/20 flex items-center justify-center text-3xl">
            {spy?.avatar}
          </div>
          <div>
            <p className="text-red-400 text-xs font-medium tracking-wider uppercase mb-1">Шпион</p>
            <p className="text-white font-bold text-lg">{spy?.name}</p>
          </div>
        </div>
      </motion.div>

      {/* Location reveal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-5 mb-6"
      >
        <p className="text-white/40 text-xs font-medium tracking-wider uppercase mb-2">Локация</p>
        <p className="text-white text-xl font-bold">
          {location?.emoji} {location?.name}
        </p>
      </motion.div>

      {/* Scoreboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-sm mb-8"
      >
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-white/40 text-xs font-medium tracking-wider uppercase">
            Рейтинг — Раунд {round}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {sortedPlayers.map((player, i) => (
            <div
              key={player.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                i === 0
                  ? 'bg-amber-500/10 border border-amber-500/20'
                  : 'bg-white/5 border border-white/5'
              }`}
            >
              <span className="text-white/30 text-sm font-bold w-6">
                {i + 1}
              </span>
              <span className="text-xl">{player.avatar}</span>
              <span className="text-white/70 font-medium flex-1">{player.name}</span>
              <span className={`font-bold ${
                i === 0 ? 'text-amber-400' : 'text-white/50'
              }`}>
                {player.score}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col gap-3 w-full max-w-sm"
      >
        <button
          onClick={newRound}
          className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Следующий раунд
        </button>
        <button
          onClick={resetGame}
          className="w-full py-3 px-6 bg-white/5 hover:bg-white/10 text-white/50 font-medium text-sm rounded-2xl border border-white/10 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          В главное меню
        </button>
      </motion.div>
    </div>
  );
}
