"use client";
import { useQuizStore } from "@/lib/quiz-store";
import { motion } from "framer-motion";
import { useState } from "react";

export default function FriendsScreen() {
  const { setPhase, friendList, telegramId } = useQuizStore();
  const [searchQuery, setSearchQuery] = useState("");

  const referralLink = telegramId 
    ? `https://t.me/kvizlik_bot/kvizlik?startapp=ref_${telegramId}`
    : "";

  const shareInvite = () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("Привет! Играй в КВИЗЛИК со мной! 🎯")}`
      );
    }
  };

  return (
    <div className="p-4 min-h-[100dvh] bg-[var(--theme-bg)]">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setPhase("home")} className="text-white/60 text-sm">← Назад</button>
        <h2 className="text-xl font-bold text-white">👥 Друзья</h2>
        <div />
      </div>

      <div className="mb-6">
        <motion.button
          onClick={shareInvite}
          className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold"
          whileTap={{ scale: 0.97 }}
        >
          🎁 Пригласить друга (+200 монет)
        </motion.button>
        <p className="text-white/40 text-xs text-center mt-2">
          Друг получит 100 монет при регистрации!
        </p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Поиск по имени..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-xl bg-[var(--theme-card)] text-white border border-white/10 focus:border-blue-500 outline-none"
        />
      </div>

      <div className="space-y-3">
        {friendList.length === 0 ? (
          <div className="text-center text-white/40 py-8">
            <div className="text-4xl mb-3">🤝</div>
            <p>Пока нет друзей</p>
            <p className="text-sm mt-2">Пригласи друзей и играй вместе!</p>
          </div>
        ) : (
          friendList.map((friend) => (
            <div key={friend.telegramId} className="p-3 rounded-xl bg-[var(--theme-card)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{friend.avatarId === "default" ? "🧠" : "👤"}</span>
                <span className="text-white">{friend.name}</span>
              </div>
              <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                ⚔️ Дуэль
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
