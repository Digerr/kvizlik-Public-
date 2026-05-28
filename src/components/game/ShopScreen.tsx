'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { POWER_UPS, AVATARS, RARITY_COLORS, RARITY_NAMES } from '@/lib/quiz-data';
import { useTelegram } from '@/hooks/use-telegram';
import { ArrowLeft } from 'lucide-react';

export default function ShopScreen() {
  const { coins, powerUps, unlockedAvatars, avatarId, buyPowerUp, buyAvatar, setAvatar, setPhase } = useQuizStore();
  const { haptic } = useTelegram();
  const [tab, setTab] = useState<'bonuses' | 'avatars'>('bonuses');

  const handleBuyPowerUp = (id: string) => {
    const pu = POWER_UPS.find(p => p.id === id);
    if (!pu || coins < pu.price) {
      haptic('error');
      return;
    }
    haptic('success');
    buyPowerUp(id);
  };

  const handleBuyAvatar = (id: string) => {
    const av = AVATARS.find(a => a.id === id);
    if (!av || coins < av.price || unlockedAvatars.includes(id)) {
      haptic('error');
      return;
    }
    haptic('success');
    buyAvatar(id);
  };

  const handleEquip = (id: string) => {
    haptic('light');
    setAvatar(id);
  };

  return (
    <div className="min-h-[100dvh] bg-[#0f0a1e] px-4 py-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => { haptic('light'); setPhase('home'); }}
          className="w-9 h-9 rounded-xl bg-[#1a1235] border border-white/10 flex items-center justify-center hover:bg-[#221a45] active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-white/70" />
        </button>
        <h2 className="text-white font-bold text-lg">Магазин</h2>
        <div className="ml-auto flex items-center gap-1 bg-[#1a1235] border border-white/10 rounded-xl px-3 py-1.5">
          <span className="text-sm">🪙</span>
          <span className="text-yellow-400 font-bold text-sm">{coins}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { haptic('light'); setTab('bonuses'); }}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === 'bonuses'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
              : 'bg-[#1a1235] border border-white/10 text-white/50 hover:bg-[#221a45]'
          }`}
        >
          Бонусы
        </button>
        <button
          onClick={() => { haptic('light'); setTab('avatars'); }}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === 'avatars'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
              : 'bg-[#1a1235] border border-white/10 text-white/50 hover:bg-[#221a45]'
          }`}
        >
          Аватары
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-4" style={{ maxHeight: 'calc(100dvh - 160px)' }}>
        {tab === 'bonuses' && (
          <div className="flex flex-col gap-3">
            {POWER_UPS.map((pu, i) => {
              const count = powerUps[pu.id as keyof typeof powerUps];
              const canBuy = coins >= pu.price;
              return (
                <motion.div
                  key={pu.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[#1a1235] border border-white/10 rounded-2xl p-4 flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#251d45] flex items-center justify-center text-2xl border border-white/10">
                    {pu.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm">{pu.name}</p>
                    <p className="text-white/40 text-[10px]">{pu.description}</p>
                    <p className="text-white/50 text-xs mt-0.5">Есть: {count}</p>
                  </div>
                  <button
                    onClick={() => handleBuyPowerUp(pu.id)}
                    disabled={!canBuy}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      canBuy
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white active:scale-95'
                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                    }`}
                  >
                    🪙 {pu.price}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {tab === 'avatars' && (
          <div className="grid grid-cols-2 gap-3">
            {AVATARS.map((av, i) => {
              const owned = unlockedAvatars.includes(av.id);
              const equipped = avatarId === av.id;
              const canBuy = coins >= av.price && !owned;
              const rarityColor = RARITY_COLORS[av.rarity];
              const rarityName = RARITY_NAMES[av.rarity];

              return (
                <motion.div
                  key={av.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`bg-[#1a1235] border rounded-2xl p-3.5 flex flex-col items-center text-center ${
                    equipped ? 'border-purple-500/50' : 'border-white/10'
                  }`}
                >
                  {/* Rarity Badge */}
                  <span
                    className="text-[8px] font-bold px-1.5 py-0.5 rounded-full mb-2"
                    style={{ backgroundColor: rarityColor + '20', color: rarityColor }}
                  >
                    {rarityName}
                  </span>

                  <span className="text-3xl mb-1.5">{av.emoji}</span>
                  <p className="text-white font-bold text-xs mb-1">{av.name}</p>

                  {owned ? (
                    equipped ? (
                      <span className="text-purple-400 text-[10px] font-bold mt-1">✓ Активен</span>
                    ) : (
                      <button
                        onClick={() => handleEquip(av.id)}
                        className="mt-1 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-[10px] font-bold hover:bg-purple-500/30 active:scale-95 transition-all"
                      >
                        Надеть
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handleBuyAvatar(av.id)}
                      disabled={!canBuy}
                      className={`mt-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        canBuy
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white active:scale-95'
                          : 'bg-white/5 text-white/20 cursor-not-allowed'
                      }`}
                    >
                      🪙 {av.price}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
