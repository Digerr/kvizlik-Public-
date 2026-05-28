'use client';

import { useGameStore } from '@/lib/game-store';
import HomeScreen from '@/components/game/HomeScreen';
import SetupScreen from '@/components/game/SetupScreen';
import RoleRevealScreen from '@/components/game/RoleRevealScreen';
import QuestioningScreen from '@/components/game/QuestioningScreen';
import VotingScreen from '@/components/game/VotingScreen';
import SpyGuessScreen from '@/components/game/SpyGuessScreen';
import ResultsScreen from '@/components/game/ResultsScreen';
import RulesScreen from '@/components/game/RulesScreen';
import { AnimatePresence, motion } from 'framer-motion';

const phaseComponents: Record<string, React.ComponentType> = {
  home: HomeScreen,
  setup: SetupScreen,
  rules: RulesScreen,
  roleReveal: RoleRevealScreen,
  questioning: QuestioningScreen,
  voting: VotingScreen,
  spyGuess: SpyGuessScreen,
  results: ResultsScreen,
};

export default function Home() {
  const { phase } = useGameStore();
  const Component = phaseComponents[phase] || HomeScreen;

  return (
    <main className="min-h-[100dvh] bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <Component />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
