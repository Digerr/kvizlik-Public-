"use client";

import { useEffect, useState, useCallback } from "react";
import { useQuizStore } from "@/lib/quiz-store";

// ===== VK Bridge (lazy-loaded) =====
let vkBridge: any = null;

async function getVKBridge() {
  if (vkBridge) return vkBridge;
  try {
    const mod = await import("@vkontakte/vk-bridge");
    vkBridge = mod.default;
    return vkBridge;
  } catch {
    return null;
  }
}

// ===== Platform types =====
export type Platform = "telegram" | "vk" | "web";

interface PlatformAdapter {
  platform: Platform;
  userId: string | null;
  userName: string | null;
  isInApp: boolean;
  haptic: (type: "light" | "medium" | "heavy" | "success" | "error" | "warning") => void;
  share: (url: string, text: string) => Promise<void>;
  showPopup: (params: { title?: string; message: string; buttons?: any[] }) => Promise<string>;
  openLink: (url: string) => void;
  ready: () => void;
  expand: () => void;
}

// ===== VK User type =====
interface VKUser {
  id: number;
  first_name: string;
  last_name?: string;
  screen_name?: string;
  photo_100?: string;
}

// ===== Detect platform =====
export function detectPlatform(): Platform {
  if (typeof window === "undefined") return "web";
  const url = new URL(window.location.href);
  // VK passes vk_user_id in URL params
  if (url.searchParams.has("vk_user_id") || url.searchParams.has("vk_platform")) return "vk";
  // Telegram has window.Telegram.WebApp
  if (window.Telegram?.WebApp?.initDataUnsafe) return "telegram";
  return "web";
}

// ===== VK Adapter =====
function createVKAdapter(): PlatformAdapter {
  let vkUser: VKUser | null = null;

  return {
    platform: "vk",
    userId: null,
    userName: null,
    isInApp: true,

    haptic: async (type) => {
      const bridge = await getVKBridge();
      if (!bridge) return;
      try {
        if (type === "success" || type === "warning" || type === "error") {
          bridge.send("VKWebAppTapticNotificationOccurred", { type });
        } else {
          const style = type === "light" ? "light" : type === "medium" ? "medium" : "heavy";
          bridge.send("VKWebAppTapticImpactOccurred", { style });
        }
      } catch { /* ignore */ }
    },

    share: async (url, text) => {
      const bridge = await getVKBridge();
      if (!bridge) { window.open(url, "_blank"); return; }
      try {
        await bridge.send("VKWebAppShare", { link: url });
      } catch { window.open(url, "_blank"); }
    },

    showPopup: async (params) => {
      const bridge = await getVKBridge();
      if (!bridge) {
        // Fallback to browser confirm
        const ok = confirm(params.message);
        return ok ? "ok" : "cancel";
      }
      try {
        const result = await bridge.send("VKWebAppShowMessageBox", {
          title: params.title || "",
          message: params.message,
          buttons: params.buttons?.map((b: any) => ({
            type: b.type === "ok" ? "ok" : b.type === "cancel" ? "cancel" : "default",
            title: b.text || "OK",
          })) || [{ type: "ok", title: "OK" }],
        });
        return result.result ? "ok" : "cancel";
      } catch {
        return "cancel";
      }
    },

    openLink: (url) => {
      window.open(url, "_blank");
    },

    ready: async () => {
      const bridge = await getVKBridge();
      if (bridge) bridge.send("VKWebAppInit");
    },

    expand: async () => {
      const bridge = await getVKBridge();
      if (bridge) {
        try { bridge.send("VKWebAppResizeWindow", { width: 350, height: 800 }); } catch { /* ignore */ }
      }
    },
  };
}

