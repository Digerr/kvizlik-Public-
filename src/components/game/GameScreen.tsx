"use client";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  X,
  Snowflake,
  Lightbulb,
  LogOut,
  Timer,
  Pause,
  Play,
} from "lucide-react";
import { useQuizStore } from "@/lib/quiz-store";
import { CATEGORIES, CONTINUE_COST } from "@/lib/quiz-data";
import { playCorrect, playWrong, playTick } from "@/lib/sounds";
export default function GameScreen() {
  const s = useQuizStore();
  const [exit, setExit] = useState(false);
  const [paused, setPaused] = useState(false);
  const q = s.questions[s.currentQuestionIndex];
  const survival = s.gameMode === "survival";
  useEffect(() => {
    if (!s.isTimerRunning || exit || paused) return;
    const t = setInterval(() => useQuizStore.getState().tick(), 1000);
    return () => clearInterval(t);
  }, [s.isTimerRunning, exit, paused]);
  useEffect(() => {
    if (s.selectedOption === null || s.isRevealed) return;
    const t = setTimeout(() => useQuizStore.getState().revealAnswer(), 250);
    return () => clearTimeout(t);
  }, [s.selectedOption, s.isRevealed]);
  useEffect(() => {
    if (s.isRevealed) {
      if (s.answers.at(-1)?.isCorrect) playCorrect();
      else playWrong();
    }
  }, [s.isRevealed]);
  useEffect(() => {
    if (s.isTimerRunning && s.timerRemaining === 3) playTick();
  }, [s.timerRemaining, s.isTimerRunning]);
  useEffect(() => {
    const handle = () => {
      if (document.hidden) setPaused(true);
    };
    document.addEventListener("visibilitychange", handle);
    return () => document.removeEventListener("visibilitychange", handle);
  }, []);
  if (!q)
    return (
      <div className="q-screen q-empty">
        <h1>Раунд не загрузился</h1>
        <button className="q-primary" onClick={() => s.playAgain()}>
          Выбрать тему
        </button>
      </div>
    );
  const correct = s.selectedOption === q.correctIndex;
  const wrongSurvival = survival && s.isRevealed && !correct;
  const cat = CATEGORIES.find((c) => c.id === q.category);
  const next = () => {
    if (wrongSurvival) s.endGame();
    else s.nextQuestion();
  };
  return (
    <div className="q-screen q-game">
      <header className="q-game-header">
        <button
          className="q-icon-button"
          aria-label="Выйти из раунда"
          onClick={() => setExit(true)}
        >
          <LogOut size={20} />
        </button>
        <div>
          <span className="q-eyebrow">
            {s.duelMode
              ? "ДУЭЛЬ С ДРУГОМ"
              : survival
                ? "ДО ПЕРВОЙ ОШИБКИ"
                : "РАУНД"}
          </span>
          <strong>
            {s.currentQuestionIndex + 1}
            <span> / {survival ? "∞" : s.questions.length}</span>
          </strong>
        </div>
        <button
          className="q-icon-button"
          aria-label="Пауза"
          onClick={() => setPaused(true)}
        >
          <Pause size={20} />
        </button>
      </header>
      <div className="q-question-track">
        {!survival ? (
          s.questions.map((item, i) => (
            <span
              key={item.id}
              className={
                i < s.answers.length
                  ? s.answers[i].isCorrect
                    ? "correct"
                    : "wrong"
                  : i === s.currentQuestionIndex
                    ? "current"
                    : ""
              }
            />
          ))
        ) : (
          <span className="current" style={{ width: "100%" }} />
        )}
      </div>
      <div className="q-question-meta">
        <span>
          {cat?.emoji} {cat?.name || "Микс"}
        </span>
        <span className={s.timerRemaining <= 3 ? "q-time urgent" : "q-time"}>
          <Timer size={15} />
          {s.freezeTimeRemaining > 0
            ? `❄ ${s.freezeTimeRemaining}`
            : `${s.timerRemaining} сек`}
        </span>
      </div>
      <section className="q-question">
        <span className="q-eyebrow">
          ВОПРОС {String(s.currentQuestionIndex + 1).padStart(2, "0")}
        </span>
        <h1>{q.question}</h1>
      </section>
      <div className="q-answers" aria-label="Варианты ответа">
        {q.options.map((option, i) => {
          const removed = s.fiftyFiftyRemoved.includes(i);
          const state = s.isRevealed
            ? i === q.correctIndex
              ? "correct"
              : i === s.selectedOption
                ? "wrong"
                : "dim"
            : i === s.selectedOption
              ? "selected"
              : "";
          return (
            <button
              key={i}
              className={`q-answer ${state} ${removed ? "removed" : ""}`}
              disabled={
                s.isRevealed ||
                s.selectedOption !== null ||
                removed ||
                paused ||
                exit
              }
              onClick={() => s.selectOption(i)}
            >
              <span className="q-answer-letter">
                {s.isRevealed && i === q.correctIndex ? (
                  <Check size={18} />
                ) : s.isRevealed && i === s.selectedOption ? (
                  <X size={18} />
                ) : (
                  "АБВГ"[i]
                )}
              </span>
              <span>{removed ? "Убрано подсказкой" : option}</span>
            </button>
          );
        })}
      </div>
      {s.isHintActive && !s.isRevealed && (
        <div className="q-feedback">
          <Lightbulb size={18} />
          <p>
            Правильный ответ начинается с «
            {q.options[q.correctIndex].slice(0, 1)}».
          </p>
        </div>
      )}
      {!s.isRevealed && (
        <div className="q-tools">
          <button
            disabled={
              !s.powerUps.fiftyFifty ||
              s.isFiftyFiftyActive ||
              q.options.length < 4 ||
              s.selectedOption !== null
            }
            onClick={() => s.usePowerUp("fiftyFifty")}
          >
            <strong>50:50</strong>
            <span>{s.powerUps.fiftyFifty}</span>
          </button>
          <button
            disabled={
              !s.powerUps.freeze ||
              s.freezeTimeRemaining > 0 ||
              s.selectedOption !== null
            }
            onClick={() => s.usePowerUp("freeze")}
          >
            <Snowflake size={18} />
            <span>Пауза · {s.powerUps.freeze}</span>
          </button>
          <button
            disabled={
              !s.powerUps.hint || s.isHintActive || s.selectedOption !== null
            }
            onClick={() => s.usePowerUp("hint")}
          >
            <Lightbulb size={18} />
            <span>{s.powerUps.hint}</span>
          </button>
        </div>
      )}
      {s.isRevealed && (
        <>
          <div
            className={`q-feedback ${correct ? "correct" : "wrong"}`}
            role="status"
          >
            <span>{correct ? <Check size={19} /> : <X size={19} />}</span>
            <div>
              <strong>
                {correct
                  ? "Именно так!"
                  : s.selectedOption === null
                    ? "Время вышло"
                    : "Теперь ты знаешь"}
              </strong>
              <p>
                {q.funFact || `Правильный ответ: ${q.options[q.correctIndex]}`}
              </p>
            </div>
          </div>
          {wrongSurvival && !s.continueUsed && s.coins >= CONTINUE_COST && (
            <button className="q-secondary" onClick={() => s.useContinue()}>
              Ещё один шанс · {CONTINUE_COST} монет
            </button>
          )}
          <button className="q-primary" onClick={next}>
            {wrongSurvival
              ? "Посмотреть результат"
              : !survival && s.currentQuestionIndex === s.questions.length - 1
                ? "Мой результат"
                : "Следующий вопрос"}
            <ArrowRight size={21} />
          </button>
        </>
      )}
      <div className="q-game-bottom">
        <span>{s.answers.filter((a) => a.isCorrect).length} правильных</span>
        <span>
          {s.currentStreak > 1
            ? `${s.currentStreak} подряд 🔥`
            : "Любопытство побеждает"}
        </span>
      </div>
      {(paused || exit) && (
        <div className="q-modal-backdrop">
          <section
            className="q-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pause-title"
          >
            <span className="q-eyebrow">
              {exit ? "ВЫХОД ИЗ РАУНДА" : "ПАУЗА"}
            </span>
            <h2 id="pause-title">
              {exit ? "Уже уходишь?" : "Никуда не спешим."}
            </h2>
            <p>
              {exit
                ? "Очки за незаконченный раунд не начислятся. Полученные знания останутся с тобой."
                : "Таймер остановлен. Продолжай, когда будешь готов."}
            </p>
            <button
              className="q-primary"
              autoFocus
              onClick={() => {
                setPaused(false);
                setExit(false);
              }}
            >
              Продолжить <Play size={18} />
            </button>
            {exit && (
              <button
                className="q-secondary"
                onClick={() => {
                  s.playAgain();
                  s.setPhase("home");
                }}
              >
                Выйти на главную
              </button>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
