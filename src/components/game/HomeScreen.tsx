"use client";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Flame,
  Swords,
  Volume2,
  VolumeX,
  Zap,
  Trophy,
  Check,
} from "lucide-react";
import { useQuizStore } from "@/lib/quiz-store";
import {
  CATEGORIES,
  getMixedQuestions,
  LEAGUES,
  QUESTIONS,
} from "@/lib/quiz-data";
import { isMuted, toggleMute } from "@/lib/sounds";
import { OrbitArt, QuizMark, Shortcut } from "./QuizUI";
export default function HomeScreen() {
  const s = useQuizStore();
  const [muted, setMuted] = useState(isMuted);
  useEffect(() => {
    s.checkDailyReset();
    s.refreshDailyTasks();
    s.checkSeason();
  }, []);
  const league = LEAGUES.find((l) => l.id === s.currentLeague) || LEAGUES[0];
  const completed = s.dailyTasks.filter((t) => t.progress >= t.target).length;
  const quick = () => s.startGame(null, getMixedQuestions(10, s.seenQuestions));
  return (
    <div className="q-screen q-home">
      <header className="q-brand-row">
        <div className="q-brand">
          <QuizMark small />
          <strong>
            квизлик<span>Игра для любопытных</span>
          </strong>
        </div>
        <button
          className="q-icon-button"
          aria-label={muted ? "Включить звук" : "Выключить звук"}
          onClick={() => setMuted(toggleMute())}
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </header>
      <div className="q-welcome">
        <span className="q-eyebrow">
          {s.playerName
            ? `Привет, ${s.playerName.split(" ")[0]}`
            : "Заглянем за пределы привычного?"}
        </span>
        <div className="q-streak">
          <Flame size={15} />
          {s.dailyStreak} дн.
        </div>
      </div>
      <section className="q-hero">
        <div className="q-hero-top">
          <span className="q-pill">БЫСТРЫЙ РАУНД</span>
          <span className="q-hero-index">01 / PLAY</span>
        </div>
        <h1>
          А ты точно
          <br />
          это знаешь<span>?</span>
        </h1>
        <p>
          10 вопросов. Неожиданные факты.
          <br />
          Пара минут для твоего любопытства.
        </p>
        <OrbitArt />
        <button className="q-primary" onClick={quick}>
          Проверим <ArrowRight size={22} />
        </button>
        <div className="q-hero-footer">
          <span>Все темы вперемешку</span>
          <span>15 сек / вопрос</span>
        </div>
      </section>
      <div className="q-section-label">
        <h2>Другой темп</h2>
        <span>Выбирай свой</span>
      </div>
      <div className="q-modes">
        <Shortcut
          icon={<Swords size={23} />}
          title="Вызови друга"
          detail="Одинаковые вопросы. Кто лучше?"
          onClick={() => s.setPhase("duel")}
        />
        <Shortcut
          icon={<Zap size={23} />}
          title="До первой ошибки"
          detail={`Выживание · рекорд ${s.survivalRecord}`}
          onClick={() =>
            s.startGame(
              null,
              getMixedQuestions(10, s.seenQuestions),
              false,
              "survival",
            )
          }
        />
      </div>
      <div className="q-section-label">
        <h2>На твоём счету</h2>
        <button onClick={() => s.setPhase("profile")}>
          Весь прогресс <ArrowRight size={14} />
        </button>
      </div>
      <div className="q-stats-row">
        <div>
          <Trophy size={18} />
          <strong>{s.totalScore.toLocaleString("ru-RU")}</strong>
          <span>очков · {league.name}</span>
        </div>
        <div>
          <strong>{s.gamesPlayed}</strong>
          <span>раундов сыграно</span>
        </div>
        <div>
          <strong>
            {s.totalQuestions
              ? Math.round((s.totalCorrect / s.totalQuestions) * 100)
              : "—"}
            {s.totalQuestions ? "%" : ""}
          </strong>
          <span>точность</span>
        </div>
      </div>
      <button className="q-daily-strip" onClick={() => s.setPhase("daily")}>
        <span className="q-daily-icon">
          <Check size={21} />
        </span>
        <span>
          <strong>Маленькая цель на сегодня</strong>
          <small>
            {completed} из {s.dailyTasks.length} заданий выполнено
          </small>
        </span>
        <ArrowRight size={20} />
      </button>
      <div className="q-section-label">
        <h2>Есть любимая тема?</h2>
        <button onClick={() => s.setPhase("category")}>
          Все {CATEGORIES.length} <ArrowRight size={14} />
        </button>
      </div>
      <div className="q-topic-row">
        {CATEGORIES.filter((c) =>
          ["movies", "science", "geography"].includes(c.id),
        ).map((c) => (
          <button
            key={c.id}
            onClick={() =>
              s.startGame(
                c.id,
                getMixedQuestions(QUESTIONS.length, s.seenQuestions)
                  .filter((q) => q.category === c.id)
                  .slice(0, 10),
              )
            }
          >
            <span>{c.emoji}</span>
            {c.name}
          </button>
        ))}
      </div>
      <p className="q-footnote">
        {QUESTIONS.length} вопросов · любопытство без подписки
      </p>
    </div>
  );
}
