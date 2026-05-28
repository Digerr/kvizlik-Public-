'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/game-store';
import { Eye, MapPin, ChevronRight, Shield } from 'lucide-react';

export default function RoleRevealScreen() {
  const { players, currentRevealIndex, location, showRole, revealRole, nextReveal } = useGameStore();
  const currentPlayer = players[currentRevealIndex];
  const isSpy = currentPlayer?.isSpy ?? false;

  if (!currentPlayer) return null;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-black via-[#0a0014] to-black flex flex-col items-center justify-center px-6 py-8 relative overflow-hidden">
      {/* Background glow based on role */}
      {showRole && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[120px] ${
            isSpy ? 'bg-red-900/30' : 'bg-emerald-900/20'
          }`}
        />
      )}

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-sm">
        {/* Player info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-5xl mb-3 block">{currentPlayer.avatar}</span>
          <p className="text-white/60 text-sm mb-1">Ход игрока</p>
          <h2 className="text-white text-2xl font-bold">{currentPlayer.name}</h2>
        </motion.div>

        {/* Progress dots */}
        <div className="flex gap-2 mb-4">
          {players.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i < currentRevealIndex
                  ? 'bg-white/40'
                  : i === currentRevealIndex
                  ? 'bg-red-500 w-6'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Role card */}
        <motion.div
          className="w-full"
          initial={false}
          animate={{ rotateY: showRole ? 0 : 0 }}
        >
          {!showRole ? (
            // Hidden card
            <motion.button
              onClick={revealRole}
              className="w-full py-16 px-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex flex-col items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                <Shield className="w-10 h-10 text-white/30" />
              </div>
              <p className="text-white/40 text-lg font-medium">
                Нажмите, чтобы узнать роль
              </p>
              <p className="text-white/20 text-sm">
                Убедитесь, что другие не видят
              </p>
            </motion.button>
          ) : (
            // Revealed card
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className={`w-full py-12 px-6 rounded-3xl border flex flex-col items-center gap-4 ${
                isSpy
                  ? 'bg-gradient-to-br from-red-900/40 to-red-950/60 border-red-500/30 shadow-[0_0_40px_rgba(220,38,38,0.2)]'
                  : 'bg-gradient-to-br from-emerald-900/30 to-emerald-950/50 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.15)]'
              }`}
            >
              {isSpy ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-20 h-20 rounded-full bg-red-600/30 flex items-center justify-center"
                  >
                    <Eye className="w-10 h-10 text-red-400" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-red-400 text-2xl font-black tracking-wide"
                  >
                    ВЫ ШПИОН
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/50 text-sm text-center"
                  >
                    Вы не знаете локацию. Наблюдайте за другими и пытайтесь угадать, где вы находитесь!
                  </motion.p>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-20 h-20 rounded-full bg-emerald-600/20 flex items-center justify-center"
                  >
                    <MapPin className="w-10 h-10 text-emerald-400" />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-emerald-400/60 text-xs font-medium tracking-widest uppercase"
                  >
                    Локация
                  </motion.p>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white text-3xl font-black"
                  >
                    {location?.emoji} {location?.name}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/40 text-sm text-center"
                  >
                    Найдите шпиона! Задавайте вопросы, но не выдайте локацию.
                  </motion.p>
                </>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Next button */}
        {showRole && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={nextReveal}
            className="w-full py-4 px-6 bg-white/10 hover:bg-white/15 text-white font-semibold text-base rounded-2xl border border-white/10 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
          >
            {currentRevealIndex < players.length - 1 ? (
              <>
                Следующий игрок
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              <>
                Начать обсуждение
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
}
