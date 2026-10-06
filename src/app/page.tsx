"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import { useQuizStore } from "@/lib/quiz-store";
import { usePlatform } from "@/hooks/use-platform";
import { decodeDuel } from "@/lib/duel";
import { getQuestionsByIds } from "@/lib/quiz-data";
import HomeScreen from "@/components/game/HomeScreen";
import { BottomNav } from "@/components/game/QuizUI";
const loading = () => (
  <div className="q-screen q-loading" role="status">
    Открываем…
  </div>
);
const screen = (load: () => Promise<{ default: React.ComponentType }>) =>
  dynamic(load, { loading });
const screens: Record<string, React.ComponentType> = {
  home: HomeScreen,
  category: screen(() => import("@/components/game/CategoryScreen")),
  game: screen(() => import("@/components/game/GameScreen")),
  result: screen(() => import("@/components/game/ResultScreen")),
  duel_result: screen(() => import("@/components/game/ResultScreen")),
  leaderboard: screen(() => import("@/components/game/LeaderboardScreen")),
  profile: screen(() => import("@/components/game/ProfileScreen")),
  achievements: screen(() => import("@/components/game/AchievementsScreen")),
  shop: screen(() => import("@/components/game/ShopScreen")),
  daily: screen(() => import("@/components/game/DailyScreen")),
  duel: screen(() => import("@/components/game/DuelScreen")),
  themes: screen(() => import("@/components/game/ThemesScreen")),
  chest: screen(() => import("@/components/game/ChestScreen")),
  faq: screen(() => import("@/components/game/FaqScreen")),
  onboarding: screen(() => import("@/components/game/OnboardingScreen")),
  privacy_policy: screen(() => import("@/components/game/PrivacyPolicyScreen")),
};
export default function Home() {
  const s = useQuizStore();
  const { vkInsetTop } = usePlatform();
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  // Hydration gate: persisted browser state is unavailable during server rendering.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
    const params = new URLSearchParams(window.location.search);
    const value = params.get("duel");
    if (value) {
      const data = decodeDuel(value);
      if (data) {
        s.setHasSeenTutorial(true);
        s.joinDuel(data, getQuestionsByIds(data.questions));
      } else
        setNotice("Ссылка на дуэль повреждена. Можно начать обычный раунд.");
      params.delete("duel");
      window.history.replaceState(
        {},
        "",
        window.location.pathname + (params.size ? "?" + params.toString() : ""),
      );
    }
  }, []);
  useEffect(() => {
    if (!ready) return;
    const dark = s.currentTheme !== "light_theme";
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("light", !dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  }, [ready, s.currentTheme]);
  useEffect(() => {
    if (ready && s.telegramId && !s.isCloudLoaded && !s.isCloudSyncing)
      void s.syncFromCloud();
  }, [ready, s.telegramId, s.isCloudLoaded]);
  useEffect(() => {
    if (!s.telegramId) return;
    const params = new URLSearchParams(window.location.search);
    const start =
      params.get("startapp") ||
      window.Telegram?.WebApp?.initDataUnsafe?.start_param;
    if (start?.startsWith("ref_"))
      void s.processReferral(Number(start.slice(4)));
  }, [s.telegramId]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [s.phase]);
  useEffect(() => {
    const tg = window.Telegram?.WebApp as any;
    if (!tg?.BackButton) return;
    const back = () => {
      if (useQuizStore.getState().phase === "game") return;
      useQuizStore.getState().setPhase("home");
    };
    if (s.phase !== "home" && s.phase !== "game") tg.BackButton.show();
    else tg.BackButton.hide();
    tg.BackButton.onClick(back);
    return () => tg.BackButton.offClick(back);
  }, [s.phase]);
  if (!ready) return <div className="q-screen q-loading">Квизлик</div>;
  const phase = !s.hasSeenTutorial ? "onboarding" : s.phase;
  const Component = screens[phase] || HomeScreen;
  const nav = !["game", "onboarding", "chest"].includes(phase);
  return (
    <MotionConfig reducedMotion="user">
      <main
        className={`q-shell ${nav ? "with-nav" : ""}`}
        style={{ paddingTop: vkInsetTop || undefined }}
      >
        {notice && (
          <div className="q-notice" role="alert">
            {notice}
            <button
              aria-label="Закрыть уведомление"
              onClick={() => setNotice("")}
            >
              ×
            </button>
          </div>
        )}
        <Component />
        {nav && <BottomNav />}
      </main>
    </MotionConfig>
  );
}
