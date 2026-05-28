'use client';

import { useQuizStore, type DuelData } from '@/lib/quiz-store';
import { THEMES } from '@/lib/quiz-data';
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
import ThemesScreen from '@/components/game/ThemesScreen';
import ChestScreen from '@/components/game/ChestScreen';
import TournamentScreen from '@/components/game/TournamentScreen';
import FaqScreen from '@/components/game/FaqScreen';
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
  themes: ThemesScreen,
  chest: ChestScreen,
  tournament: TournamentScreen,
  faq: FaqScreen,
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
          creatorReactions: decoded.creatorReactions || [],
        };

        const questions = getQuestionsByIds(duelData.questions);

        if (questions.length > 0) {
          joinDuel(duelData, questions);
        } else {
          const fallbackQuestions = getMixedQuestions(10, []);
          joinDuel(duelData, fallbackQuestions);
        }

        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
      } catch {
        console.error('Invalid duel parameter');
      }
    }
  }, [joinDuel, setPhase]);
}

function useCloudSync() {
  const { telegramId, syncFromCloud, isCloudLoaded } = useQuizStore();

  useEffect(() => {
    if (telegramId && !isCloudLoaded) {
      syncFromCloud();
    }
  }, [telegramId, isCloudLoaded, syncFromCloud]);
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { currentTheme } = useQuizStore();
  const theme = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-bg', theme.colors.bg);
    root.style.setProperty('--theme-card', theme.colors.card);
    root.style.setProperty('--theme-card-hover', theme.colors.cardHover);
    root.style.setProperty('--theme-accent-from', theme.colors.accentFrom);
    root.style.setProperty('--theme-accent-to', theme.colors.accentTo);
    if (theme.colors.textAccent) {
      root.style.setProperty('--theme-text-accent', theme.colors.textAccent);
    } else {
      root.style.removeProperty('--theme-text-accent');
    }
  }, [currentTheme, theme]);

  return <>{children}</>;
}

export default function Home() {
  const { phase } = useQuizStore();
  const Component = phaseComponents[phase] || HomeScreen;

  useDuelUrlHandler();
  useCloudSync();

  return (
    <ThemeProvider>
      <main className="min-h-[100dvh] bg-[var(--theme-bg)] overflow-hidden">
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
    </ThemeProvider>
  );
}
