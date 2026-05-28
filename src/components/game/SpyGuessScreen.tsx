'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/game-store';
import { Eye, MapPin } from 'lucide-react';

export default function SpyGuessScreen() {
  const { spyGuessLocations, spyGuess, players } = useGameStore();

  const spy = players.find((p) => p.isSpy);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-black via-[#0a0014] to-black flex flex-col items-center px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">Шпион пойман!</h2>
        <p className="text-white/40 text-sm">
          <span className="text-red-400 font-semibold">{spy?.name}</span> — шпион.
          Угадайте локацию, чтобы заработать очко!
        </p>
      </motion.div>

      <p className="text-white/30 text-xs mb-4">Где вы находитесь?</p>

      {/* Location options */}
      <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
        {spyGuessLocations.map((loc, i) => (
          <motion.button
            key={loc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => spyGuess(loc.id)}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-500/30 transition-all active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
              {loc.emoji}
            </div>
            <span className="text-white font-medium text-left">{loc.name}</span>
            <MapPin className="w-4 h-4 text-white/20 ml-auto" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
