"use client";
import { useEffect, useState } from "react";
import { RefreshCw, Trophy } from "lucide-react";
import { getLeaderboard } from "@/lib/supabase";
import { useQuizStore, type LeaderboardEntry } from "@/lib/quiz-store";
import { AVATARS, LEAGUES } from "@/lib/quiz-data";
import { ScreenHeading } from "./QuizUI";
export default function LeaderboardScreen() {
  const s = useQuizStore();
  const [rows, setRows] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getLeaderboard(50);
      setRows(
        data.map((r) => ({
          name: r.player_name,
          score: r.score,
          avatarId: r.avatar_id,
          league: r.league,
          telegramId: r.telegram_id,
        })),
      );
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, []);
  const myId = s.telegramId?.startsWith("vk_")
    ? -Number(s.telegramId.slice(3))
    : Number(s.telegramId);
  return (
    <div className="q-screen">
      <ScreenHeading
        title="Любопытные впереди"
        eyebrow="Общий рейтинг"
        action={
          <button
            className="q-icon-button"
            aria-label="Обновить рейтинг"
            disabled={loading}
            onClick={() => void load()}
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        }
      />
      <div className="q-ranking-intro">
        <Trophy size={38} />
        <div>
          <strong>Каждый раунд имеет значение.</strong>
          <p>Место определяется суммой очков за все игры.</p>
        </div>
      </div>
      {loading ? (
        <p className="q-empty" role="status">
          Загружаем результаты…
        </p>
      ) : error ? (
        <div className="q-empty" role="alert">
          Рейтинг сейчас недоступен. Твой прогресс сохранён на устройстве.
          <button className="q-secondary" onClick={() => void load()}>
            Попробовать ещё раз
          </button>
        </div>
      ) : !rows.length ? (
        <p className="q-empty">
          Пока нет опубликованных результатов. Сыграй первый раунд!
        </p>
      ) : (
        <ol className="q-ranking">
          {rows.map((r, i) => {
            const me = !!s.telegramId && r.telegramId === myId;
            return (
              <li key={r.telegramId ?? i} className={me ? "is-me" : ""}>
                <span className="q-rank-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="q-rank-avatar">
                  {AVATARS.find((a) => a.id === r.avatarId)?.emoji || "🧠"}
                </span>
                <div>
                  <strong>
                    {r.name}
                    {me ? " · ты" : ""}
                  </strong>
                  <small>
                    {LEAGUES.find((l) => l.id === r.league)?.name || "Бронза"}
                  </small>
                </div>
                <b>{r.score.toLocaleString("ru-RU")}</b>
              </li>
            );
          })}
        </ol>
      )}
      <div className="q-league-card">
        <div>
          <span>Твой результат</span>
          <strong>{s.totalScore} очков</strong>
        </div>
        <small>
          {s.telegramId
            ? "Обновится в рейтинге после успешной синхронизации."
            : "В браузере результат локальный. Для облачного профиля открой игру через Telegram или VK."}
        </small>
      </div>
    </div>
  );
}
