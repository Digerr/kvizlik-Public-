"use client";
import { useQuizStore } from "@/lib/quiz-store";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ClanScreen() {
  const { setPhase, clanId, clanName, playerName } = useQuizStore();
  const [clanInput, setClanInput] = useState("");

  const isInClan = !!clanId;

  return (
    <div className="p-4 min-h-[100dvh] bg-[var(--theme-bg)]">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setPhase("home")} className="text-white/60 text-sm">← Назад</button>
        <h2 className="text-xl font-bold text-white">🏠 Кланы</h2>
        <div />
      </div>

      {isInClan ? (
        <div>
          <div className="p-5 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 mb-6">
            <div className="text-3xl mb-2">🏰</div>
            <div className="text-white font-bold text-xl">{clanName}</div>
            <div className="text-white/60 text-sm mt-1">10/10 участников</div>
          </div>
          <div className="space-y-3">
            <div className="text-white/80 font-bold">Участники</div>
            {[1,2,3,4,5].map(i => (
              <div key={i} className="p-3 rounded-xl bg-[var(--theme-card)] flex items-center gap-3">
                <span className="text-xl">👤</span>
                <span className="text-white">Игрок {i}</span>
                <span className="text-white/40 text-sm ml-auto">{1000 - i * 100} очков</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="text-center text-white/40 py-6 mb-6">
            <div className="text-5xl mb-3">🏰</div>
            <p>Создай или вступи в клан!</p>
            <p className="text-sm mt-1">До 10 игроков, командный рейтинг и награды</p>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Название клана..."
                value={clanInput}
                onChange={(e) => setClanInput(e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--theme-card)] text-white border border-white/10 focus:border-purple-500 outline-none"
              />
            </div>
            <motion.button
              className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold"
              whileTap={{ scale: 0.97 }}
            >
              🏰 Создать клан (500 монет)
            </motion.button>
          </div>

          <div className="mt-8">
            <div className="text-white/80 font-bold mb-3">Открытые кланы</div>
            {["Квиз Мастера", "Знатоки", "Эрудиты"].map(name => (
              <div key={name} className="p-3 rounded-xl bg-[var(--theme-card)] flex items-center justify-between mb-2">
                <span className="text-white">{name}</span>
                <button className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm">
                  Вступить
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
