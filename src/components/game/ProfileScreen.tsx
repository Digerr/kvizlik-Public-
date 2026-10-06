"use client";
import { useState } from "react";
import {
  Award,
  Check,
  Gift,
  Palette,
  ShoppingBag,
  HelpCircle,
  Shield,
  Flame,
} from "lucide-react";
import { useQuizStore, calcXpForLevel } from "@/lib/quiz-store";
import { AVATARS, CATEGORIES, LEAGUES } from "@/lib/quiz-data";
import { ScreenHeading, Shortcut } from "./QuizUI";
export default function ProfileScreen() {
  const s = useQuizStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(s.playerName);
  const avatar = AVATARS.find((a) => a.id === s.avatarId) || AVATARS[0];
  const league = LEAGUES.find((l) => l.id === s.currentLeague) || LEAGUES[0];
  const xpStart = calcXpForLevel(s.level),
    xpNext = calcXpForLevel(s.level + 1);
  const stats = Object.entries(s.categoryStats)
    .filter(([, v]) => v.played > 0)
    .sort((a, b) => b[1].played - a[1].played);
  return (
    <div className="q-screen">
      <ScreenHeading title="Твой кругозор" eyebrow="Всё, что ты уже открыл" />
      <section className="q-profile-card">
        <span className="q-profile-avatar">{avatar.emoji}</span>
        <div>
          <h2>{s.playerName || "Любопытный игрок"}</h2>
          <button
            className="q-text-button"
            onClick={() => setEditing(!editing)}
          >
            Изменить имя
          </button>
        </div>
        <span className="q-pill">УР. {s.level}</span>
      </section>
      {editing && (
        <form
          className="q-name-form"
          onSubmit={(e) => {
            e.preventDefault();
            s.setPlayerName(name.trim().slice(0, 40) || "Игрок");
            void s.syncToCloud();
            setEditing(false);
          }}
        >
          <input
            aria-label="Твоё имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
          />
          <button aria-label="Сохранить имя">
            <Check size={20} />
          </button>
        </form>
      )}
      <div className="q-league-card">
        <div>
          <span>
            {league.emoji} {league.name}
          </span>
          <strong>{s.totalXP} XP</strong>
        </div>
        <div className="q-progress">
          <span
            style={{
              width: `${Math.min(100, ((s.totalXP - xpStart) / (xpNext - xpStart)) * 100)}%`,
            }}
          />
        </div>
        <small>
          До уровня {s.level + 1}: {Math.max(0, xpNext - s.totalXP)} XP
        </small>
      </div>
      <div className="q-stats-row">
        <div>
          <strong>{s.gamesPlayed}</strong>
          <span>раундов</span>
        </div>
        <div>
          <strong>{s.coins}</strong>
          <span>монет</span>
        </div>
        <div>
          <strong>
            {s.dailyStreak}
            <Flame size={16} />
          </strong>
          <span>дней подряд</span>
        </div>
      </div>
      <div className="q-section-label">
        <h2>Твои сильные стороны</h2>
      </div>
      {stats.length ? (
        <div className="q-category-stats">
          {stats.map(([id, v]) => {
            const c = CATEGORIES.find((c) => c.id === id);
            return (
              <div key={id}>
                <span>
                  {c?.emoji} {c?.name || id}
                </span>
                <strong>{Math.round((v.correct / v.played) * 100)}%</strong>
                <div className="q-progress">
                  <span style={{ width: `${(v.correct / v.played) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="q-empty">
          Пройди первый раунд — здесь появятся твои результаты по темам.
        </p>
      )}
      <div className="q-section-label">
        <h2>Награды и настройки</h2>
      </div>
      <div className="q-profile-shortcuts">
        <Shortcut
          icon={<Award size={21} />}
          title="Достижения"
          detail={`${s.unlockedAchievements.length} уже открыто`}
          onClick={() => s.setPhase("achievements")}
        />
        <Shortcut
          icon={<Gift size={21} />}
          title="Задания на сегодня"
          detail="Небольшие цели и бонусы"
          onClick={() => s.setPhase("daily")}
        />
        <Shortcut
          icon={<ShoppingBag size={21} />}
          title="Магазин за монеты"
          detail="Подсказки и аватары"
          onClick={() => s.setPhase("shop")}
        />
        <Shortcut
          icon={<Palette size={21} />}
          title="Оформление"
          detail="Выбери настроение игры"
          onClick={() => s.setPhase("themes")}
        />
        <Shortcut
          icon={<HelpCircle size={21} />}
          title="Как играть"
          detail="Вопросы и ответы"
          onClick={() => s.setPhase("faq")}
        />
        <Shortcut
          icon={<Shield size={21} />}
          title="Приватность"
          detail="Как хранятся данные"
          onClick={() => s.setPhase("privacy_policy")}
        />
      </div>
      <p className="q-footnote">
        {s.telegramId
          ? s.isCloudSyncing
            ? "Синхронизируем прогресс…"
            : s.cloudError
              ? "Облако недоступно · прогресс сохранён на устройстве"
              : "Прогресс на устройстве · облако подключено"
          : "Прогресс сохраняется в этом браузере"}
        <br />
        Квизлик 5.0
      </p>
      {s.telegramId && s.cloudError && (
        <button
          className="q-secondary"
          disabled={s.isCloudSyncing}
          onClick={() =>
            void (s.isCloudLoaded ? s.syncToCloud() : s.syncFromCloud())
          }
        >
          Повторить синхронизацию
        </button>
      )}
    </div>
  );
}
