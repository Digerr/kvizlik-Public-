"use client";
import { Check } from "lucide-react";
import { useQuizStore } from "@/lib/quiz-store";
import { ScreenHeading } from "./QuizUI";
const themes = [
  { id: "light_theme", name: "Бумага", bg: "#f4f3ec", card: "#ffffff" },
  { id: "neon", name: "Графит", bg: "#202420", card: "#2d332c" },
];
export default function ThemesScreen() {
  const s = useQuizStore();
  return (
    <div className="q-screen">
      <ScreenHeading title="Свет или тень?" eyebrow="Оформление" />
      <p className="q-intro">
        Две темы, один кругозор. Выбирай, как тебе удобнее.
      </p>
      <div className="q-theme-grid">
        {themes.map((t) => {
          const selected =
            t.id === "light_theme"
              ? s.currentTheme === t.id
              : s.currentTheme !== "light_theme";
          return (
            <button
              key={t.id}
              onClick={() => s.setTheme(t.id)}
              className={selected ? "selected" : ""}
            >
              <div className="q-theme-sample" style={{ background: t.bg }}>
                <span style={{ background: "#d7f75b" }} />
                <span style={{ background: t.card }} />
              </div>
              <div>
                <strong>{t.name}</strong>
                {selected && <Check size={18} />}
              </div>
              <small>{selected ? "Выбрана" : "Нажми, чтобы применить"}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}
