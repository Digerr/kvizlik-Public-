"use client";
import {
  ArrowLeft,
  ArrowUpRight,
  Brain,
  Home,
  Layers3,
  Trophy,
  UserRound,
} from "lucide-react";
import { useQuizStore, type QuizPhase } from "@/lib/quiz-store";
import type { ReactNode } from "react";
export function ScreenHeading({
  title,
  eyebrow,
  back = "home",
  action,
}: {
  title: string;
  eyebrow?: string;
  back?: QuizPhase;
  action?: ReactNode;
}) {
  const setPhase = useQuizStore((s) => s.setPhase);
  return (
    <header className="q-heading">
      <button
        className="q-icon-button"
        aria-label="Назад"
        onClick={() => setPhase(back)}
      >
        <ArrowLeft size={20} />
      </button>
      <div>
        <span className="q-eyebrow">{eyebrow || "Квизлик"}</span>
        <h1>{title}</h1>
      </div>
      {action}
    </header>
  );
}
export function QuizMark({ small = false }: { small?: boolean }) {
  return (
    <div className={`q-mark ${small ? "q-mark-small" : ""}`}>
      <Brain size={small ? 21 : 30} />
    </div>
  );
}
export function OrbitArt() {
  return (
    <svg
      className="q-orbit"
      viewBox="0 0 210 210"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="105"
        cy="105"
        r="77"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <ellipse
        cx="105"
        cy="105"
        rx="94"
        ry="34"
        transform="rotate(-35 105 105)"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <ellipse
        cx="105"
        cy="105"
        rx="34"
        ry="94"
        transform="rotate(-35 105 105)"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M105 49v112M49 105h112"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="105" cy="105" r="24" fill="currentColor" />
      <path
        d="m98 103 5 5 10-12"
        stroke="#d7f75b"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="167" cy="58" r="8" fill="currentColor" />
      <circle cx="30" cy="132" r="5" fill="currentColor" />
    </svg>
  );
}
export function Shortcut({
  icon,
  title,
  detail,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button className="q-shortcut" onClick={onClick}>
      <span className="q-shortcut-icon">{icon}</span>
      <span>
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
      <ArrowUpRight size={18} />
    </button>
  );
}
export function BottomNav() {
  const { phase, setPhase } = useQuizStore();
  const items = [
    { id: "home", label: "Главная", icon: Home },
    { id: "category", label: "Темы", icon: Layers3 },
    { id: "leaderboard", label: "Рейтинг", icon: Trophy },
    { id: "profile", label: "Ты", icon: UserRound },
  ] as const;
  return (
    <nav className="q-nav" aria-label="Основная навигация">
      {items.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          aria-current={phase === id ? "page" : undefined}
          className={phase === id ? "active" : ""}
          onClick={() => setPhase(id)}
        >
          <Icon size={21} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
