'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/game-store';
import { ArrowLeft, Eye, Users, MessageCircle, Vote, MapPin } from 'lucide-react';

const RULES = [
  {
    icon: <Users className="w-6 h-6 text-red-400" />,
    title: 'Соберите игроков',
    desc: 'От 4 до 8 человек. Все играют на одном устройстве, передавая его по кругу.',
  },
  {
    icon: <Eye className="w-6 h-6 text-red-400" />,
    title: 'Узнайте роль',
    desc: 'Каждый игрок тайно узнаёт свою роль. Все знают локацию, кроме одного — Шпиона.',
  },
  {
    icon: <MessageCircle className="w-6 h-6 text-red-400" />,
    title: 'Задавайте вопросы',
    desc: 'По очереди задавайте друг другу вопросы о локации. Шпион пытается не выдать себя.',
  },
  {
    icon: <Vote className="w-6 h-6 text-red-400" />,
    title: 'Голосуйте',
    desc: 'Когда время выйдет, голосуйте — кто шпион? Шпион может угадать локацию.',
  },
  {
    icon: <MapPin className="w-6 h-6 text-red-400" />,
    title: 'Определите локацию',
    desc: 'Если шпион пойман, он получает шанс угадать локацию и заработать очко.',
  },
];

export default function RulesScreen() {
  const { setPhase } = useGameStore();

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-black via-[#0a0014] to-black px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setPhase('home')}
          className="text-white/50 hover:text-white/80 transition-colors flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>
        <h2 className="text-white font-bold text-lg">Как играть</h2>
        <div className="w-12" />
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-white text-2xl font-black mb-2">Шпион</h1>
        <p className="text-white/40 text-sm">
          Социальная игра на дедукцию и блеф
        </p>
      </motion.div>

      {/* Rules */}
      <div className="flex flex-col gap-4">
        {RULES.map((rule, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/5 rounded-2xl p-5"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                {rule.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-base mb-1">
                  {rule.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scoring */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 bg-gradient-to-br from-amber-900/10 to-transparent border border-amber-500/10 rounded-2xl p-5"
      >
        <h3 className="text-amber-400 font-bold text-sm mb-3">Начисление очков</h3>
        <div className="flex flex-col gap-2 text-sm text-white/50">
          <p>• Шпион не пойман: <span className="text-red-400">+2 очка</span> шпиону</p>
          <p>• Шпион пойман, но угадал локацию: <span className="text-red-400">+1 очко</span> шпиону</p>
          <p>• Шпион пойман и не угадал: <span className="text-emerald-400">+1 очко</span> каждому мирному</p>
        </div>
      </motion.div>

      {/* Start button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={() => setPhase('setup')}
        className="w-full mt-8 py-4 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all active:scale-95"
      >
        Играть
      </motion.button>
    </div>
  );
}
