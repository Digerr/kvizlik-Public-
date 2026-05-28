'use client';

import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { useTelegram } from '@/hooks/use-telegram';
import { ArrowLeft, Check } from 'lucide-react';

export default function DailyScreen() {
  const { dailyTasks, dailyStreak, claimDailyReward, setPhase } = useQuizStore();
  const { haptic } = useTelegram();

  const handleClaim = (taskId: string) => {
    haptic('success');
    claimDailyReward(taskId);
  };

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

      {/* Task List */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pb-4" style={{ maxHeight: 'calc(100dvh - 220px)' }}>
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
              className={`bg-[#1a1235] border rounded-2xl p-4 ${
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
