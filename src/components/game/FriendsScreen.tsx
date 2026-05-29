"use client";
import { useQuizStore } from "@/lib/quiz-store";
import { useTelegram } from "@/hooks/use-telegram";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function FriendsScreen() {
  const { setPhase, friendList } = useQuizStore();
  const { haptic, share, getReferralLink } = useTelegram();
  const [searchQuery, setSearchQuery] = useState("");

  const referralLink = getReferralLink();

  const shareInvite = () => {
    haptic('light');
    share(referralLink, "Привет! Играй в КВИЗЛИК со мной! 🎯🧠");
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--theme-bg)] px-4 py-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => { haptic('light'); setPhase('home'); }}
          className="w-9 h-9 rounded-xl bg-[var(--theme-card)] border border-white/10 flex items-center justify-center hover:bg-[var(--theme-card-hover)] active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-white/70" />
        </button>
        <h2 className="text-white font-bold text-lg">👥 Друзья</h2>
      </div>

      {/* Invite Button */}
      <div className="mb-6">
        <motion.button
          onClick={shareInvite}
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold active:scale-[0.97] transition-transform"
          whileTap={{ scale: 0.97 }}
        >
          🎁 Пригласить друга (+50 монет)
        </motion.button>
        <p className="text-white/40 text-xs text-center mt-2">
          Друг получит 50 монет при регистрации!
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Поиск по имени..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-xl bg-[var(--theme-card)] text-white border border-white/10 focus:border-purple-500 outline-none"
        />
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto">
        {friendList.length === 0 ? (
          <div className="text-center text-white/40 py-8">
            <div className="text-4xl mb-3">🤝</div>
            <p>Пока нет друзей</p>
            <p className="text-sm mt-2">Пригласи друзей и играй вместе!</p>
          </div>
        ) : (
          friendList.map((friend, i) => (
            <div key={friend.telegramId || i} className="p-3 rounded-xl bg-[var(--theme-card)] flex items-center justify-between mb-2 border border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{friend.avatarId === "default" ? "🧠" : "👤"}</span>
                <span className="text-white">{friend.name}</span>
              </div>
              <button className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm">
                ⚔️ Дуэль
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
