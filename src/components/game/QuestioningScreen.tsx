'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/game-store';
import { MessageCircle, Timer } from 'lucide-react';

export default function QuestioningScreen() {
  const { players, timerRemaining, decrementTimer, setPhase } = useGameStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      decrementTimer();
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [decrementTimer]);

  useEffect(() => {
    if (timerRemaining <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPhase('voting');
    }
  }, [timerRemaining, setPhase]);

  const minutes = Math.floor(timerRemaining / 60);
  const seconds = timerRemaining % 60;
  const totalTime = useGameStore.getState().timerDuration;
  const progress = timerRemaining / totalTime;
  const isLow = timerRemaining <= 60;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-black via-[#0a0014] to-black flex flex-col items-center px-6 py-8 relative overflow-hidden">
      {/* Background pulse when low time */}
      {isLow && (
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 bg-red-900/10"
        />
      )}

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center gap-2 text-white/40 text-sm">
          <MessageCircle className="w-4 h-4" />
          <span>Обсуждение</span>
        </div>

        {/* Timer circle */}
        <motion.div
          className="relative w-48 h-48 flex items-center justify-center"
          animate={isLow ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.5, repeat: isLow ? Infinity : 0 }}
        >
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="4"
            />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke={isLow ? '#dc2626' : '#dc2626'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${progress * 283} 283`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="text-center">
            <p className={`text-5xl font-black tabular-nums ${isLow ? 'text-red-400' : 'text-white'}`}>
              {minutes}:{seconds.toString().padStart(2, '0')}
            </p>
            <p className="text-white/30 text-xs mt-1">осталось</p>
          </div>
        </motion.div>

        <p className="text-white/50 text-center text-sm max-w-xs">
          Задавайте друг другу вопросы. Постарайтесь вычислить шпиона, но не выдайте локацию!
        </p>

        {/* Player avatars in a grid */}
        <div className="grid grid-cols-4 gap-3 mt-4 w-full">
          {players.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                {player.avatar}
              </div>
              <span className="text-white/40 text-xs truncate max-w-[60px] text-center">
                {player.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Skip to voting */}
        <button
          onClick={() => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setPhase('voting');
          }}
          className="mt-auto mb-4 py-3 px-8 bg-white/5 hover:bg-white/10 text-white/50 text-sm font-medium rounded-xl border border-white/5 transition-all active:scale-95"
        >
          Перейти к голосованию
        </button>
      </div>
    </div>
  );
}
