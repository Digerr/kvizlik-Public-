"use client";
import { useQuizStore } from "@/lib/quiz-store";
import { getActiveEvents, SPECIAL_EVENTS } from "@/lib/quiz-data";
import { motion } from "framer-motion";

export default function EventScreen() {
  const { setPhase } = useQuizStore();
  const activeEvents = getActiveEvents();
  const now = new Date();
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;

  return (
    <div className="p-4 min-h-[100dvh] bg-[var(--theme-bg)]">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setPhase("home")} className="text-white/60 text-sm">← Назад</button>
        <h2 className="text-xl font-bold text-white">🎯 Ивенты</h2>
        <div />
      </div>

      <div className="space-y-4">
        {activeEvents.length === 0 ? (
          <div className="text-center text-white/40 py-12">
            <div className="text-4xl mb-3">📅</div>
            <p>Сейчас нет активных ивентов</p>
            <p className="text-sm mt-2">Следующий ивент скоро!</p>
          </div>
        ) : (
          activeEvents.map((event) => (
            <motion.div
              key={event.id}
              className="p-5 rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{event.emoji}</span>
                <div>
                  <div className="text-white font-bold text-lg">{event.name}</div>
                  <div className="text-white/60 text-sm">{event.description}</div>
                </div>
              </div>
              <div className="mt-3 px-3 py-1.5 bg-yellow-500/20 rounded-lg text-yellow-400 text-sm font-bold inline-block">
                x{event.bonusMultiplier} бонус активен!
              </div>
            </motion.div>
          ))
        )}

        <div className="mt-8 p-4 rounded-xl bg-[var(--theme-card)]">
          <div className="text-white/80 font-bold mb-2">📋 Расписание</div>
          <div className="text-white/50 text-sm space-y-1">
            <p>💰 <strong>Двойные монеты</strong> — каждые выходные (сб-вс)</p>
            <p>🔬 <strong>Неделя науки</strong> — двойной XP за категорию Наука</p>
            <p>🎯 <strong>Марафон</strong> — скоро!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
