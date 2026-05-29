"use client";

import { useEffect, useState } from "react";
import { useQuizStore } from "@/lib/quiz-store";

// ===== Platform types =====
export type Platform = "telegram" | "vk" | "web";

interface PlatformAdapter {
  platform: Platform;
  userId: string | null;
  userName: string | null;
  isInApp: boolean;
  haptic: (type: "light" | "medium" | "heavy" | "success" | "error" | "warning") => void;
  share: (url: string, text: string) => void;
  showPopup: (params: { title?: string; message: string; buttons?: any[] }) => void;
  openLink: (url: string) => void;
  ready: () => void;
  expand: () => void;
}

// ===== Detect platform =====
export function detectPlatform(): Platform {
  if (typeof window === "undefined") return "web";
  try {
    const url = new URL(window.location.href);
    // VK passes vk_user_id or vk_platform in URL params
    if (url.searchParams.has("vk_user_id") || url.searchParams.has("vk_platform")) return "vk";
    // Telegram has window.Telegram.WebApp with initData
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) return "telegram";
    // Also check for Telegram initData (even without user, it's TG)
    if (window.Telegram?.WebApp?.initData) return "telegram";
  } catch { /* ignore */ }
  return "web";
}

// ===== VK Bridge helper (uses global from CDN script) =====
function sendVK(method: string, params?: Record<string, any>): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      // Use the global vkBridge object from the CDN script
      const bridge = (window as any).vkBridge || (window as any).VKBridge;
      if (bridge && typeof bridge.send === 'function') {
        bridge.send(method, params).then(resolve).catch(reject);
      } else {
        reject(new Error('VK Bridge not available'));
      }
    } catch (e) {
      reject(e);
    }
  });
}

function isVKBridgeAvailable(): boolean {
  try {
    const bridge = (window as any).vkBridge || (window as any).VKBridge;
    return bridge && typeof bridge.send === 'function';
  } catch {
    return false;
  }
}

// ===== Main hook =====
export function usePlatform() {
  const [platform, setPlatform] = useState<Platform>("web");
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isInApp, setIsInApp] = useState(false);
  const [vkUser, setVkUser] = useState<{ id: number; first_name: string; last_name?: string } | null>(null);
  const [tgUser, setTgUser] = useState<any | null>(null);
  const { setTelegramId, setPlayerName, playerName } = useQuizStore();

  useEffect(() => {
    const detected = detectPlatform();
    setPlatform(detected);

    if (detected === "vk") {
      setIsInApp(true);
      initVK();
    } else if (detected === "telegram") {
      setIsInApp(true);
      initTelegram();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function initVK() {
    try {
      // Parse VK user from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const vkUserId = urlParams.get("vk_user_id");
      const vkUserName = urlParams.get("vk_user_name");

      if (vkUserId) {
        const uid = `vk_${vkUserId}`;
        setUserId(uid);
        useQuizStore.getState().setTelegramId(uid);

        const name = vkUserName ? decodeURIComponent(vkUserName) : "Игрок VK";
        setUserName(name);
        if (!useQuizStore.getState().playerName) {
          useQuizStore.getState().setPlayerName(name);
        }
        setVkUser({ id: Number(vkUserId), first_name: name });
      }

      // Initialize VK Bridge (from CDN)
      if (isVKBridgeAvailable()) {
        try {
          await sendVK("VKWebAppInit");
        } catch { /* VK init failed, continue anyway */ }
      }
    } catch (e) {
      console.error("VK init error:", e);
    }
  }

  function initTelegram() {
    try {
      const webApp = window.Telegram?.WebApp;
      if (webApp) {
        webApp.ready();
        webApp.expand();

        const user = webApp.initDataUnsafe?.user;
        if (user) {
          setTgUser(user);
          const tid = String(user.id);
          setUserId(tid);
          useQuizStore.getState().setTelegramId(tid);
          if (!useQuizStore.getState().playerName && user.first_name) {
            useQuizStore.getState().setPlayerName(user.first_name);
          }
          setUserName(user.first_name);
        }
      }
    } catch (e) {
      console.error("Telegram init error:", e);
    }
  }

  // Haptic feedback
  const haptic = (type: "light" | "medium" | "heavy" | "success" | "error" | "warning") => {
    try {
      if (platform === "vk" && isVKBridgeAvailable()) {
        if (type === "success" || type === "warning" || type === "error") {
          sendVK("VKWebAppTapticNotificationOccurred", { type }).catch(() => {});
        } else {
          sendVK("VKWebAppTapticImpactOccurred", { style: type }).catch(() => {});
        }
      } else if (platform === "telegram" && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        if (type === "success" || type === "error" || type === "warning") {
          tg.HapticFeedback.notificationOccurred(type);
        } else {
          tg.HapticFeedback.impactOccurred(type);
        }
      }
    } catch { /* ignore */ }
  };

  // Share
  const share = (url: string, text: string) => {
    try {
      if (platform === "vk" && isVKBridgeAvailable()) {
        sendVK("VKWebAppShare", { link: url }).catch(() => {
          navigator.clipboard?.writeText(text + "\n" + url);
        });
      } else if (platform === "telegram" && window.Telegram?.WebApp) {
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        window.Telegram.WebApp.openTelegramLink(shareUrl);
      } else {
        navigator.clipboard?.writeText(text + "\n" + url);
      }
    } catch {
      navigator.clipboard?.writeText(text + "\n" + url);
    }
  };

  // Show popup
  const showPopup = (params: { title?: string; message: string; buttons?: any[] }) => {
    try {
      if (platform === "vk" && isVKBridgeAvailable()) {
        sendVK("VKWebAppShowMessageBox", {
          title: params.title || "",
          message: params.message,
          buttons: params.buttons?.map((b: any) => ({
            type: b.type === "ok" ? "ok" : b.type === "cancel" ? "cancel" : "default",
            title: b.text || "OK",
          })) || [{ type: "ok", title: "OK" }],
        }).catch(() => {
          alert(params.message);
        });
      } else if (platform === "telegram" && window.Telegram?.WebApp) {
        window.Telegram.WebApp.showPopup(params);
      } else {
        alert(params.message);
      }
    } catch {
      alert(params.message);
    }
  };

  // Open link
  const openLink = (url: string) => {
    try {
      if (platform === "telegram" && window.Telegram?.WebApp) {
        window.Telegram.WebApp.openTelegramLink(url);
      } else {
        window.open(url, "_blank");
      }
    } catch {
      window.open(url, "_blank");
    }
  };

  // Ready
  const ready = () => {
    if (platform === "telegram" && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
    } else if (platform === "vk" && isVKBridgeAvailable()) {
      sendVK("VKWebAppInit").catch(() => {});
    }
  };

  // Expand
  const expand = () => {
    if (platform === "telegram" && window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
    }
  };

  const adapter: PlatformAdapter = {
    platform,
    userId,
    userName,
    isInApp,
    haptic,
    share,
    showPopup,
    openLink,
    ready,
    expand,
  };

  return { ...adapter, vkUser, tgUser };
}
