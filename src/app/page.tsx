'use client';

import { useQuizStore, type DuelData } from '@/lib/quiz-store';
import HomeScreen from '@/components/game/HomeScreen';
import CategoryScreen from '@/components/game/CategoryScreen';
import GameScreen from '@/components/game/GameScreen';
import ResultScreen from '@/components/game/ResultScreen';
import LeaderboardScreen from '@/components/game/LeaderboardScreen';
import ProfileScreen from '@/components/game/ProfileScreen';
import AchievementsScreen from '@/components/game/AchievementsScreen';
import ShopScreen from '@/components/game/ShopScreen';
import DailyScreen from '@/components/game/DailyScreen';
import DuelScreen from '@/components/game/DuelScreen';
import DuelResultScreen from '@/components/game/DuelResultScreen';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { getQuestionsByIds, getMixedQuestions } from '@/lib/quiz-data';

const phaseComponents: Record<string, React.ComponentType> = {
  home: HomeScreen,
  category: CategoryScreen,
  game: GameScreen,
  result: ResultScreen,
  leaderboard: LeaderboardScreen,
  profile: ProfileScreen,
  achievements: AchievementsScreen,
  shop: ShopScreen,
  daily: DailyScreen,
  duel: DuelScreen,
  duel_result: DuelResultScreen,
};

function useDuelUrlHandler() {
  const { joinDuel, setPhase } = useQuizStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const duelParam = params.get('duel');

    if (duelParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(duelParam)));
        const duelData: DuelData = {
          questions: decoded.questions,
          creatorScore: decoded.creatorScore,
          creatorName: decoded.creatorName,
        };

        // Get questions by IDs
        const questions = getQuestionsByIds(duelData.questions);

        if (questions.length > 0) {
          joinDuel(duelData, questions);
        } else {
          // Fallback: generate random questions if IDs don't match
          const fallbackQuestions = getMixedQuestions(10, []);
          joinDuel(duelData, fallbackQuestions);
        }

        // Clean URL without reloading
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
      } catch {
        // Invalid duel data, ignore
        console.error('Invalid duel parameter');
      }
    }
  }, [joinDuel, setPhase]);
}

export default function Home() {
  const { phase } = useQuizStore();
  const Component = phaseComponents[phase] || HomeScreen;

  useDuelUrlHandler();

  return (
    <main className="min-h-[100dvh] bg-[#0f0a1e] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <Component />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
