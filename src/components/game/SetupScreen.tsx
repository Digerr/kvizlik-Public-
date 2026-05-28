'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/game-store';
import { Plus, X, ArrowRight, Clock, Users } from 'lucide-react';
import { TIMER_OPTIONS } from '@/lib/game-data';

export default function SetupScreen() {
  const { players, addPlayer, removePlayer, setTimerDuration, timerDuration, startGame, setPhase } = useGameStore();
  const [nameInput, setNameInput] = useState('');

  const handleAddPlayer = () => {
    const trimmed = nameInput.trim();
    if (!trimmed || players.length >= 8) return;
    addPlayer(trimmed);
    setNameInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddPlayer();
  };

  const canStart = players.length >= 4;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-black via-[#0a0014] to-black px-5 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setPhase('home')}
          className="text-white/50 hover:text-white/80 transition-colors text-sm"
        >
          ← Назад
        </button>
        <h2 className="text-white font-bold text-lg">Новая игра</h2>
        <div className="w-12" />
      </div>

      {/* Player count */}
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-red-400" />
        <span className="text-white/60 text-sm">
          Игроков: {players.length}/8
        </span>
        {!canStart && (
          <span className="text-amber-400/80 text-xs ml-2">
            (минимум 4)
          </span>
        )}
      </div>

      {/* Add player input */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Имя игрока"
          maxLength={20}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
        />
        <button
          onClick={handleAddPlayer}
          disabled={!nameInput.trim() || players.length >= 8}
          className="bg-red-600 hover:bg-red-500 disabled:bg-white/5 disabled:text-white/20 text-white p-3 rounded-xl transition-all active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Player list */}
      <div className="flex flex-col gap-2 mb-8">
        <AnimatePresence>
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{player.avatar}</span>
                <span className="text-white font-medium">{player.name}</span>
              </div>
              <button
                onClick={() => removePlayer(player.id)}
                className="text-white/20 hover:text-red-400 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Timer settings */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-red-400" />
          <span className="text-white/60 text-sm">Время обсуждения</span>
        </div>
        <div className="flex gap-2">
          {TIMER_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setTimerDuration(option.value)}
              className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all active:scale-95 ${
                timerDuration === option.value
                  ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Start button */}
      <motion.button
        onClick={startGame}
        disabled={!canStart}
        className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${
          canStart
            ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.3)]'
            : 'bg-white/5 text-white/20 cursor-not-allowed'
        }`}
        whileTap={canStart ? { scale: 0.95 } : {}}
      >
        Начать игру
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
