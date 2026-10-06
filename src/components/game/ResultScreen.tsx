"use client";
import { useState } from "react";
import { ArrowRight, Check, Gift, Share2, Swords, X } from "lucide-react";
import { useQuizStore } from "@/lib/quiz-store";
import { useTelegram } from "@/hooks/use-telegram";
import { LEAGUES, getLeagueProgress } from "@/lib/quiz-data";
import { ScreenHeading } from "./QuizUI";
export default function ResultScreen() {
  const s = useQuizStore();
  const { platform, share, shareDuel, getReferralLink } = useTelegram();
  const [review, setReview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const r = s.roundSummary;
  if (!r)
    return (
      <div className="q-screen">
        <ScreenHeading title="Твой результат" />
        <p className="q-intro">Этот раунд уже закрыт. Начнём новый?</p>
        <button className="q-primary" onClick={() => s.playAgain()}>
          Играть <ArrowRight size={20} />
        </button>
      </div>
    );
  const league = LEAGUES.find((l) => l.id === s.currentLeague) || LEAGUES[0];
  const title = s.duelResult
    ? s.duelResult.myScore === s.duelResult.opponentScore
      ? "На равных!"
      : s.duelResult.won
        ? "Ты победил!"
        : "Есть реванш."
    : r.accuracy === 100
      ? "Без единой ошибки."
      : r.accuracy >= 70
        ? "Вот это кругозор!"
        : r.accuracy >= 40
          ? "Уже знаешь больше."
          : "Любопытство — начало.";
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        s.duelShareLink ||
          `Квизлик: ${r.correct}/${r.answered} правильных, ${r.score} очков. ${getReferralLink()}`,
      );
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  };
  return (
    <div className="q-screen q-result">
      <ScreenHeading
        title="Раунд завершён"
        eyebrow={
          s.gameMode === "survival"
            ? "Выживание"
            : s.duelMode
              ? "Дуэль"
              : "Новые знания — твои"
        }
      />
      <section className="q-result-hero">
        <span className="q-eyebrow">
          {s.duelResult
            ? `ПРОТИВ ${s.duelResult.opponentName}`
            : "ПРАВИЛЬНЫЕ ОТВЕТЫ"}
        </span>
        <div className="q-result-number">
          {r.correct}
          <span>/{r.answered}</span>
        </div>
        <h1>{title}</h1>
        <p>
          {s.duelResult
            ? `Твой счёт ${s.duelResult.myScore} · счёт друга ${s.duelResult.opponentScore}`
            : `${r.accuracy}% точности. Каждый вопрос — маленькое открытие.`}
        </p>
      </section>
      <div className="q-result-stats">
        <div>
          <strong>+{r.score}</strong>
          <span>очков</span>
        </div>
        <div>
          <strong>+{r.coins}</strong>
          <span>монет за раунд</span>
        </div>
        <div>
          <strong>{r.bestStreak}</strong>
          <span>лучшая серия</span>
        </div>
      </div>
      {s.pendingChest && (
        <div className="q-reward-card">
          <Gift size={26} />
          <div>
            <strong>Твой бонус ждёт</strong>
            <small>
              Ещё {s.pendingChest.rewards.coins} монет
              {s.pendingChest.rewards.avatarId ? " и новый аватар" : ""}
            </small>
          </div>
          <button onClick={() => s.openChest()}>Забрать</button>
        </div>
      )}
      <div className="q-league-card">
        <div>
          <span>
            {league.emoji} {league.name}
          </span>
          <strong>{s.totalScore} очков</strong>
        </div>
        <div className="q-progress">
          <span style={{ width: `${getLeagueProgress(s.totalScore)}%` }} />
        </div>
        <small>
          {league.id === "diamond"
            ? "Высшая лига. Продолжай удивлять себя."
            : "Каждый раунд приближает тебя к следующей лиге."}
        </small>
      </div>
      {s.duelShareLink ? (
        <button
          className="q-primary"
          onClick={() =>
            platform === "web"
              ? void copy()
              : shareDuel(
                  s.duelShareLink!,
                  "Пройди те же 10 вопросов и побей мой результат!",
                )
          }
        >
          <Swords size={20} />
          {copied ? "Ссылка скопирована" : "Вызвать друга"}
        </button>
      ) : (
        <button className="q-primary" onClick={() => s.playAgain()}>
          Ещё один раунд <ArrowRight size={21} />
        </button>
      )}
      <div className="q-result-actions">
        <button
          className="q-secondary"
          onClick={() => {
            if (s.duelShareLink || platform === "web") void copy();
            else
              share(
                getReferralLink(),
                `Я ответил на ${r.correct} из ${r.answered} вопросов в Квизлике. Попробуешь?`,
              );
          }}
        >
          <Share2 size={17} />
          {copied
            ? "Ссылка скопирована"
            : s.duelShareLink
              ? "Скопировать вызов"
              : "Поделиться"}
        </button>
        <button
          className="q-secondary"
          aria-expanded={review}
          onClick={() => setReview(!review)}
        >
          {review ? "Скрыть ответы" : "Разобрать ответы"}
        </button>
      </div>
      {copyError && (
        <p role="alert" className="q-footnote">
          Не удалось скопировать.{" "}
          {s.duelShareLink && (
            <input
              aria-label="Ссылка на дуэль"
              readOnly
              value={s.duelShareLink}
              onFocus={(e) => e.target.select()}
            />
          )}
        </p>
      )}
      {review && (
        <div className="q-review">
          {s.answers.map((a, i) => {
            const q = s.questions.find((q) => q.id === a.questionId);
            if (!q) return null;
            return (
              <article key={`${a.questionId}-${i}`}>
                <div className="q-review-label">
                  {a.isCorrect ? <Check size={16} /> : <X size={16} />}ВОПРОС{" "}
                  {i + 1}
                </div>
                <h3>{q.question}</h3>
                {!a.isCorrect && (
                  <p>
                    Твой ответ:{" "}
                    {a.selectedOption < 0
                      ? "Время вышло"
                      : q.options[a.selectedOption]}
                  </p>
                )}
                <strong>{q.options[q.correctIndex]}</strong>
                <p>{q.funFact}</p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
