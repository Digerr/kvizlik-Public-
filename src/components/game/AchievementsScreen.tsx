"use client";
import { Check, LockKeyhole } from "lucide-react";
import { useQuizStore } from "@/lib/quiz-store";
import { ACHIEVEMENTS } from "@/lib/quiz-data";
import { ScreenHeading } from "./QuizUI";
export default function AchievementsScreen() {
  const s = useQuizStore();
  return (
    <div className="q-screen">
      <ScreenHeading
        title="Маленькие большие победы"
        eyebrow={`Достижения · ${s.unlockedAchievements.length} / ${ACHIEVEMENTS.length}`}
      />
      <p className="q-intro">
        Открываются во время игры. Бонусные монеты начисляются автоматически.
      </p>
      <div className="q-collection">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = s.unlockedAchievements.some((u) => u.id === a.id);
          return (
            <article key={a.id} className={unlocked ? "unlocked" : ""}>
              <span className="q-shortcut-icon">{a.emoji}</span>
              <div>
                <h2>{a.name}</h2>
                <p>{a.description}</p>
                <small>+{a.reward} монет</small>
              </div>
              {unlocked ? <Check size={18} /> : <LockKeyhole size={16} />}
            </article>
          );
        })}
      </div>
    </div>
  );
}
