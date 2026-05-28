'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/game-store';
import { Vote, Check, ChevronRight } from 'lucide-react';

export default function VotingScreen() {
  const { players, currentVoterIndex, votes, castVote, nextVoter } = useGameStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const currentVoter = players[currentVoterIndex];
  const currentVoterVote = votes[currentVoter?.id ?? ''];

  const handleVote = (playerId: string) => {
    setSelectedId(playerId);
    castVote(playerId);
  };

  const handleConfirm = () => {
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      setSelectedId(null);
      nextVoter();
    }, 800);
  };

  if (!currentVoter) return null;

  // Show transition between voters
  if (showConfirmation) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-b from-black via-[#0a0014] to-black flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Check className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <p className="text-white/60 text-lg">Голос записан</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-black via-[#0a0014] to-black flex flex-col items-center px-5 py-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Vote className="w-5 h-5 text-red-400" />
        <span className="text-white/40 text-sm">Голосование</span>
      </div>

      {/* Current voter */}
      <motion.div
        key={currentVoterIndex}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <p className="text-white/40 text-xs mb-1">Голосует</p>
        <div className="flex items-center gap-3 justify-center">
          <span className="text-3xl">{currentVoter.avatar}</span>
          <h3 className="text-white text-xl font-bold">{currentVoter.name}</h3>
        </div>
      </motion.div>

      {/* Progress */}
      <div className="flex gap-2 mb-6">
        {players.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i < currentVoterIndex
                ? 'bg-red-500/60'
                : i === currentVoterIndex
                ? 'bg-red-500 w-6'
                : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      <p className="text-white/40 text-sm mb-4">Кто шпион?</p>

      {/* Player grid to vote for */}
      <div className="flex flex-col gap-2 w-full max-w-sm flex-1 overflow-y-auto">
        <AnimatePresence>
          {players.map((player, i) => (
            <motion.button
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleVote(player.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all active:scale-[0.98] ${
                currentVoterVote === player.id
                  ? 'bg-red-600/20 border-red-500/40'
                  : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              <span className="text-2xl">{player.avatar}</span>
              <span className={`font-medium ${
                currentVoterVote === player.id ? 'text-red-300' : 'text-white/70'
              }`}>
                {player.name}
              </span>
              {currentVoterVote === player.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto"
                >
                  <Check className="w-5 h-5 text-red-400" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirm vote */}
      <motion.button
        onClick={handleConfirm}
        disabled={!currentVoterVote}
        className={`w-full max-w-sm mt-4 mb-2 py-4 px-6 rounded-2xl font-bold text-base transition-all active:scale-95 flex items-center justify-center gap-2 ${
          currentVoterVote
            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]'
            : 'bg-white/5 text-white/20 cursor-not-allowed'
        }`}
      >
        Подтвердить
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