// ===== Telegram Adapter =====
function createTelegramAdapter(): PlatformAdapter {
  const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : null;
  const tgUser = tg?.initDataUnsafe?.user || null;

  return {
    platform: "telegram",
    userId: tgUser ? String(tgUser.id) : null,
    userName: tgUser?.first_name || null,
    isInApp: !!tg,

    haptic: (type) => {
      if (!tg) return;
      if (type === "success" || type === "error" || type === "warning") {
        tg.HapticFeedback.notificationOccurred(type);
      } else {
        tg.HapticFeedback.impactOccurred(type);
      }
    },

    share: async (url, text) => {
      if (tg) {
        tg.openTelegramLink(url);
      } else {
        window.open(url, "_blank");
      }
    },

    showPopup: async (params) => {
      if (tg) {
        return new Promise<string>((resolve) => {
          tg!.showPopup({
            title: params.title,
            message: params.message,
            buttons: params.buttons,
          }, (buttonId: string) => resolve(buttonId || "ok"));
        });
      }
      const ok = confirm(params.message);
      return ok ? "ok" : "cancel";
    },

    openLink: (url) => {
      if (tg) {
        tg.openTelegramLink(url);
      } else {
        window.open(url, "_blank");
      }
    },

    ready: () => {
      tg?.ready();
    },

    expand: () => {
      tg?.expand();
    },
  };
}

// ===== Web Adapter (fallback) =====
function createWebAdapter(): PlatformAdapter {
  return {
    platform: "web",
    userId: null,
    userName: null,
    isInApp: false,

    haptic: () => {},
    share: async (url) => { window.open(url, "_blank"); },
    showPopup: async (params) => { const ok = confirm(params.message); return ok ? "ok" : "cancel"; },
    openLink: (url) => { window.open(url, "_blank"); },
    ready: () => {},
    expand: () => {},
  };
}

// ===== Main hook =====
export function usePlatform(): PlatformAdapter & {
  vkUser: VKUser | null;
  tgUser: any | null;
} {
  const [adapter, setAdapter] = useState<PlatformAdapter>(createWebAdapter());
  const [vkUser, setVkUser] = useState<VKUser | null>(null);
  const [tgUser, setTgUser] = useState<any | null>(null);
  const { setTelegramId, setPlayerName, playerName } = useQuizStore();

  useEffect(() => {
    const platform = detectPlatform();

    if (platform === "vk") {
      const vkAdapter = createVKAdapter();

      // Get VK user info
      (async () => {
        const bridge = await getVKBridge();
        if (bridge) {
          try {
            bridge.send("VKWebAppInit");

            // Parse VK user from URL params (VK sends them in the URL)
            const urlParams = new URLSearchParams(window.location.search);
            const vkUserId = urlParams.get("vk_user_id");
            const vkUserName = urlParams.get("vk_user_name");

            if (vkUserId) {
              vkAdapter.userId = `vk_${vkUserId}`;
              useQuizStore.getState().setTelegramId(`vk_${vkUserId}`);

              if (!playerName && vkUserName) {
                useQuizStore.getState().setPlayerName(decodeURIComponent(vkUserName));
              } else if (!playerName) {
                useQuizStore.getState().setPlayerName("Игрок VK");
              }

              setVkUser({
                id: Number(vkUserId),
                first_name: vkUserName ? decodeURIComponent(vkUserName) : "Игрок VK",
              });
            }

            // Try to get more user info via VK Bridge
            try {
              const userInfo = await bridge.send("VKWebAppGetUserInfo");
              if (userInfo) {
                vkAdapter.userId = `vk_${userInfo.id}`;
                vkAdapter.userName = userInfo.first_name;
                useQuizStore.getState().setTelegramId(`vk_${userInfo.id}`);
                if (!playerName) {
                  useQuizStore.getState().setPlayerName(userInfo.first_name);
                }
                setVkUser(userInfo);
              }
            } catch { /* VK Bridge GetUserInfo not available */ }

          } catch (e) {
            console.error("VK Bridge init failed:", e);
          }
        }

        setAdapter(vkAdapter);
      })();
    } else if (platform === "telegram") {
      const tgAdapter = createTelegramAdapter();
      const webApp = window.Telegram?.WebApp;

      if (webApp) {
        webApp.ready();
        webApp.expand();

        const user = webApp.initDataUnsafe?.user;
        if (user) {
          setTgUser(user);
          useQuizStore.getState().setTelegramId(String(user.id));
          if (!playerName && user.first_name) {
            useQuizStore.getState().setPlayerName(user.first_name);
          }
        }
      }

      setAdapter(tgAdapter);
    } else {
      setAdapter(createWebAdapter());
    }
  }, []);

  return { ...adapter, vkUser, tgUser };
}
