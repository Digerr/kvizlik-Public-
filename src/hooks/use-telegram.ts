"use client";

import { usePlatform, detectPlatform } from "./use-platform";

// ===== Keep all existing types for backward compatibility =====

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
  showPopup: (params: { title?: string; message: string; buttons?: any[] }, callback?: (id: string) => void) => void;
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

/**
 * Backward-compatible useTelegram hook.
 * Now wraps usePlatform — works on Telegram, VK, and web.
 * Existing components don't need ANY changes.
 */
export function useTelegram() {
  const p = usePlatform();

  // Create a TelegramWebApp-compatible object for components that use tg.*
  const tgCompat: TelegramWebApp = (() => {
    // In Telegram, use the real Telegram WebApp object
    if (p.platform === "telegram" && typeof window !== "undefined" && window.Telegram?.WebApp) {
      return window.Telegram.WebApp;
    }
    // For VK/web, create a compatible adapter that won't crash
    return {
      ready: () => p.ready(),
      close: () => {},
      expand: () => p.expand(),
      openTelegramLink: (url: string) => p.openLink(url),
      MainButton: { text: "", show: () => {}, hide: () => {}, onClick: () => {} },
      BackButton: { show: () => {}, hide: () => {}, onClick: () => {} },
      initDataUnsafe: {
        user: p.tgUser || (p.vkUser ? {
          id: p.vkUser.id,
          first_name: p.vkUser.first_name,
        } : undefined),
        start_param: undefined,
      },
      colorScheme: "dark" as const,
      themeParams: {},
      showPopup: (params, callback) => {
        p.showPopup(params);
        callback?.("ok");
      },
      HapticFeedback: {
        impactOccurred: (style) => p.haptic(style),
        notificationOccurred: (type) => p.haptic(type),
        selectionChanged: () => {},
      },
      isExpanded: true,
    };
  })();

  // Build user object from either TG or VK
  const user: TelegramUser | null = p.tgUser || (p.vkUser ? {
    id: p.vkUser.id,
    first_name: p.vkUser.first_name,
    last_name: p.vkUser.last_name,
  } : null);

  return {
    tg: tgCompat,
    user,
    isInTelegram: p.isInApp,
    haptic: p.haptic,
    // VK-specific info
    platform: p.platform,
    isInVK: p.platform === "vk",
  };
}
