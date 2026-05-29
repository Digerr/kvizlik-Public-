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
  const platform = usePlatform();

  // Create a TelegramWebApp-compatible object for components that use tg.*
  const tgCompat: TelegramWebApp | null = (() => {
    if (platform.platform === "telegram" && typeof window !== "undefined" && window.Telegram?.WebApp) {
      return window.Telegram.WebApp;
    }
    // For VK/web, create a compatible adapter
    return {
      ready: platform.ready,
      close: () => {},
      expand: platform.expand,
      openTelegramLink: (url: string) => platform.openLink(url),
      MainButton: { text: "", show: () => {}, hide: () => {}, onClick: () => {} },
      BackButton: { show: () => {}, hide: () => {}, onClick: () => {} },
      initDataUnsafe: {
        user: platform.tgUser || (platform.vkUser ? {
          id: platform.vkUser.id,
          first_name: platform.vkUser.first_name,
        } : undefined),
        start_param: undefined,
      },
      colorScheme: "dark" as const,
      themeParams: {},
      showPopup: (params, callback) => {
        platform.showPopup(params).then((result) => callback?.(result));
      },
      HapticFeedback: {
        impactOccurred: (style) => platform.haptic(style),
        notificationOccurred: (type) => platform.haptic(type),
        selectionChanged: () => {},
      },
      isExpanded: true,
    };
  })();

  // Build user object from either TG or VK
  const user: TelegramUser | null = platform.tgUser || (platform.vkUser ? {
    id: platform.vkUser.id,
    first_name: platform.vkUser.first_name,
    last_name: platform.vkUser.last_name,
  } : null);

  return {
    tg: tgCompat,
    user,
    isInTelegram: platform.isInApp,
    haptic: platform.haptic,
    // Additional VK-specific info
    platform: platform.platform,
    isInVK: platform.platform === "vk",
  };
}
