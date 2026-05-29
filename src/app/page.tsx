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
import SeasonPassScreen from '@/components/game/SeasonPassScreen';
import EventScreen from '@/components/game/EventScreen';
import MiniGameScreen from '@/components/game/MiniGameScreen';
import FriendsScreen from '@/components/game/FriendsScreen';
import ClanScreen from '@/components/game/ClanScreen';
import SubmitQuestionScreen from '@/components/game/SubmitQuestionScreen';
import OnboardingScreen from '@/components/game/OnboardingScreen';
import PrivacyPolicyScreen from '@/components/game/PrivacyPolicyScreen';
import UnsupportedScreen from '@/components/game/UnsupportedScreen';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { getQuestionsByIds, getMixedQuestions } from '@/lib/quiz-data';
import { detectPlatform } from '@/hooks/use-platform';

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
  season_pass: SeasonPassScreen,
  event: EventScreen,
  mini_game: MiniGameScreen,
  friends: FriendsScreen,
  clan: ClanScreen,
  submit_question: SubmitQuestionScreen,
  onboarding: OnboardingScreen,
  privacy_policy: PrivacyPolicyScreen,
  unsupported: UnsupportedScreen,
};

// ---------------------------------------------------------------------------
// Notification helpers
// ---------------------------------------------------------------------------

const LS_LAST_PLAY_DATE = 'kvizlik_last_play_date';
const LS_NOTIF_ASKED = 'kvizlik_notif_asked';

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function hasPlayedToday(): boolean {
  try {
    const lastPlay = localStorage.getItem(LS_LAST_PLAY_DATE);
    return lastPlay === getTodayStr();
  } catch {
    return false;
  }
}

function markPlayedToday(): void {
  try {
    localStorage.setItem(LS_LAST_PLAY_DATE, getTodayStr());
  } catch {
    // localStorage unavailable – ignore
  }
}

function hasNotifBeenAsked(): boolean {
  try {
    return localStorage.getItem(LS_NOTIF_ASKED) === 'true';
  } catch {
    return false;
  }
}

function markNotifAsked(): void {
  try {
    localStorage.setItem(LS_NOTIF_ASKED, 'true');
  } catch {
    // ignore
  }
}

/**
 * Attempt to request notification / write access through the Telegram WebApp
 * API.  Falls back gracefully when the API is unavailable (e.g. dev browser).
 */
function requestNotifications(): void {
  try {
    const tg = window.Telegram?.WebApp;
    // Prefer requestWriteAccess (grants permission to send messages from bot)
    if (typeof tg?.requestWriteAccess === 'function') {
      tg.requestWriteAccess((granted: boolean) => {
        if (granted) {
          console.log('[KVIZLIK] Write access granted – bot can send reminders');
        }
      });
    }
  } catch {
    console.warn('[KVIZLIK] Telegram requestWriteAccess not available');
  }
}

/**
 * Show a friendly Telegram popup asking the user if they want daily
 * reminders.  Only shown once (tracked in localStorage).
 */
function showNotifPermissionPopup(): void {
  if (hasNotifBeenAsked()) return;

  try {
    const tg = window.Telegram?.WebApp;
    if (typeof tg?.showPopup === 'function') {
      tg.showPopup(
        {
          title: 'Ежедневные напоминания',
          message: 'Хотите получать напоминания играть каждый день? \uD83D\uDD14',
          buttons: [
            { type: 'ok', text: 'Да, хочу!' },
            { type: 'cancel', text: 'Нет, спасибо' },
          ],
        },
        (buttonId: string) => {
          if (buttonId === 'ok' || buttonId === '') {
            requestNotifications();
          }
          // Mark as asked regardless of answer so we never show it again
          markNotifAsked();
        },
      );
    } else {
      // Running outside Telegram – just mark as asked so we don't retry
      markNotifAsked();
    }
  } catch {
    markNotifAsked();
  }
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

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

function useReferralHandler() {
  const { telegramId, processReferral } = useQuizStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const platform = detectPlatform();

    // Telegram referral: ?startapp=ref_XXXX
    const startParam = params.get('startapp') || params.get('startApp') || window.Telegram?.WebApp?.initData?.start_param;
    if (startParam && startParam.startsWith('ref_')) {
      const referrerId = parseInt(startParam.replace('ref_', ''));
      if (referrerId && referrerId !== Number(telegramId)) {
        processReferral(referrerId);
      }
    }

    // VK referral: ?vk_ref=ref_XXXX
    const vkRef = params.get('vk_ref');
    if (platform === 'vk' && vkRef && vkRef.startsWith('ref_')) {
      const referrerId = parseInt(vkRef.replace('ref_', ''));
      if (referrerId && referrerId !== Number(telegramId?.replace('vk_', ''))) {
        processReferral(referrerId);
      }
    }
  }, [telegramId, processReferral]);
}

interface CloudSyncResult {
  gamesPlayedToday: number;
  showReminder: boolean;
}

function useCloudSync(): CloudSyncResult {
  const { telegramId, syncFromCloud, isCloudLoaded, gamesPlayedToday: storeGamesToday } = useQuizStore();
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    if (telegramId && !isCloudLoaded) {
      syncFromCloud();
    }
  }, [telegramId, isCloudLoaded, syncFromCloud]);

  // After cloud sync completes, determine reminder state
  useEffect(() => {
    if (!isCloudLoaded) return;

    const playedToday = storeGamesToday > 0 || hasPlayedToday();
    setShowReminder(!playedToday);

    // Persist today's play date if the user *has* played
    if (storeGamesToday > 0) {
      markPlayedToday();
    }
  }, [isCloudLoaded, storeGamesToday]);

  return { gamesPlayedToday: storeGamesToday, showReminder };
}

