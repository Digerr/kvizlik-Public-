"use client";
import { useEffect } from "react";
import { Check, Flame, Gift } from "lucide-react";
import { useQuizStore } from "@/lib/quiz-store";
import { DAILY_CHAIN } from "@/lib/quiz-data";
import { localDate } from "@/lib/round";
import { ScreenHeading } from "./QuizUI";
export default function DailyScreen() {
  const s = useQuizStore();
  useEffect(() => {
    s.checkDailyReset();
    s.refreshDailyTasks();
    s.checkDailyChain();
  }, []);
  return (
    <div className="q-screen">
      <ScreenHeading
        title="Чуть лучше, чем вчера"
        eyebrow="Задания на сегодня"
      />
      <div className="q-daily-hero">
        <Flame size={32} />
        <div>
          <strong>{s.dailyStreak} дней любопытства</strong>
          <p>Один законченный раунд — уже хороший шаг.</p>
        </div>
      </div>
      <div className="q-task-list">
        {s.dailyTasks.map((t) => {
          const ready = t.progress >= t.target;
          return (
            <article key={t.id}>
              <div className="q-task-top">
                <span className="q-shortcut-icon">
                  {t.claimed ? <Check size={21} /> : t.emoji}
                </span>
                <div>
                  <h2>{t.name}</h2>
                  <p>{t.description}</p>
                </div>
                <strong>+{t.reward}</strong>
              </div>
              <div className="q-progress">
                <span
                  style={{
                    width: `${Math.min(100, (t.progress / t.target) * 100)}%`,
                  }}
                />
              </div>
              <div className="q-task-bottom">
                <span>
                  {Math.min(t.progress, t.target)} / {t.target}
                </span>
                <button
                  disabled={!ready || t.claimed}
                  onClick={() => s.claimDailyReward(t.id)}
                >
                  {t.claimed
                    ? "Получено"
                    : ready
                      ? "Забрать монеты"
                      : "В процессе"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <div className="q-section-label">
        <h2>Семь дней подряд</h2>
        <Gift size={18} />
      </div>
      <div className="q-chain">
        {DAILY_CHAIN.map((d, i) => (
          <button
            key={i}
            disabled={
              s.dailyChainCompleted[i] ||
              s.dailyChainDay !== i ||
              s.dailyChainClaimedAt === localDate() ||
              s.lastDailyAt !== localDate()
            }
            onClick={() => s.claimDailyChain(i)}
            className={
              s.dailyChainCompleted[i]
                ? "claimed"
                : s.dailyChainDay === i &&
                    s.dailyChainClaimedAt !== localDate() &&
                    s.lastDailyAt === localDate()
                  ? "ready"
                  : ""
            }
          >
            <span>День {i + 1}</span>
            <strong>
              {s.dailyChainCompleted[i] ? (
                <Check size={18} />
              ) : d.rewardType === "silver_chest" ? (
                "🎁"
              ) : (
                "🪙"
              )}
            </strong>
            <small>
              {d.rewardType === "silver_chest" ? "Сундук" : `${d.reward} монет`}
            </small>
          </button>
        ))}
      </div>
      <p className="q-footnote">
        Задания обновляются в полночь по времени устройства.
        <br />
        Монеты — игровая валюта.
      </p>
    </div>
  );
}
