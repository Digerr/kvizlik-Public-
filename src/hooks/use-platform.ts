"use client";

import { useEffect, useState } from "react";
import { useQuizStore } from "@/lib/quiz-store";

// ===== Platform types =====
export type Platform = "telegram" | "vk" | "web";

export interface VKUserInfo {
  id: number;
  first_name: string;
  last_name?: string;
  photo_100?: string;
  photo_200?: string;
}

interface PlatformAdapter {
  platform: Platform;
  userId: string | null;
  userName: string | null;
  userPhoto: string | null;
  isInApp: boolean;
  haptic: (type: "light" | "medium" | "heavy" | "success" | "error" | "warning") => void;
  share: (url: string, text: string) => void;
  shareDuel: (duelLink: string, duelText: string) => void;
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
    if (url.searchParams.has("vk_user_id") || url.searchParams.has("vk_platform")) return "vk";
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) return "telegram";
    if (window.Telegram?.WebApp?.initData) return "telegram";
  } catch { /* ignore */ }
  return "web";
}

// ===== VK Bridge helper (uses global from CDN script) =====
function sendVK(method: string, params?: Record<string, any>): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
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
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isInApp, setIsInApp] = useState(false);
  const [vkUser, setVkUser] = useState<VKUserInfo | null>(null);
  const [tgUser, setTgUser] = useState<any | null>(null);

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
      // Parse VK user ID from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const vkUserId = urlParams.get("vk_user_id");

      if (vkUserId) {
        const uid = `vk_${vkUserId}`;
        setUserId(uid);
        useQuizStore.getState().setTelegramId(uid);

        // Try to get user info with retries
        const tryGetUserInfo = async (retries: number = 3): Promise<void> => {
          for (let attempt = 0; attempt < retries; attempt++) {
            if (isVKBridgeAvailable()) {
              try {
                const userInfo = await sendVK("VKWebAppGetUserInfo", { user_id: Number(vkUserId) });
                if (userInfo) {
                  const firstName = userInfo.first_name || "Игрок";
                  const lastName = userInfo.last_name || "";
                  const fullName = lastName ? `${firstName} ${lastName}` : firstName;
                  const photo = userInfo.photo_100 || userInfo.photo_200 || null;
                  setUserName(fullName);
                  setUserPhoto(photo);
                  setVkUser({ id: Number(vkUserId), first_name: firstName, last_name: lastName, photo_100: photo, photo_200: userInfo.photo_200 || null });
                  if (!useQuizStore.getState().playerName) useQuizStore.getState().setPlayerName(fullName);
                  useQuizStore.getState().setUserPhoto(photo);
                  return;
                }
              } catch (e) {
                console.warn(`VKWebAppGetUserInfo attempt ${attempt + 1} failed:`, e);
              }
            }
            // Wait before retry
            if (attempt < retries - 1) {
              await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
            }
          }
          // Fallback
          const fallbackName = "Игрок VK";
          setUserName(fallbackName);
          if (!useQuizStore.getState().playerName) useQuizStore.getState().setPlayerName(fallbackName);
          setVkUser({ id: Number(vkUserId), first_name: fallbackName });
        };

        await tryGetUserInfo();

        // Init VK app
        if (isVKBridgeAvailable()) {
          try { await sendVK("VKWebAppInit"); } catch { }
        }
      }
    } catch (e) { console.error("VK init error:", e); }
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
          // Telegram doesn't provide photo URL via WebApp API, keep null
          setUserPhoto(null);
        }
      }
    } catch (e) {
      console.error("Telegram init error:", e);
    }
  }

  // Haptic feedback — works on both platforms
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

  // Share — generic share for referrals, results, etc.
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

  // Share duel — platform-specific: TG uses openTelegramLink, VK uses VKWebAppShare
  const shareDuel = (duelLink: string, duelText: string) => {
    try {
      if (platform === "vk" && isVKBridgeAvailable()) {
        // VK: share via VK share dialog
        sendVK("VKWebAppShare", { link: duelLink }).catch(() => {
          navigator.clipboard?.writeText(duelText + "\n" + duelLink);
        });
      } else if (platform === "telegram" && window.Telegram?.WebApp) {
        // Telegram: open share dialog with pre-filled text
        window.Telegram.WebApp.openTelegramLink(
          `https://t.me/share/url?url=${encodeURIComponent(duelLink)}&text=${encodeURIComponent(duelText)}`
        );
      } else {
        navigator.clipboard?.writeText(duelText + "\n" + duelLink);
      }
    } catch {
      navigator.clipboard?.writeText(duelText + "\n" + duelLink);
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

  // Get referral link for current platform
  const getReferralLink = () => {
    const tid = useQuizStore.getState().telegramId;
    if (platform === "vk") {
      return tid ? `https://vk.com/app54615586?vk_ref=ref_${tid}` : "https://vk.com/app54615586";
    }
    return tid ? `https://t.me/kvizlik_bot/kvizlik?startapp=ref_${tid}` : "https://t.me/kvizlik_bot/kvizlik";
  };

  const adapter: PlatformAdapter = {
    platform,
    userId,
    userName,
    userPhoto,
    isInApp,
    haptic,
    share,
    shareDuel,
    showPopup,
    openLink,
    ready,
    expand,
  };

  return { ...adapter, vkUser, tgUser, getReferralLink };
}
