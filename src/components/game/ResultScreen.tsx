'use client';

import { motion } from 'framer-motion';
import { useQuizStore, calcLevel, calcXpForLevel } from '@/lib/quiz-store';
import { LEAGUES, getLeagueByScore, getLeagueProgress, ACHIEVEMENTS } from '@/lib/quiz-data';
import { useTelegram } from '@/hooks/use-telegram';
import { Trophy, Home, RotateCcw, Share2, Swords, Skull } from 'lucide-react';
import { playWin, playCoin } from '@/lib/sounds';
import { useEffect, useState, useCallback } from 'react';

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
    duelMode,
    gameMode,
    survivalRecord,
    playAgain,
    setPhase,
    finishDuelCreator,
    finishDuelChallenger,
    telegramId,
  } = useQuizStore();

  const { haptic, tg, isInTelegram } = useTelegram();

  const correctCount = answers.filter(a => a.isCorrect).length;
  const totalQuestions = questions.length;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isPerfect = correctCount === totalQuestions && totalQuestions > 0;
  const isSurvival = gameMode === 'survival';

  useEffect(() => {
    if (accuracy >= 70) {
      playWin();
      if (accuracy === 100) {
        setTimeout(() => playCoin(), 800);
      }
    }
  }, []);

  const [duelShareLink, setDuelShareLink] = useState<string | null>(null);

  const handleDuelFinish = useCallback(() => {
    if (duelMode && !useQuizStore.getState().duelData) {
      const link = finishDuelCreator();
      setDuelShareLink(link);
    } else if (duelMode && useQuizStore.getState().duelData) {
      finishDuelChallenger();
    }
  }, [duelMode, finishDuelCreator, finishDuelChallenger]);

  const avgTime = answers.length > 0 ? answers.reduce((s, a) => s + a.timeSpent, 0) / answers.length : 0;
  let roundScore = correctCount * 10;
  if (avgTime < 5) roundScore += 5;
  if (bestStreak >= 5) roundScore += 10;
  if (bestStreak >= 10) roundScore += 20;
  if (isPerfect) roundScore += 25;

  if (isSurvival) {
    const multiplier = 1 + Math.floor(correctCount / 5) * 0.5;
    roundScore = Math.round(roundScore * Math.min(multiplier, 3));
  }

  const coinsEarned = Math.ceil(roundScore / 2);

  const league = LEAGUES.find(l => l.id === currentLeague) || LEAGUES[0];
  const nextLeague = LEAGUES[LEAGUES.indexOf(league) + 1];
  const leagueProgress = getLeagueProgress(totalScore);

  const newXPAchievements = newAchievements.map(id => ACHIEVEMENTS.find(a => a.id === id)).filter(Boolean);

  // Build the referral URL — includes ref parameter if player has a telegramId
  const referralUrl = telegramId
    ? `https://t.me/kvizlik_bot/kvizlik?startapp=ref_${telegramId}`
    : 'https://t.me/kvizlik_bot/kvizlik';

  // Share message formatted for Telegram
  const shareMessage = isSurvival
    ? `🧠 КВИЗЛИК — Выживание!\n\n📊 Счёт: ${roundScore}\n💀 Продержался: ${correctCount}\n🔥 Рекорд: ${survivalRecord}\n🏅 Лига: ${league.emoji} ${league.name}\n\nИграй тоже! 👇`
    : `🧠 КВИЗЛИК — Мой результат!\n\n📊 Счёт: ${roundScore}\n✅ Правильных: ${correctCount}/${totalQuestions}\n🔥 Серия: ${bestStreak}\n🏅 Лига: ${league.emoji} ${league.name}\n\nИграй тоже! 👇`;

  // Share to Telegram — uses openTelegramLink inside TG WebApp, otherwise window.open
  const handleShareToTelegram = () => {
    haptic('light');
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(shareMessage)}`;
    if (isInTelegram && tg) {
      try {
        tg.openTelegramLink(shareUrl);
      } catch {
        window.open(shareUrl, '_blank');
      }
    } else {
      window.open(shareUrl, '_blank');
    }
  };

  // Legacy share handler (clipboard fallback)
  const shareText = isSurvival
    ? `🧠 КВИЗЛИК — Выживание\n\nЯ продержался ${correctCount} вопросов!\n💀 Рекорд: ${survivalRecord}\n📊 Лига: ${league.emoji} ${league.name}\n\nПопробуй побить мой рекорд!`
    : `🧠 КВИЗЛИК\n\nЯ набрал ${roundScore} очков!\n✅ ${correctCount}/${totalQuestions} правильных ответов\n🔥 Лучшая серия: ${bestStreak}\n📊 Лига: ${league.emoji} ${league.name}\n\nПопробуй побить мой рекорд!`;

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
    <div className="min-h-[100dvh] bg-[var(--theme-bg)] px-4 py-6 flex flex-col">
      {/* Trophy Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 100 }}
        className="text-center mb-6"
      >
        <div className="text-6xl mb-2">
          {isSurvival ? '💀' : isPerfect ? '🏆' : correctCount > totalQuestions / 2 ? '⭐' : '💪'}
        </div>
        <h2 className="text-white text-2xl font-black">
          {isSurvival ? `Выживание: ${correctCount}` : isPerfect ? 'Перфект!' : correctCount > totalQuestions / 2 ? 'Отлично!' : 'Не сдавайся!'}
        </h2>
        {isSurvival && (
          <p className="text-red-400/70 text-sm mt-1">
            Рекорд: {survivalRecord} правильных
          </p>
        )}
      </motion.div>

      {/* Score Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-5 mb-4"
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

        {isSurvival && correctCount >= 5 && (
          <div className="text-center mb-3">
            <span className="bg-red-500/20 text-red-300 text-[10px] font-bold px-2 py-1 rounded-full">
              Множитель x{Math.min(1 + Math.floor(correctCount / 5) * 0.5, 3).toFixed(1)}
            </span>
          </div>
        )}

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
        className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-4 mb-4"
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
        {duelMode && !duelShareLink ? (
          <>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { haptic('medium'); handleDuelFinish(); }}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-red-600/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
              <Swords className="w-4 h-4" /> Завершить дуэль
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { haptic('light'); useQuizStore.setState({ duelMode: false, duelData: null, duelResult: null }); setPhase('home'); }}
              className="w-full bg-[var(--theme-card)] border border-white/10 text-white/60 font-medium py-3 rounded-2xl hover:bg-[var(--theme-card-hover)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" /> На главную
            </motion.button>
          </>
        ) : duelShareLink ? (
          <>
            <div className="bg-[var(--theme-card)] border border-white/10 rounded-2xl p-4 mb-2">
              <p className="text-white/40 text-[10px] mb-2 uppercase tracking-wider">Ссылка для дуэли</p>
              <p className="text-white/80 text-xs break-all leading-relaxed font-mono">
                {duelShareLink}
              </p>
            </div>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                haptic('light');
                const text = `⚔️ Вызываю тебя на дуэль в КВИЗЛИК! Пройди те же вопросы и побей мой счёт! 🧠\n${duelShareLink}`;
                if (isInTelegram && tg) {
                  try {
                    tg.openTelegramLink(
                      `https://t.me/share/url?url=${encodeURIComponent(duelShareLink)}&text=${encodeURIComponent('⚔️ Вызываю тебя на дуэль в КВИЗЛИК! Пройди те же вопросы и побей мой счёт! 🧠')}`
                    );
                  } catch {
                    navigator.clipboard.writeText(text);
                  }
                } else {
                  navigator.clipboard.writeText(text);
                }
              }}
              className="w-full bg-[#2AABEE] hover:bg-[#229ED9] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-[#2AABEE]/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
              Поделиться в Telegram
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { haptic('light'); useQuizStore.setState({ duelMode: false, duelData: null, duelResult: null }); setPhase('home'); }}
              className="w-full bg-[var(--theme-card)] border border-white/10 text-white/60 font-medium py-3 rounded-2xl hover:bg-[var(--theme-card-hover)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" /> На главную
            </motion.button>
          </>
        ) : (
          <>
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

            {/* Share Results to Telegram — prominent button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleShareToTelegram}
              className="w-full bg-gradient-to-r from-[#2AABEE] to-[#229ED9] hover:from-[#2AABEE] hover:to-[#229ED9] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-[#2AABEE]/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" /> Поделиться результатом
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleShare}
              className="w-full bg-[var(--theme-card)] border border-white/10 text-white/80 font-medium py-3 rounded-2xl hover:bg-[var(--theme-card-hover)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" /> Скопировать результат
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { haptic('light'); useQuizStore.setState({ duelMode: false, duelData: null, duelResult: null }); setPhase('home'); }}
              className="w-full bg-[var(--theme-card)] border border-white/10 text-white/60 font-medium py-3 rounded-2xl hover:bg-[var(--theme-card-hover)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" /> На главную
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
