'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/game-store';
import { Eye, Users, Trophy, BookOpen } from 'lucide-react';

export default function HomeScreen() {
  const { setPhase } = useGameStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 py-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0014] to-black" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-900/20 blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-amber-900/10 blur-[100px]" />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="relative"
        >
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-[0_0_60px_rgba(220,38,38,0.4)]">
            <Eye className="w-14 h-14 text-white" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-2 rounded-full border-2 border-red-500/30"
          />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h1 className="text-5xl font-black tracking-wider text-white mb-2">
            ШПИОН
          </h1>
          <p className="text-red-400/80 text-lg font-medium tracking-wide">
            Найди шпиона среди нас
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-4 w-full mt-4"
        >
          <button
            onClick={() => setPhase('setup')}
            className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
          >
            <Users className="w-6 h-6" />
            Новая игра
          </button>

          <button
            onClick={() => setPhase('rules')}
            className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 text-white/80 font-semibold text-lg rounded-2xl border border-white/10 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
          >
            <BookOpen className="w-6 h-6" />
            Как играть
          </button>

          <button
            onClick={() => setPhase('setup')}
            className="w-full py-3 px-6 bg-white/5 hover:bg-white/10 text-amber-400/80 font-medium text-base rounded-2xl border border-amber-500/20 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
          >
            <Trophy className="w-5 h-5" />
            Рейтинг
          </button>
        </motion.div>

        {/* Version */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-white/20 text-xs mt-8"
        >
          v1.0.0 demo
        </motion.p>
      </div>
    </div>
  );
}
