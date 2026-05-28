'use client';

import { useQuizStore } from '@/lib/quiz-store';
import HomeScreen from '@/components/game/HomeScreen';
import CategoryScreen from '@/components/game/CategoryScreen';
import GameScreen from '@/components/game/GameScreen';
import ResultScreen from '@/components/game/ResultScreen';
import LeaderboardScreen from '@/components/game/LeaderboardScreen';
import ProfileScreen from '@/components/game/ProfileScreen';
import AchievementsScreen from '@/components/game/AchievementsScreen';
import ShopScreen from '@/components/game/ShopScreen';
import DailyScreen from '@/components/game/DailyScreen';
import { AnimatePresence, motion } from 'framer-motion';

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
};

export default function Home() {
  const { phase } = useQuizStore();
  const Component = phaseComponents[phase] || HomeScreen;

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