/**
 * Hook that manages the notification reminder system.
 * - Shows a "haven't played today" banner on the Home screen
 * - Shows a one-time Telegram popup asking about daily reminders
 * - Provides motivational messages based on streak / inactivity
 */
function useNotificationReminder(showReminder: boolean) {
  const { setPhase } = useQuizStore();
  const [showBanner, setShowBanner] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState<string | null>(null);

  const motivationalMessages = [
    '🔥 Ты давно не играл! Начни игру!',
    '⚡️ Твои знания скучают — сыграй раунд!',
    '🎯 Новые вопросы ждут тебя!',
    '🧠 Потренируй мозг — начни игру!',
    '🏆 Чемпион не отдыхает — играй!',
  ];

  // Determine whether to show the banner
  useEffect(() => {
    if (showReminder) {
      // Pick a random motivational message
      const idx = Math.floor(Math.random() * motivationalMessages.length);
      setMotivationalMessage(motivationalMessages[idx]);
      setShowBanner(true);
    } else {
      setShowBanner(false);
      setMotivationalMessage(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showReminder]);

  // One-time notification permission request after cloud sync
  useEffect(() => {
    if (!showReminder) return; // only ask when they haven't played today
    // Small delay so the UI settles first
    const timer = setTimeout(() => {
      showNotifPermissionPopup();
    }, 3000);
    return () => clearTimeout(timer);
  }, [showReminder]);

  // Track play date whenever the phase transitions away from a game
  const phase = useQuizStore((s) => s.phase);
  useEffect(() => {
    if (phase === 'result' || phase === 'duel_result' || phase === 'chest') {
      markPlayedToday();
      setShowBanner(false);
    }
  }, [phase]);

  const handleBannerPlay = useCallback(() => {
    setPhase('category');
    markPlayedToday();
    setShowBanner(false);
  }, [setPhase]);

  const dismissBanner = useCallback(() => {
    setShowBanner(false);
  }, []);

  return { showBanner, motivationalMessage, handleBannerPlay, dismissBanner };
}

// ---------------------------------------------------------------------------
// UI: Reminder Banner
// ---------------------------------------------------------------------------

function ReminderBanner({
  message,
  onPlay,
  onDismiss,
}: {
  message: string;
  onPlay: () => void;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mx-4 mb-3 rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FF6B35 0%, #FF3D71 100%)',
        boxShadow: '0 4px 20px rgba(255, 61, 113, 0.35)',
      }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-white text-sm font-semibold flex-1 mr-2">{message}</p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onPlay}
            className="px-4 py-1.5 bg-white rounded-lg text-sm font-bold"
            style={{ color: '#FF3D71' }}
          >
            Играть
          </button>
          <button
            onClick={onDismiss}
            className="text-white/70 hover:text-white text-lg leading-none px-1"
            aria-label="Dismiss reminder"
          >
            ✕
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Theme provider
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function Home() {
  const { phase, hasSeenTutorial, setHasSeenTutorial } = useQuizStore();
  
  // Show onboarding for first-time users
  const showOnboarding = !hasSeenTutorial;
  
  const effectivePhase = isUnsupported ? 'unsupported' : showOnboarding ? 'onboarding' : phase;
  const Component = phaseComponents[effectivePhase] || HomeScreen;

  // Detect unsupported browsers
  const isUnsupported = typeof window !== 'undefined' && (() => {
    try {
      const ua = navigator.userAgent;
      // Very old browsers detection
      const isOldAndroid = /Android [1-4]/.test(ua);
      const isOldIOS = /iPhone OS [1-9]_/.test(ua) && !/iPhone OS 1[0-9]/.test(ua);
      const isOperaMini = /Opera Mini/.test(ua);
      const isUCBrowser = /UCBrowser/.test(ua) && parseFloat(ua.match(/UCBrowser\/([\d.]+)/)?.[1] || '99') < 12;
      return isOldAndroid || isOldIOS || isOperaMini || isUCBrowser;
    } catch { return false; }
  })();

  useDuelUrlHandler();
  const { gamesPlayedToday, showReminder } = useCloudSync();
  useReferralHandler();

  const { showBanner, motivationalMessage, handleBannerPlay, dismissBanner } =
    useNotificationReminder(showReminder);

  // Effect: when phase is home, check and possibly show motivational message
  // in the console for debugging and set a CSS class for badge styling
  useEffect(() => {
    if (phase === 'home' && showReminder) {
      console.log('[KVIZLIK] Reminder: user has not played today');
    }
  }, [phase, showReminder]);

  return (
    <ThemeProvider>
      <main className="min-h-[100dvh] bg-[var(--theme-bg)] overflow-hidden">
        {/* Notification reminder banner – only shown on home screen */}
        <AnimatePresence>
          {!showOnboarding && phase === 'home' && showBanner && motivationalMessage && (
            <ReminderBanner
              message={motivationalMessage}
              onPlay={handleBannerPlay}
              onDismiss={dismissBanner}
            />
          )}
        </AnimatePresence>

        {/* Subtle badge indicator when user hasn't played today */}
        {!showOnboarding && phase === 'home' && gamesPlayedToday === 0 && !showBanner && (
          <div className="flex justify-center mt-2">
            <span
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(255, 107, 53, 0.15)',
                color: '#FF6B35',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
              </span>
              Ещё не играл сегодня
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={effectivePhase}
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

