'use client';

import { motion } from 'framer-motion';
import { useQuizStore, calcLevel, calcXpForLevel } from '@/lib/quiz-store';
import { LEAGUES, getLeagueByScore, getLeagueProgress, ACHIEVEMENTS } from '@/lib/quiz-data';
import { useTelegram } from '@/hooks/use-telegram';
import { Trophy, Home, RotateCcw, Share2 } from 'lucide-react';

export default function ResultScreen() {
  const {
    answers,
    questions,
    totalScore,
    currentLeague,
    bestStreak,
    totalXP,
    level,
    newAchievements,
    playAgain,
    setPhase,
  } = useQuizStore();

  const { haptic, tg, isInTelegram } = useTelegram();

  const correctCount = answers.filter(a => a.isCorrect).length;
  const totalQuestions = questions.length;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isPerfect = correctCount === totalQuestions && totalQuestions > 0;

  // Score & coins calculation (mirroring endGame logic for display)
  const avgTime = answers.length > 0 ? answers.reduce((s, a) => s + a.timeSpent, 0) / answers.length : 0;
  let roundScore = correctCount * 10;
  if (avgTime < 5) roundScore += 5;
  if (bestStreak >= 5) roundScore += 10;
  if (bestStreak >= 10) roundScore += 20;
  if (isPerfect) roundScore += 25;
  const coinsEarned = Math.ceil(roundScore / 2);

  const league = LEAGUES.find(l => l.id === currentLeague) || LEAGUES[0];
  const nextLeague = LEAGUES[LEAGUES.indexOf(league) + 1];
  const leagueProgress = getLeagueProgress(totalScore);

  const newXPAchievements = newAchievements.map(id => ACHIEVEMENTS.find(a => a.id === id)).filter(Boolean);

  const shareText = `🧠 КВИЗЛИК\n\nЯ набрал ${roundScore} очков!\n✅ ${correctCount}/${totalQuestions} правильных ответов\n🔥 Лучшая серия: ${bestStreak}\n📊 Лига: ${league.emoji} ${league.name}\n\nПопробуй побить мой рекорд!`;

  const handleShare = () => {
    haptic('light');
    if (isInTelegram && tg) {
      try {
        tg.showPopup({
          title: 'Поделиться результатом',
          message: shareText,
          buttons: [{ type: 'ok' }],
        });
      } catch {
        navigator.clipboard.writeText(shareText);
      }
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#0f0a1e] px-4 py-6 flex flex-col">
      {/* Trophy Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 100 }}
        className="text-center mb-6"
      >
        <div className="text-6xl mb-2">
          {isPerfect ? '🏆' : correctCount > totalQuestions / 2 ? '⭐' : '💪'}
        </div>
        <h2 className="text-white text-2xl font-black">
          {isPerfect ? 'Перфект!' : correctCount > totalQuestions / 2 ? 'Отлично!' : 'Не сдавайся!'}
        </h2>
      </motion.div>

      {/* Score Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#1a1235] border border-white/10 rounded-2xl p-5 mb-4"
      >
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <p className="text-2xl font-black text-green-400">{correctCount}</p>
            <p className="text-white/40 text-[10px]">из {totalQuestions}</p>
            <p className="text-white/50 text-xs">правильных</p>
          </div>
          <div>
            <p className="text-2xl font-black text-purple-400">{roundScore}</p>
            <p className="text-white/40 text-[10px]">очков</p>
            <p className="text-white/50 text-xs">набрано</p>
          </div>
          <div>
            <p className="text-2xl font-black text-yellow-400">{coinsEarned}</p>
            <p className="text-white/40 text-[10px]">монет</p>
            <p className="text-white/50 text-xs">заработано</p>
          </div>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-white/10">
          <span className="text-white/50 text-sm">Точность</span>
          <span className="text-white font-bold text-sm">{accuracy}%</span>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-white/10">
          <span className="text-white/50 text-sm">Лучшая серия</span>
          <span className="text-orange-400 font-bold text-sm">🔥 {bestStreak}</span>
        </div>
      </motion.div>

      {/* League Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#1a1235] border border-white/10 rounded-2xl p-4 mb-4"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{league.emoji}</span>
            <span className="text-white font-bold text-sm">{league.name}</span>
          </div>
          {nextLeague && (
            <div className="flex items-center gap-2">
              <span className="text-white/30 text-xs">→</span>
              <span className="text-lg">{nextLeague.emoji}</span>
              <span className="text-white/50 text-xs">{nextLeague.name}</span>
            </div>
          )}
        </div>
        <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${leagueProgress}%` }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-full rounded-full"
            style={{ backgroundColor: league.color }}
          />
        </div>
        <p className="text-white/40 text-[10px] mt-1 text-right">{leagueProgress}% до {nextLeague?.name || 'максимума'}</p>
      </motion.div>

      {/* New Achievements */}
      {newXPAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-4"
        >
          <p className="text-yellow-300 font-bold text-sm mb-2">🏅 Новые достижения!</p>
          {newXPAchievements.map(ach => ach && (
            <div key={ach.id} className="flex items-center gap-2 py-1">
              <span className="text-lg">{ach.emoji}</span>
              <span className="text-white/80 text-sm">{ach.name}</span>
              <span className="text-yellow-300/60 text-xs ml-auto">+{ach.reward} 🪙</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="mt-auto flex flex-col gap-2.5">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { haptic('light'); playAgain(); }}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-purple-600/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Играть снова
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleShare}
          className="w-full bg-[#1a1235] border border-white/10 text-white/80 font-medium py-3 rounded-2xl hover:bg-[#221a45] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" /> Поделиться
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { haptic('light'); setPhase('home'); }}
          className="w-full bg-[#1a1235] border border-white/10 text-white/60 font-medium py-3 rounded-2xl hover:bg-[#221a45] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" /> На главную
        </motion.button>
      </div>
    </div>
  );
}
