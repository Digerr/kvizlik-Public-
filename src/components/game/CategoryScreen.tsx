"use client";
import { useState } from "react";
import { ArrowRight, Search, Shuffle } from "lucide-react";
import { useQuizStore } from "@/lib/quiz-store";
import {
  CATEGORIES,
  QUESTIONS,
  getQuestionsByDifficulty,
} from "@/lib/quiz-data";
import { ScreenHeading } from "./QuizUI";
export default function CategoryScreen() {
  const s = useQuizStore();
  const [query, setQuery] = useState("");
  const cats = CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );
  const play = (id: string | null) =>
    s.startGame(
      id,
      getQuestionsByDifficulty(id, s.difficulty, 10, s.seenQuestions),
    );
  return (
    <div className="q-screen">
      <ScreenHeading
        title="Что тебе интересно?"
        eyebrow="12 тем · новые открытия"
      />
      <p className="q-intro">
        Выбери тему и сложность. Остальное — любопытству.
      </p>
      <div className="q-segments" aria-label="Сложность">
        {(["Разминка", "Посложнее", "Вызов"] as const).map((t, i) => (
          <button
            key={t}
            aria-pressed={s.difficulty === i + 1}
            className={s.difficulty === i + 1 ? "active" : ""}
            onClick={() => s.setDifficulty((i + 1) as 1 | 2 | 3)}
          >
            {t}
          </button>
        ))}
      </div>
      <button className="q-mix" onClick={() => play(null)}>
        <Shuffle size={26} />
        <span>
          <strong>Немного обо всём</strong>
          <small>Микс из разных тем</small>
        </span>
        <ArrowRight size={21} />
      </button>
      <label className="q-search">
        <Search size={18} />
        <input
          aria-label="Найти тему"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Найти свою тему"
        />
      </label>
      <div className="q-topic-grid">
        {cats.map((c, i) => (
          <button
            key={c.id}
            className="q-topic-card"
            onClick={() => play(c.id)}
          >
            <div>
              <span className="q-topic-emoji">{c.emoji}</span>
              <span className="q-topic-number">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <strong>{c.name}</strong>
            <p>{c.description}</p>
            <span className="q-topic-bottom">
              {QUESTIONS.filter((q) => q.category === c.id).length} вопросов{" "}
              <ArrowRight size={16} />
            </span>
          </button>
        ))}
      </div>
      {!cats.length && (
        <p className="q-empty">Такой темы пока нет. Попробуй другое слово.</p>
      )}
    </div>
  );
}
