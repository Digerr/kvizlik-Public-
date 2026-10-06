"use client";
import { Gift } from "lucide-react";
import { useQuizStore } from "@/lib/quiz-store";
import { AVATARS, CHEST_TYPES } from "@/lib/quiz-data";
import { ScreenHeading } from "./QuizUI";
export default function ChestScreen() {
  const s = useQuizStore();
  const chest = s.pendingChest;
  const avatar = AVATARS.find((a) => a.id === chest?.rewards.avatarId);
  return (
    <div className="q-screen">
      <ScreenHeading title="Твой бонус" back="daily" />
      <section className="q-result-hero">
        <Gift size={48} />
        <h1>
          {CHEST_TYPES.find((c) => c.id === chest?.type)?.name ||
            "Бонус получен"}
        </h1>
        <p>
          {chest
            ? `Ещё ${chest.rewards.coins} монет в копилку.`
            : "Награда уже в твоём профиле."}
        </p>
        {avatar && (
          <p>
            {avatar.emoji} Новый аватар: {avatar.name}
          </p>
        )}
      </section>
      <button
        className="q-primary"
        onClick={() => {
          s.openChest();
          s.setPhase("daily");
        }}
      >
        {chest ? "Забрать награду" : "К заданиям"}
      </button>
    </div>
  );
}
