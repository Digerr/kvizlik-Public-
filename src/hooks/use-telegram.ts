"use client";

import { useEffect, useState } from "react";
import { useQuizStore } from "@/lib/quiz-store";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebApp {
  ready: () => void;
  close: () => void;
  expand: () => void;
  openTelegramLink: (url: string) => void;
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    onClick: (fn: () => void) => void;
  };
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (fn: () => void) => void;
  };
  initDataUnsafe: {
    user?: TelegramUser;
    start_param?: string;
  };
  colorScheme: "light" | "dark";
  themeParams: Record<string, string>;
  showPopup: (params: { title?: string; message: string; buttons?: any[] }) => void;
  HapticFeedback: {
    impactOccurred: (style: "light" | "medium" | "heavy") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
  isExpanded: boolean;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export function useTelegram() {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isInTelegram, setIsInTelegram] = useState(false);
  const { setTelegramId, setPlayerName, playerName } = useQuizStore();

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;

      // Ready
      webApp.ready();
      webApp.expand();

      // Schedule state updates asynchronously to avoid cascading renders
      const timer = setTimeout(() => {
        setTg(webApp);
        setIsInTelegram(true);
        if (webApp.initDataUnsafe?.user) {
          const tgUser = webApp.initDataUnsafe.user;
          setUser(tgUser);

          // Save Telegram ID to store (triggers cloud sync via page.tsx)
          const tid = String(tgUser.id);
          setTelegramId(tid);

          // Auto-set player name from Telegram if not set
          if (!playerName && tgUser.first_name) {
            setPlayerName(tgUser.first_name);
          }
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, []);

  const haptic = (type: "light" | "medium" | "heavy" | "success" | "error" | "warning") => {
    if (!tg) return;
    if (type === "success" || type === "error" || type === "warning") {
      tg.HapticFeedback.notificationOccurred(type);
    } else {
      tg.HapticFeedback.impactOccurred(type);
    }
  };

  return { tg, user, isInTelegram, haptic };
}
