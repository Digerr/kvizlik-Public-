'use client';

import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { DAILY_CHAIN } from '@/lib/quiz-data';
import { useTelegram } from '@/hooks/use-telegram';
import { ArrowLeft, Check, Gift } from 'lucide-react';

export default function DailyScreen() {
  const { dailyTasks, dailyStreak, claimDailyReward, dailyChainDay, dailyChainCompleted, claimDailyChain, setPhase } = useQuizStore();
  const { haptic } = useTelegram();

  const handleClaim = (taskId: string) => {
    haptic('success');
    claimDailyReward(taskId);
  };

  const handleClaimChain = (day: number) => {
    haptic('success');
    claimDailyChain(day);
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--theme-bg)] px-4 py-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => { haptic('light'); setPhase('home'); }}
          className="w-9 h-9 rounded-xl bg-[var(--theme-card)] border border-white/10 flex items-center justify-center hover:bg-[var(--theme-card-hover)] active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-white/70" />
        </button>
        <h2 className="text-white font-bold text-lg">Ежедневные задания</h2>
      </div>

      {/* Streak Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 rounded-2xl p-4 mb-5 text-center"
      >
        <span className="text-3xl block mb-1">🔥</span>
        <p className="text-white font-bold text-2xl">{dailyStreak}</p>
        <p className="text-white/50 text-xs">дней подряд</p>
      </motion.div>

      {/* 7-Day Chain */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-4 mb-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Gift className="w-4 h-4 text-yellow-400" />
          <p className="text-white font-bold text-sm">Цепочка заданий (7 дней)</p>
        </div>

        <div className="grid grid-cols-7 gap-1.5 mb-3">
          {DAILY_CHAIN.map((day, i) => {
            const isCompleted = dailyChainCompleted[i];
            const isCurrent = i === dailyChainDay;
            const isLocked = i > dailyChainDay;

            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : isCurrent
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse'
                      : 'bg-white/5 text-white/20 border border-white/5'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className="text-[8px] text-white/30">{day.reward > 0 ? `${day.reward}🪙` : '🥈'}</span>
              </div>
            );
          })}
        </div>

        {/* Current chain task */}
        {dailyChainDay < 7 && (
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-xs font-medium">День {dailyChainDay + 1}</p>
                <p className="text-white/40 text-[10px]">{DAILY_CHAIN[dailyChainDay]?.task}</p>
              </div>
              {dailyChainDay < DAILY_CHAIN.length && (
                <button
                  onClick={() => handleClaimChain(dailyChainDay)}
                  disabled={dailyChainCompleted[dailyChainDay]}
                  className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg ${
                    dailyChainCompleted[dailyChainDay]
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
                  }`}
                >
                  {dailyChainCompleted[dailyChainDay] ? '✓' : `+${DAILY_CHAIN[dailyChainDay]?.reward || '🥈'} 🪙`}
                </button>
              )}
            </div>
          </div>
        )}

        {dailyChainDay >= 7 && (
          <div className="text-center py-2">
            <p className="text-green-400 text-xs font-medium">🎉 Цепочка завершена!</p>
          </div>
        )}
      </motion.div>

      {/* Task List */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pb-4">
        {dailyTasks.map((task, i) => {
          const isComplete = task.progress >= task.target;
          const isClaimed = task.claimed;
          const progressPercent = Math.min(100, Math.round((task.progress / task.target) * 100));

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-[var(--theme-card)] border rounded-2xl p-4 ${
                isClaimed ? 'border-green-500/30 opacity-60' : isComplete ? 'border-orange-500/30' : 'border-white/10'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{task.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm">{task.name}</p>
                  <p className="text-white/40 text-[10px]">{task.description}</p>
                </div>
                <span className="text-yellow-400/70 text-xs font-medium">+{task.reward} 🪙</span>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full rounded-full ${
                      isClaimed ? 'bg-green-500' : isComplete ? 'bg-orange-500' : 'bg-purple-500'
                    }`}
                  />
                </div>
                <span className="text-white/40 text-[10px] min-w-[30px] text-right">
                  {task.progress}/{task.target}
                </span>
              </div>

              {/* Action Button */}
              {isClaimed ? (
                <div className="flex items-center justify-center gap-1 mt-2 text-green-400 text-xs font-medium">
                  <Check className="w-3 h-3" /> Получено!
                </div>
              ) : isComplete ? (
                <button
                  onClick={() => handleClaim(task.id)}
                  className="w-full mt-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold py-2 rounded-xl active:scale-[0.98] transition-transform"
                >
                  Забрать награду! 🎉
                </button>
              ) : null}
            </motion.div>
          );
        })}

        {dailyTasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-white/30 text-sm">Задания появятся скоро...</p>
          </div>
        )}
      </div>
    </div>
  );
}
